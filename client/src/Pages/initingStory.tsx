import React, { useEffect } from "react";

import { Transcription, StorySegment } from "../types";

interface InitingStoryProps {
  transcription: Transcription;
  setStorySegments: (images: StorySegment[]) => void;
}



const MINIMUM_STORY_SEGMENT_DURATION = 15;


const GENERATE_IMAGE_API_URL = process.env.REACT_APP_GENERATE_IMAGE_API_URL || "http://127.0.0.1:8000/return_image/";

async function generateImage(text: string, storySegment: StorySegment) {
  const response = await fetch(GENERATE_IMAGE_API_URL, {
    method: 'POST', // Use POST if sending a body
    headers: {
      'Content-Type': 'application/json' // Set correct header
    },
    body: JSON.stringify({ text }), // Send JSON body
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const result = await response.json();
  storySegment.image = result.image;
}

export default function InitingStory({ transcription, setStorySegments }: InitingStoryProps) {
  React.useEffect(() => {
    const segments = transcription.segments;
    const storySegments: StorySegment[] = [];
    
    let currentStorySegment: StorySegment = {
        transciptionSegments: [segments[0]],
        start: segments[0].start,
        end: segments[0].end,
        image: "",
        text: ""
    }

    let lastSegmentEnd = 0;

    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i];
      const segmentDuration = segment.end - segment.start;
      const currentStorySegmentDuration = currentStorySegment.end - currentStorySegment.start;

      if (currentStorySegment.start < lastSegmentEnd) {
        currentStorySegment.start = segment.start;
      }


      if (currentStorySegmentDuration + segmentDuration >= MINIMUM_STORY_SEGMENT_DURATION) {
        currentStorySegment.transciptionSegments.push(segment);
        currentStorySegment.end = segment.end;
        generateImage(currentStorySegment.text, currentStorySegment);

        lastSegmentEnd = segment.end;
        storySegments.push(currentStorySegment);
        currentStorySegment = {
          transciptionSegments: [],
          start: 0,
          end: 0,
          image: "",
          text: ""
        }
      } else {
        currentStorySegment.transciptionSegments.push(segment);
        currentStorySegment.end = segment.end;
      }
    }

    if (currentStorySegment.transciptionSegments.length > 0) {
      generateImage(currentStorySegment.text, currentStorySegment);

      storySegments.push(currentStorySegment);
    }

    for (let i = 0; i < storySegments.length; i++) {
      const segment = storySegments[i];
      for (let j = 0; j < segment.transciptionSegments.length; j++) {
        segment.text += segment.transciptionSegments[j].text + " ";
      }
    }

    setStorySegments(storySegments)
  }, [transcription]);

  return (
    <div>
      <h1>Initing Story</h1>
    </div>
  );
}