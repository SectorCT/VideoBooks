import json
from django.http import JsonResponse
from .gpt_calls import call_gpt
from .get_image import get_image
from .upscale_image import upscale_image
from django.views.decorators.csrf import csrf_exempt
from backend.models import ImageCache, TranscriptionCache
import hashlib
import os
from transcript.views import generate_cache_key

@csrf_exempt
def return_gpt_response(request):
    json_data = json.loads(request.body)
    text = json_data['text']
    response = call_gpt(text)
    response = response.replace('"', '')
    return JsonResponse({'response': response})

@csrf_exempt
def return_image(request):
    text = json.loads(request.body)['text']
    print(text)

    cache_key = hashlib.md5(text.encode()).hexdigest()
    print(cache_key)

    cached_image = ImageCache.objects.filter(text=cache_key).first()

    if cached_image:
        return JsonResponse({'image': cached_image.image_base64})

    print("Image not found in cache, generating new image...")
    json_data = json.loads(return_gpt_response(request).content)
    print(json_data)
    prompt = json_data['response']
    image_base64 = get_image(prompt)

    image_cache = ImageCache(text=cache_key, image_base64=image_base64)
    image_cache.save()

    return JsonResponse({'image': image_base64})

@csrf_exempt
def return_upscaled_image(request):
    json_data = json.loads(return_image(request).content)
    image_base64 = json_data['image']
    image_base64_upscaled = upscale_image(image_base64)
    return JsonResponse({'image': image_base64_upscaled})

@csrf_exempt
def return_book_transcription(request):
    if request.method == 'GET':
        # Extract any query parameters from the request (optional)
        book_server_id = request.GET.get('book.serverId', None)  # Get the book server ID from the query parameter
        if not book_server_id:
            return JsonResponse({'error': 'Missing book server ID'}, status=400)
        param_value = book_server_id

        # You can perform any logic here, such as querying a database

        cache_key = generate_cache_key(param_value)
        cached_transcription = TranscriptionCache.objects.filter(audio_filename=cache_key).first()
        if cached_transcription:
            return JsonResponse(cached_transcription.transcription_data)
        
        else:
            return JsonResponse({'error': 'Transcription not found'}, status=404)