import React from "react";
import "./uploadFile.css";

type UploadFileProps = {
  setFile: (file: File) => void;
};

export default function UploadFile({ setFile }: UploadFileProps) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null); // Store the selected file here
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handles the file selection but doesn't process it yet
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Store the file for later use
      setError(null); // Clear previous errors
    }
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    if (/\.(wav|mp3)$/i.test(selectedFile.name)) {
      setFile(selectedFile); // Set the file in the parent component (if necessary)
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setError(null); // Clear any errors
    } else {
      setError("Invalid file type. Please select a .wav or .mp3 file.");
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
  <>
    <div className="navigation">
      <a href="/">
        <img className="logoMain" src="https://cdn-icons-png.flaticon.com/512/2997/2997468.png" alt="logo" />
      </a>
      <h1 className="header">StoryFrame - A way of viewing books</h1>
      <button className="btnNav" onClick={handleClick}>
          Upload
      </button>
    </div>
    <h1>Listen to your books with a different appearance</h1>

    <div className="uploadFileContainer">
      <div className="buttonContainer">
        <input
          type="file"
          onChange={handleFileSelection}
          accept=".wav,.mp3"
          ref={fileInputRef}
        />
        {error && <p className="error">{error}</p>}

        <button id="upload-btn" onClick={handleFileUpload}>
          Upload
        </button>
      </div>
    </div>
  </>
  );
}
