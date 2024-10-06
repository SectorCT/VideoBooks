import React, { useEffect } from "react";
import { Transcription, StorySegment } from "../types";

// Remove any extra quotes or slashes here
const GENERATE_IMAGE_API_URL = process.env.REACT_APP_TRANSCRIPTION_API_URL ;
console.log(GENERATE_IMAGE_API_URL);


async function generateImage(text: string, storySegment: StorySegment) {
  const response = await fetch(`${GENERATE_IMAGE_API_URL}/return_image/`, {
    method: "POST", // Use POST if sending a body
    // force http version to 1.1 to avoid a bug in the server
    // headers: {
    headers: {
        // force http version to 1.1 to avoid a bug in the server
        "Connection": "keep-alive",
        "httpVersion": "1.1",
        "Content-Type": "application/json", // Set correct header
    },
    body: JSON.stringify({ text }), // Send JSON body
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const result = await response.json();
  storySegment.image = result.image;
}


interface InitingStoryProps {
    transcription: Transcription;
    setStorySegments: (images: StorySegment[]) => void;
}

const MINIMUM_STORY_SEGMENT_DURATION = 15;

export default function InitingStory({
    transcription,
    setStorySegments,
}: InitingStoryProps) {
    useEffect(() => {
        const segments = transcription.segments;
        const storySegments: StorySegment[] = [];

        let currentStorySegment: StorySegment = {
            transciptionSegments: [segments[0]],
            start: segments[0].start,
            end: segments[0].end,
            image: "",
            text: segments[0].text, // Initialize the text with the first segment text
        };

        let lastSegmentEnd = 0;

        for (let i = 1; i < segments.length; i++) {
            const segment = segments[i];
            const segmentDuration = segment.end - segment.start;
            const currentStorySegmentDuration =
                currentStorySegment.end - currentStorySegment.start;

            if (currentStorySegment.start < lastSegmentEnd) {
                currentStorySegment.start = segment.start;
            }

            if (
                currentStorySegmentDuration + segmentDuration >=
                MINIMUM_STORY_SEGMENT_DURATION
            ) {
                // Push current segment to currentStorySegment
                currentStorySegment.transciptionSegments.push(segment);
                currentStorySegment.end = segment.end;

                // Combine all text in currentStorySegment
                currentStorySegment.text += ` ${segment.text}`; // Concatenate text correctly

                // Generate image for the current segment

                // Push the finalized story segment into storySegments array
                storySegments.push({ ...currentStorySegment });
                generateImage(currentStorySegment.text, storySegments[storySegments.length - 1]);

                // Reset currentStorySegment for the next batch of segments
                currentStorySegment = {
                    transciptionSegments: [],
                    start: 0,
                    end: 0,
                    image: "",
                    text: "",
                };
                lastSegmentEnd = segment.end;
            } else {
                // Continue adding segments to the current story segment
                currentStorySegment.transciptionSegments.push(segment);
                currentStorySegment.end = segment.end;
                currentStorySegment.text += ` ${segment.text}`; // Concatenate text correctly
            }
        }

        // Add the last incomplete story segment if it exists
        if (currentStorySegment.transciptionSegments.length > 0) {
            storySegments.push({ ...currentStorySegment });
            generateImage(currentStorySegment.text, storySegments[storySegments.length - 1]);
        }
        
        setStorySegments(storySegments);
    }, [transcription]);

    return (
        <div>
            <h1>Initing Story</h1>
        </div>
    );
}
