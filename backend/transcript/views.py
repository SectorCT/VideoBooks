from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from asgiref.sync import sync_to_async
from backend.models import TranscriptionCache  # Import the model
import os
import hashlib
import whisper
import torch
import asyncio
from tempfile import NamedTemporaryFile
import subprocess

# Load Whisper model once (can be changed to load different models)
device = "cuda" if torch.cuda.is_available() else "cpu"
model = whisper.load_model('base', device=device)

# Async function to transcribe audio
async def get_transcribe(audio: str, language: str = 'en'):
    return await sync_to_async(model.transcribe)(audio=audio, language=language, word_timestamps=True)

# Async function to convert MP3 to WAV using ffmpeg
async def convert_mp3_to_wav(mp3_path: str, wav_path: str):
    command = ['ffmpeg', '-i', mp3_path, wav_path]
    proc = await asyncio.create_subprocess_exec(
        *command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    await proc.communicate()  # Wait for the conversion to finish

# Function to generate a cache key based on the audio file
def generate_cache_key(audio_filename: str):
    return hashlib.md5(audio_filename.encode()).hexdigest()

# Main transcription view
@csrf_exempt
async def transcribe_audio(request):
    if request.method == 'POST':
        # Check if 'audio' file is part of the request
        if 'audio' not in request.FILES:
            return JsonResponse({'error': 'No audio file provided'}, status=400)

        audio_file = request.FILES.get('audio')

        if not audio_file:
            return JsonResponse({'error': 'No file uploaded'}, status=400)

        # Define the path to save the file in the media folder
        audio_filename = f"temp_{audio_file.name}"
        media_path = os.path.join(settings.MEDIA_ROOT, audio_filename)

        # Save the file to the media folder
        try:
            with open(media_path, 'wb') as temp_file:
                for chunk in audio_file.chunks():
                    temp_file.write(chunk)

            print(f"Received audio file: {audio_filename}")

            # If MP3, convert to WAV asynchronously
            if audio_filename.lower().endswith('.mp3'):
                wav_path = media_path.rsplit('.', 1)[0] + '.wav'
                await convert_mp3_to_wav(media_path, wav_path)
                media_path = wav_path

            # Generate cache key
            cache_key = generate_cache_key(audio_filename)

            # Check the database cache for an existing result
            cached_transcription = await sync_to_async(TranscriptionCache.objects.filter(audio_filename=cache_key).first)()
            if cached_transcription:
                return JsonResponse(cached_transcription.transcription_data)  # Return the cached JSON result

            # Perform transcription asynchronously
            print(f"Transcribing {media_path} on device: {device}")
            result = await get_transcribe(audio=media_path)

            # Cache the full JSON result in the database
            transcription_cache = TranscriptionCache(
                audio_filename=cache_key,
                transcription_data=result  # Store the entire transcription result as JSON
            )
            await sync_to_async(transcription_cache.save)()

            return JsonResponse(result)  # Return the transcription as JSON

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=505)

        finally:
            # Clean up temp file, ignore if file doesn't exist
            try:
                if os.path.exists(media_path):
                    os.remove(media_path)
            except FileNotFoundError:
                pass

    return JsonResponse({'error': 'Invalid request method'}, status=405)
