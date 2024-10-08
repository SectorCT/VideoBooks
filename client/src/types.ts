export type transcriptionWord = {
    start: number;
    end: number;
    word: string;
};

export type transcriptionSegment = {
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

export type StorySegment = {
    transciptionSegments: transcriptionSegment[];
    start: number;
    end: number;
    image: string;
    text: string;
}