import React, { useRef } from "react";

type UploadZoneProps = {
  handleFiles: (files: FileList | null) => void;
  acceptedTypes?: string[]; // e.g. ["image/png", "application/pdf"]
  maxSizeMB?: number;       // max file size in MB
};

const UploadZone = ({
  handleFiles,
  acceptedTypes = [],
  maxSizeMB = 5,
}: UploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Drag & Drop handler
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // File input change handler
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div
      className="uploadZone"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={() => inputRef.current?.click()}
    >
      <p>Drag & Drop files here or click to select</p>
      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={onChange}
        style={{ display: "none" }}
      />
      <small>
        Max size: {maxSizeMB}MB | Accepted types:{" "}
        {acceptedTypes.length > 0 ? acceptedTypes.join(", ") : "any"}
      </small>
    </div>
  );
};

export default UploadZone;

