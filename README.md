# Story Frame
## What is it?
Story Frame is a unique website designed to turn audiobooks into a visually immersive experience. It is especially useful for:

- People who struggle to focus solely on audio.
- Individuals with aphantasia who have difficulty visualizing things in their mind.
- Young children who are learning to enjoy audiobooks and need a visual aid to stay engaged.
- Anyone who prefers additional visuals to enhance their audiobook experience.

Story frame makes it so as the audiobook plays, AI-generated dynamic pictures (which have slight movement in them) are displayed, matching the narrative in real-time.

## How It Works
- Upload your audiobook: Simply upload your audiobook file into the platform.
- Speech-to-Text: Whisper automatically transcribes the audio into text.
- Descriptive Prompt Creation: The text is passed to ChatGPT, which generates a descriptive prompt of the current scene or setting.
- Image Generation: Stable Diffusion generates an AI-generated image based on the prompt.
- Dynamic Image Animation: The static image is then passed to Stable Diffusion's Automatic 1111 tool, which adds subtle movement to create a dynamic, animated visual
- Seamless Visual Updates: The dynamic moving image is updated every few seconds, offering a continuous flow of visuals that align with the audiobook’s content.

## Future Improvements
- A memory system - long term and short term memory which will be reinforced into ChatGPT when creating the visuals to strenghten their context
- A character avatar system - when a new character in the book gets introduced a card will be generated which shows how they look. If they don't resemble the image you had in your had you can regenrate it with an additional user-inputted prompt to specify what you'd like to change. Every scene, which contains the character will then receive the character card image as an input to keep the images of all characters consistent.

## Technologies Used
- Whisper: For transcribing audiobook audio into text.
- ChatGPT: For generating descriptive scene prompts.
- Stable Diffusion: For creating dynamic images based on those prompts.
  
