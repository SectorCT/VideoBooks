import React from "react";

import { Transcription } from "../types";

interface InitingStoryProps {
    transcription: Transcription;
}

export default function InitingStory( {transcription}: InitingStoryProps ) {
  const fullText = transcription.segments.map((segment) => segment.text).join(" ");

  return (
    <div>
      <h1>Initing Story</h1>
    </div>
  );
}