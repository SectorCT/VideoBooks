# transcriber/views.py

import os
import subprocess
import hashlib
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache
import whisper
from django.conf import settings

# Load Whisper model once (can be changed to load different models)
model = whisper.load_model('base')

# Function to transcribe audio
def get_transcribe(audio: str, language: str = 'en'):
    return model.transcribe(audio=audio, language=language, word_timestamps=True)

# Function to convert MP3 to WAV
def convert_mp3_to_wav(mp3_path: str, wav_path: str):
    command = ['ffmpeg', '-i', mp3_path, wav_path]
    subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# Function to generate a cache key based on the audio file
def generate_cache_key(audio_filename: str):
    return hashlib.md5(audio_filename.encode()).hexdigest()

# Main transcription view
@csrf_exempt
def transcribe_audio(request):
    if request.method == 'POST':
        # Check if 'audio' file is part of the request
        if 'audio' not in request.FILES:
            return JsonResponse({'error': 'No audio file provided'}, status=400)
        
        audio_file = request.FILES['audio']

        # Save file to a temporary location
        audio_filename = audio_file.name
        audio_path = os.path.join(settings.MEDIA_ROOT, f"temp_{audio_filename}")
        with open(audio_path, 'wb') as f:
            for chunk in audio_file.chunks():
                f.write(chunk)

        # If MP3, convert to WAV
        if audio_filename.lower().endswith('.mp3'):
            wav_path = audio_path.rsplit('.', 1)[0] + '.wav'
            convert_mp3_to_wav(audio_path, wav_path)
            audio_path = wav_path

        # Generate cache key
        cache_key = generate_cache_key(audio_filename)

        # Check cache
        cached_result = cache.get(cache_key)
        if cached_result:
            return JsonResponse(cached_result)

        # Perform transcription
        try:
            print("Transcribing " + audio_path)
            result = get_transcribe(audio=audio_path)
            cache.set(cache_key, result)  # Cache the result
            return JsonResponse(result)  # Return the transcription as JSON
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        finally:
            # Clean up temp file
            if os.path.exists(audio_path):
                os.remove(audio_path)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
