from openai import OpenAI

import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(
    api_key=OPENAI_API_KEY
)

def call_gpt(text):
    stream = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You must generate a prompt for stable diffusion based on the following text:"}, 
            {"role": "user", "content": text}
        ],
        stream=False,
    )
    return stream.choices[0].message.content
    