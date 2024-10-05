import json
from django.http import JsonResponse
from .gpt_calls import call_gpt
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def return_gpt_response(request):
    json_data = json.loads(request.body)
    text = json_data['text']
    response = call_gpt(text)
    return JsonResponse({'response': response})