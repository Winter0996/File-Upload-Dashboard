import { useState } from "react";
import "./App.css";
import UploadZone from "./components/UploadZone";
import FileCard from "./components/FileCard";
import Toast from "./components/Toast";
import MockLogin from "./components/MockLogin";

// Typed File object
export type FileItem = {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "uploading" | "complete" | "error";
  errorMessage?: string;
};

type ToastItem = {
  id: string;
  message: string;
  type: "success" | "error";
};

function App() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Show mock login if no token
  if (!token) {
    return <MockLogin onLogin={setToken} />;
  }

  // Handle new files
  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FileItem[] = Array.from(selectedFiles).map((file) => {
      // Size validation (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${file.name} exceeds 5MB`, "error");
        return {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 0,
          status: "error",
          errorMessage: "File too large",
        };
      }

      // Type validation (example: images + pdf)
      if (
        !["image/png", "image/jpeg", "application/pdf"].includes(file.type)
      ) {
        showToast(`${file.name} type not allowed`, "error");
        return {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 0,
          status: "error",
          errorMessage: "Invalid file type",
        };
      }

      return {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: "uploading",
      };
    });

    setFiles((prev) => [...prev, ...newFiles]);

    // Start async upload simulation for valid files
    newFiles
      .filter((f) => f.status === "uploading")
      .forEach(simulateUpload);
  };

  // Simulate async file upload with random failures
  const simulateUpload = (file: FileItem) => {
    const failChance = 0.2; // 20% chance to fail
    let progress = 0;

    const interval = setInterval(() => {
      progress += 10;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? {
                ...f,
                progress: Math.min(progress, 100),
                status:
                  progress >= 100
                    ? Math.random() < failChance
                      ? "error"
                      : "complete"
                    : "uploading",
              }
            : f
        )
      );
    }, 300);

    setTimeout(() => clearInterval(interval), 3000);
  };

  // Delete a file
  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    showToast("File deleted", "success");
  };

  // Show toast notification
  const showToast = (message: string, type: "success" | "error") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <h1>File Upload Dashboard</h1>

      <button
        className="darkModeBtn"
        onClick={() => setDarkMode((prev) => !prev)}
      >
        Toggle Dark Mode
      </button>

      <UploadZone handleFiles={handleFiles} />

      <div className="list">
        {files.map((file) => (
          <FileCard key={file.id} file={file} onDelete={deleteFile} />
        ))}
      </div>

      <div className="toastContainer">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() =>
              setToasts((prev) => prev.filter((tt) => tt.id !== t.id))
            }
          />
        ))}
      </div>
    </div>
  );
}

export default App;
