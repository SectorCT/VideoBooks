import React, { useEffect } from "react";

import { Transcription, StorySegment } from "../types";


const GENERATE_IMAGE_API_URL = process.env.REACT_APP_GENERATE_IMAGE_API_URL;

async function generateImage(text: string) {
    const response = await fetch(`${GENERATE_IMAGE_API_URL}/return_image/`, {
        method: "POST", // Use POST if sending a body
        headers: {
            "Content-Type": "application/json", // Set correct header
        },
        body: JSON.stringify({ text }), // Send JSON body
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result;
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
        }

        const img1 = storySegments[0]
            ? generateImage(storySegments[0].text)
            : new Promise((resolve) => resolve(""));
        const img2 = storySegments[1]
            ? generateImage(storySegments[1].text)
            : new Promise((resolve) => resolve(""));
        const img3 = storySegments[2]
            ? generateImage(storySegments[2].text)
            : new Promise((resolve) => resolve(""));

        async function generateStartingImages() {
            await Promise.all([img1, img2, img3]).then((images) => {
                storySegments[0].image = images[0];
                storySegments[1].image = images[1];
                storySegments[2].image = images[2];
            });
            setStorySegments(storySegments);
        }

        generateStartingImages();
        // Update story segments in state
    }, [transcription]);

    return (
        <div>
            <h1>Initing Story</h1>
        </div>
    );
}
