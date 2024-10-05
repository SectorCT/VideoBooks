import React from "react";
import "./uploadFile.css";
import LoadedBooks from "./loadedBooks";

type UploadFileProps = {
  setFile: (file: File) => void;
};

export default function UploadFile({ setFile }: UploadFileProps) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [dragging, setDragging] = React.useState<boolean>(false); // State to indicate drag status

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handles the file processing after selection or drop
  const processFile = (file: File) => {
    if (/\.(wav|mp3)$/i.test(file.name)) {
      setFile(file); // Set the file in the parent component (if necessary)
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null); // Clear any errors
    } else {
      setError("Invalid file type. Please select a .wav or .mp3 file.");
    }
  };

  // Handles file selection through input field
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Handles file drop for drag-and-drop functionality
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false); // Reset dragging state

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Handles drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true); // Set dragging state to true when dragging over the area
  };

  // Handles drag leave (when user drags the file out of the drop area)
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false); // Reset dragging state when file is dragged away
  };

  // Trigger hidden file input on button click
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="appContainer">
      <div className="content">
      <div className="navigation">
        <a href="/">
          <img
            className="logoMain"
            src="https://cdn-icons-png.flaticon.com/512/2997/2997468.png"
            alt="logo"
          />
        </a>
        <h1 className="header">StoryFrame - A way of viewing books</h1>
        <button className="btnNav" onClick={handleClick}>
          Upload
        </button>
      </div>
      <h2>Listen to your books with a different appearance</h2>

      <div
        className={`mainContainer`} // Apply dragging class conditionally  
      >
        <LoadedBooks />

        <div className={`uploadFileContainer buttonContainer ${dragging ? 'dragging' : ''}`} onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>
          <input
            type="file"
            onChange={handleFileSelection}
            accept=".wav,.mp3"
            ref={fileInputRef}
            style={{ display: "none" }} // Hide the file input
          />

          {error && <p className="error">{error}</p>}

          <p>Drag & drop a file here, or click the button to upload</p>
          <p>Or upload it from here!</p>

          <button className="uploadbtn" onClick={handleClick}>
            Upload
          </button>
        </div>
      </div>

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
