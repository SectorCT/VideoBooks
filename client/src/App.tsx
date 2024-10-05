import { useState } from "react";
import UploadFile from "./Pages/uploadFile";
import TranscribingPage from "./Pages/transcribing";
import InitingStory from "./Pages/initingStory";

import { Transcription } from "./types";

export default function App() {

    const [file, setFile] = useState<File | null>(null);

    const [transcription, setTranscription] = useState<Transcription | null>(null);

    if (!file) {
        return <UploadFile setFile={setFile} />;
    }

    if (file && !transcription) {
        return <TranscribingPage file={file} setTranscription={setTranscription} />;
    }
    
    return <InitingStory transcription={transcription!}/>;
}
