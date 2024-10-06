import requests
import base64
import json
from dotenv import load_dotenv
import os

def upscale_image(image_base64):
    # Define the API endpoint for img2img
    url = f'{os.getenv("STABLE_DIFFUSION_IP")}/sdapi/v1/img2img'

    # Define the payload with parameters for the img2img request (upscaling)
    payload = {
        "init_images": [image_base64],  # Initial image in Base64 format
        "prompt": "Upscale this image",  # You can provide a prompt, but it's optional for upscaling
        "steps": 20,                    # Number of steps to process
        "cfg_scale": 7.0,               # CFG scale, usually between 7-10
        "width": 854,                  # New width (upscaled width)
        "height": 480,                 # New height (upscaled height)
        "denoising_strength": 0.2,      # Denoising strength (low value keeps the original image more intact)
        "sampler_index": "Euler",       # Optional: Specify the sampler (Euler, DDIM, etc.)
    }

    override_settings = {}
    override_settings["sd_model_checkpoint"] = "v1-5-pruned-emaonly.safetensors [6ce0161689]"

    override_payload = {
        "override_settings": override_settings
    }
    payload.update(override_payload)

    # Set the headers (optional, depending on your API setup)
    headers = {
        'Content-Type': 'application/json'
    }

    # Send the POST request to the img2img endpoint
    response = requests.post(url, headers=headers, data=json.dumps(payload))

    # Check if the request was successful
    if response.status_code == 200:
        print("Image upscaling successful!")
        response_json = response.json()

        # The images are returned as Base64 strings
        images_base64 = response_json.get("images", [])

        # Save the upscaled image as a file
        if images_base64:
            upscaled_image_data = images_base64[0]  # Get the first generated image

            # Decode the Base64 image and save it
            with open("upscaled_image.png", "wb") as img_file:
                img_file.write(base64.b64decode(upscaled_image_data))
            print("Upscaled image saved as 'upscaled_image.png'")
            return images_base64[0]
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return None