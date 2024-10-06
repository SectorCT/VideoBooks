import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { Transcription, transcriptionWord, transcriptionSegment } from "../../types"; // Assuming this is defined somewhere
import { FaPause, FaPlay } from "react-icons/fa"; // Importing icons
import "./index.css";
import { StorySegment } from "../../types";

interface StoryRenderProps {
    storySegments: StorySegment[]; // List of images (not used in the current component)
    audioFile: File; // Audio file
    transcription: Transcription; // Transcription (not used in the current component)
}

function Word({ word, timeStamp, audioRef, maxProgressReached }: { 
    word: transcriptionWord, 
    timeStamp: number, 
    audioRef: MutableRefObject<HTMLAudioElement | null>,
    maxProgressReached: number
}) {

    const classes = ["word"];
    if (timeStamp >= word.start && timeStamp < word.end) {
        classes.push("currentWord");
    }

    if (timeStamp >= word.end) {
        classes.push("pastWord");
    }

    function handleClick() {
        if (word.start <= maxProgressReached && audioRef.current) {
            audioRef.current.currentTime = word.start; // Set audio current time to word start (in seconds)
        }
    }

    return (
        <span className={classes.join(" ")} key={word.word} onClick={handleClick}>
            {word.word}
        </span>
    );
}

export default function StoryRender({ storySegments, audioFile, transcription }: StoryRenderProps) {
    const [progress, setProgress] = useState<number>(0);
    const [maxProgress, setMaxProgress] = useState<number>(0); // Maximum progress value (in seconds)
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false); // State for audio playing/paused
    const progressBarRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [segments, setSegments] = React.useState<transcriptionSegment[]>([]);
    const [currentSegment, setCurrentSegment] = React.useState<transcriptionSegment | null>(null);

    const [currentStorySegment, setCurrentStorySegment] = React.useState<StorySegment | null>(null);

    useEffect(() => {
        setSegments(transcription.segments);

        if (transcription.segments.length > 0) {
            setCurrentSegment(transcription.segments[0]);
        }
    }, [transcription]);

    useEffect(() => {
        // Create an object URL for the audio file
        if (audioFile) {
            const audioUrl = URL.createObjectURL(audioFile);
            audioRef.current = new Audio(audioUrl);

            // Load the audio duration when metadata is loaded
            audioRef.current.addEventListener('loadedmetadata', () => {
                if (audioRef.current) {
                    const durationInSeconds = audioRef.current.duration; // Duration in seconds
                    setMaxProgress(durationInSeconds); // Set max progress to duration in seconds
                }
            });

            // Update progress on timeupdate
            audioRef.current.addEventListener('timeupdate', () => {
                if (audioRef.current && !isDragging) { // Update only if not dragging
                    const currentTime = audioRef.current.currentTime; // Get current time in seconds
                    setProgress(currentTime); // Set progress in seconds
                }
            });

            // Clean up the object URL on component unmount
            return () => {
                URL.revokeObjectURL(audioUrl);
                audioRef.current?.pause(); // Pause audio on cleanup
            };
        }
    }, [audioFile, isDragging]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging && progressBarRef.current) {
            const { left, width } = progressBarRef.current.getBoundingClientRect();
            const newLeft = e.clientX - left; // Calculate new position
            const newProgress = Math.min((newLeft / width) * maxProgress, maxProgress); // Update progress in seconds
            setProgress(newProgress); // Update progress state

            // Seek the audio based on new progress
            if (audioRef.current) {
                audioRef.current.currentTime = newProgress; // Set audio current time (in seconds)
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Attach mousemove and mouseup events to the window when dragging
    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    useEffect(() => {
        if (segments.length > 0) {
            const newSegment = segments.find((segment) => {
                return progress >= segment.start && progress <= segment.end;
            });

            setCurrentSegment(newSegment || null);
        }

        if (storySegments.length > 0) {
            const newStorySegment = storySegments.find((segment) => {
                return progress >= segment.start && progress <= segment.end;
            });

            setCurrentStorySegment(newStorySegment || null);
        }
    }, [progress, segments, storySegments]);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.currentTime = progress; // Set audio current time to progress (in seconds)
                audioRef.current.play();
                
            }
            setIsPlaying(!isPlaying); // Toggle play/pause state
        }
    };

    const imageUrl = `data:image/png;base64,${currentStorySegment?.image || ''}`;

    return (
        <div className="storyContainer" style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }}>
            <h1>Story Render</h1>

            <div className="bottomContainer">
                <div className="subtitleContainer">
                    {currentSegment?.words.map((word, i) => (
                        <Word 
                            key={i} 
                            word={word} 
                            timeStamp={progress} // Progress in seconds
                            audioRef={audioRef}
                            maxProgressReached={maxProgress}
                        />
                    ))}
                </div>

                <div className="progressBarContainer" ref={progressBarRef}>
                    <div className="progressBar">
                        <div
                            className="progressBarFill"
                            style={{ width: `${(progress / maxProgress) * 100}%` }} // Fill progress based on the state
                        >
                            <div
                                className="progressBarDot"
                                style={{
                                    left: `calc(${(progress / maxProgress) * 100}% - 7.5px)`, // Adjusted positioning for centering
                                }}
                                onMouseDown={handleMouseDown}
                            ></div>
                        </div>
                    </div>
                    <div className="progressTime">
                        <span className="currentTime">
                            {Math.floor(progress / 60) > 0 && `${Math.floor(progress / 60)}m `}
                            {Math.floor(progress % 60)}s
                        </span>
                        <span className="maxTime">
                            {Math.floor(maxProgress / 60) > 0 && `${Math.floor(maxProgress / 60)}m `}
                            {Math.floor(maxProgress % 60)}s
                        </span>
                    </div>
                    <button onClick={togglePlayPause} className="playPauseButton">
                        {isPlaying ? <FaPause alignmentBaseline="baseline" /> : <FaPlay alignmentBaseline="baseline" />} {/* Conditional rendering of icons */}
                    </button>
                </div>
            </div>
            <audio ref={audioRef} style={{ display: "none" }} />
        </div>
    );
}
