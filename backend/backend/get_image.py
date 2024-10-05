import requests
import json
import base64

def get_image(prompt):
    # Define the API endpoint URL
    url = 'http://192.168.111.114:7860/sdapi/v1/txt2img'

    # Define the payload with parameters for text-to-image generation
    payload = {
        "prompt": prompt,
        "steps": 50,                # Number of inference steps (default is 50)
        "cfg_scale": 7.5,           # How much the model should follow the prompt (default is 7.5)
        "width": 480,               # Width of the output image
        "height": 270,              # Height of the output image
        "sampler_index": "Euler",   # Optional: specify the sampler (e.g., Euler, DDIM, etc.)
    }

    # Set the headers for the request (optional, depending on your API setup)
    headers = {
        'Content-Type': 'application/json'
    }

    # Send the POST request to the Stable Diffusion API
    response = requests.post(url, headers=headers, data=json.dumps(payload))

    # Check if the request was successful
    if response.status_code == 200:
        print("Image generation successful!")
        # Get the response as JSON
        response_json = response.json()
        
        # The images are usually returned as Base64 strings in the 'images' key
        images_base64 = response_json.get("images", [])
        
        # Optionally, save the image as a file
        if images_base64:
            image_data = images_base64[0]  # Get the first generated image (Base64)
            
            # Decode the Base64 image to binary and save it as a PNG file
            with open("generated_image.png", "wb") as img_file:
                img_file.write(base64.b64decode(image_data))
            print("Image saved as 'generated_image.png'")

            return images_base64[0]
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return None
