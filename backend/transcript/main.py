from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_caching import Cache
import whisper
import os
import subprocess
import hashlib

# Initialize the Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Configure caching
cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache', 'CACHE_DEFAULT_TIMEOUT': 3600})  # Cache for 1 hour

# Load the Whisper model once
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
    return hashlib.md5(audio_filename.encode()).hexdigest()  # Generate a hash of the filename

# HTTP route to handle the POST request
@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    # Check if the request has a file
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    
    audio_file = request.files['audio']
    
    # Check file extension
    audio_filename = audio_file.filename
    audio_path = f"./temp_{audio_filename}"  # Temporary file path
    audio_file.save(audio_path)

    # If the file is MP3, convert it to WAV
    if audio_filename.lower().endswith('.mp3'):
        wav_path = audio_path.rsplit('.', 1)[0] + '.wav'  # Change extension to .wav
        convert_mp3_to_wav(audio_path, wav_path)
        audio_path = wav_path  # Update audio_path to point to the new WAV file

    # Generate a cache key based on the audio filename
    cache_key = generate_cache_key(audio_filename)

    # Check if the result is in the cache
    cached_result = cache.get(cache_key)
    if cached_result:
        return jsonify(cached_result)  # Return cached result if available

    # Perform transcription
    try:
        result = get_transcribe(audio=audio_path)
        cache.set(cache_key, result)  # Store the result in the cache
        return jsonify(result)  # Return the transcription as a JSON response
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Remove the temporary file after transcription
        os.remove(audio_path)

# Run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
