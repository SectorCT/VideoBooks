type transcriptionWord = {
    start: number;
    end: number;
    word: string;
};

type transcriptionSegment = {
    id: number;
    start: number;
    end: number;
    text: string;
    words: transcriptionWord[];
};

export type Transcription = {
    language: string;
    segments: transcriptionSegment[];
};