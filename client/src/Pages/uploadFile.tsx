import React from "react";
import "./uploadFile.css";

type UploadFileProps = {
  setFile: (file: File) => void;
};

export default function UploadFile( {setFile}: UploadFileProps) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (/\.(wav|mp3)$/i.test(file.name)) {
        setFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setError(null); // clear any previous error
      } else {
        setError("Invalid file type. Please select a .wav or .mp3 file.");
      }
    }
  };

  return (
    <div className="uploadFileContainer">
      <div className="buttonContainer">
        <input type="file" onChange={handleChange} accept=".wav,.mp3"/>
        {error && <p className="error">{error}</p>}
        {/* {preview && <img src={preview} alt="preview" />} */}
        <button>Upload</button>
      </div>
    </div>
  );
};
