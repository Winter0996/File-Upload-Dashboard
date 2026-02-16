import { useState } from 'react';
import Navbar from './components/Navbar';
import MockLogin from './components/MockLogin';
import UploadZone from './components/UploadZone';
import FileCard from './components/FileCard';
import Toast from './components/Toast';
import './App.css';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  uploadedAt?: Date;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsAuthenticated(true);
    showToast(`Welcome back, ${user}!`, 'success');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setFiles([]);
    showToast('Logged out successfully', 'info');
  };

  const handleFileUpload = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading' as const,
    }));

    setFiles((prev) => [...uploadedFiles, ...prev]);

    uploadedFiles.forEach((file) => {
      simulateUpload(file.id);
    });

    showToast(`Uploading ${newFiles.length} file${newFiles.length > 1 ? 's' : ''}...`, 'info');
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, progress: 100, status: 'completed', uploadedAt: new Date() }
              : f
          )
        );
        showToast('File uploaded successfully!', 'success');
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
        );
      }
    }, 300);
  };

  const handleDeleteFile = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    showToast(`${file?.name} deleted`, 'info');
  };

  const handleRetry = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, progress: 0, status: 'uploading' as const } : f
      )
    );
    simulateUpload(fileId);
    showToast('Retrying upload...', 'info');
  };

  if (!isAuthenticated) {
    return <MockLogin onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Navbar username={username} onLogout={handleLogout} />
      
      <main className="main-content">
        <div className="container">
          <div className="header">
            <h1>File Upload Dashboard</h1>
            <p className="subtitle">
              Upload and manage your files securely. Drag and drop or click to browse.
            </p>
          </div>

          <UploadZone onFilesSelected={handleFileUpload} />

          <div className="files-section">
            <div className="section-header">
              <h2>Your Files</h2>
              <span className="file-count">{files.length} file{files.length !== 1 ? 's' : ''}</span>
            </div>
            
            {files.length === 0 ? (
              <div className="empty-state">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                  <polyline points="13 2 13 9 20 9" />
                </svg>
                <h3>No files uploaded yet</h3>
                <p>Upload your first file to get started</p>
              </div>
            ) : (
              <div className="files-grid">
                {files.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onDelete={handleDeleteFile}
                    onRetry={handleRetry}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
