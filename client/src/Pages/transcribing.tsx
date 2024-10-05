import React, { useEffect, useState } from "react";
import { Transcription } from "../types";
// import dotenv from "dotenv";
// dotenv.config();

const TRANSCRIPTION_API_URL = process.env.REACT_APP_TRANSCRIPTION_API_URL || "http://127.0.0.1:8000";
console.log(TRANSCRIPTION_API_URL);

interface TranscribingPageProps {
    file: File;
    setTranscription: (transcription: Transcription | null) => void;
}
const TranscribingPage: React.FC<TranscribingPageProps> = ({ file, setTranscription }) => {
    const [status, setStatus] = useState("Transcribing...");
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("useEffect triggered");
        if (file !== null) {
            const formData = new FormData();
            formData.append("audio", file);
    
            fetch(`${TRANSCRIPTION_API_URL}/transcribe/`, {
                method: "POST",
                body: formData,
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((result) => {
                    setTranscription(result);
                    setError(null);
                    setStatus("Done");
                })
                .catch((err) => {
                    setError(err.message);
                    setTranscription(null);
                    setStatus("An error occurred");
                });
        }
    }, [file]);
    

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <h1>{status}</h1>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </div>
    );
};

export default TranscribingPage;
