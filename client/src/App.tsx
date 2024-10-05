import { useState } from "react";
import UploadFile from "./Pages/uploadFile";
import TranscribingPage from "./Pages/transcribing";
import InitingStory from "./Pages/initingStory";
import StoryRender from "./Pages/storyRender";

import { Transcription, StorySegment } from "./types";

export default function App() {

    const [file, setFile] = useState<File | null>(null);
    const [transcription, setTranscription] = useState<Transcription | null>(null);
    const [storySegments, setStorySegments] = useState<StorySegment[] | null>(null);

    if (!file && !transcription && !storySegments) {
        return <UploadFile setFile={setFile} />;
    }

    if (file && !transcription && !storySegments) {
        return <TranscribingPage file={file} setTranscription={setTranscription} />;
    }

    if (file && transcription && !storySegments) {
        return <InitingStory transcription={transcription!} setStorySegments={setStorySegments}/>;
    }
    
    if (file && transcription && storySegments) {
        return <StoryRender audioFile={file} transcription={transcription} storySegments={storySegments}/>;
    }

    return null;
}
