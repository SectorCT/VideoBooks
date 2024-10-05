import json
from django.http import JsonResponse
from .gpt_calls import call_gpt
from .get_image import get_image
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def return_gpt_response(request):
    json_data = json.loads(request.body)
    text = json_data['text']
    response = call_gpt(text)
    response = response.replace('"', '')
    return JsonResponse({'response': response})

@csrf_exempt
def return_image(request):
    json_data = json.loads(return_gpt_response(request).content)
    print(json_data)
    prompt = json_data['response']
    image_base64 = get_image(prompt)
    return JsonResponse({'image': image_base64})