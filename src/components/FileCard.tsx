import ProgressBar from "./ProgressBar";

type FileCardProps = {
  file: {
    id: string;
    name: string;
    size: number;
    type: string;
    progress: number;
    status: "uploading" | "complete" | "error";
    errorMessage?: string;
  };
  onDelete: (id: string) => void;
};

const FileCard = ({ file, onDelete }: FileCardProps) => {
  return (
    <div className={`card ${file.status === "error" ? "errorCard" : ""}`}>
      <div>
        <strong>{file.name}</strong>
        <p>{(file.size / 1024).toFixed(2)} KB</p>
        <div className="statusIndicator">
          {file.status === "uploading" && <span className="processing">⏳ Uploading</span>}
          {file.status === "complete" && <span className="complete">✅ Complete</span>}
          {file.status === "error" && <span className="failed">❌ Failed</span>}
        </div>
      </div>

      <ProgressBar progress={file.progress} />

      {file.errorMessage && <p className="errorText">{file.errorMessage}</p>}

      <button className="deleteBtn" onClick={() => onDelete(file.id)}>
        Delete
      </button>
    </div>
  );
};

export default FileCard;
