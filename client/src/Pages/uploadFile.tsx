import React, { useState, useEffect } from "react";
import "./uploadFile.css";
import LoadedBooks from "../Components/loadedBooks";
import NavBar from "../Components/navBar";

type UploadFileProps = {
  setFile: (file: File) => void;
};

export default function UploadFile({ setFile }: UploadFileProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Store file for later processing
  const [dragging, setDragging] = useState<boolean>(false); // State to indicate drag status
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth > 800); // Track if it's desktop
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handle window resize to detect mobile/desktop
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // This processes the file when "Upload" is clicked
  const processFile = () => {
    if (selectedFile) {
      if (/\.(wav|mp3)$/i.test(selectedFile.name)) {
        setFile(selectedFile); // Pass the file to the parent component if necessary
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
        setError(null); // Clear any errors
      } else {
        setError("Invalid file type. Please select a .wav or .mp3 file.");
      }
    }
  };

  // Handles file selection through input field but doesn't process yet
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setSelectedFile(file); // Store the selected file
        processFileAfterDrop(file); // Automatically process the selected file
    }
};

  // Handles file drop but doesn't process yet
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false); // Reset dragging state

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file); // Store the file
      processFileAfterDrop(file); // Automatically process the file after it's dropped
    }
};

// Helper function to process the file after it's dropped
const processFileAfterDrop = (file: File) => {
  if (/\.(wav|mp3)$/i.test(file.name)) {
    setFile(file); // Pass the file to the parent component if necessary
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    setError(null); // Clear any errors
  } else {
    setError("Invalid file type. Please select a .wav or .mp3 file.");
  }
};

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true); // Set dragging state to true when dragging over the area
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false); // Reset dragging state when file is dragged away
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="appContainer">
      <div className="content">
        <NavBar/>
        <h2 className="header2">Listen to your books in a different way</h2>

        <div className="mainContainer">
          <LoadedBooks setTranscription={() => {}} />

          {isDesktop ? (
            <div
              className={`uploadFileContainer ${
                dragging ? "dragging" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={handleFileSelection}
                accept=".wav,.mp3"
                ref={fileInputRef}
              />
              {error && <p className="error">{error}</p>}

              <p>Drag & drop a file here, or click the button to upload</p>

              <button className="uploadbtn" onClick={handleClick}>
                Upload
              </button>
            </div>
          ) : (
            <div className="uploadMobile">
              <h2>Upload your favorite books!</h2>
              <input
                type="file"
                onChange={handleFileSelection}
                accept=".wav,.mp3"
                ref={fileInputRef}
                className="fileInput"
              />
              {error && <p className="error">{error}</p>}

            </div>
          )}
        </div>

        {/* Show preview after processing */}
        {preview && (
          <div className="previewContainer">
            <h2>File Preview:</h2>
            <p>{preview}</p>
          </div>
        )}
      </div>

      <div className="footer">
        <p>Copyright @ StoryFrame</p>
      </div>
    </div>
  );
}
