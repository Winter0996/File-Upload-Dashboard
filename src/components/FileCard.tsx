import React from 'react';
import type { UploadedFile } from '../App';
import ProgressBar from './ProgressBar';

interface FileCardProps {
  file: UploadedFile;
  onDelete: (id: string) => void;
  onRetry: (id: string) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const getFileIcon = (type: string): string => {
  if (type.startsWith('image/')) return '🖼️';
  if (type.startsWith('video/')) return '🎥';
  if (type.startsWith('audio/')) return '🎵';
  if (type.includes('pdf')) return '📄';
  if (type.includes('word') || type.includes('document')) return '📝';
  if (type.includes('sheet') || type.includes('excel')) return '📊';
  if (type.includes('zip') || type.includes('rar')) return '📦';
  return '📁';
};

const FileCard: React.FC<FileCardProps> = ({ file, onDelete, onRetry }) => {
  const formatDate = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`file-card ${file.status}`}>
      <div className="file-icon-large">{getFileIcon(file.type)}</div>

      <div className="file-info">
        <h4 className="file-name">{file.name}</h4>
        <p className="file-meta">
          {formatFileSize(file.size)}
          {file.uploadedAt && ` • ${formatDate(file.uploadedAt)}`}
        </p>
      </div>

      {file.status === 'uploading' && (
        <div className="file-progress">
          <ProgressBar progress={file.progress} status={file.status} />
          <span className="progress-text">{Math.round(file.progress)}%</span>
        </div>
      )}

      {file.status === 'completed' && (
        <div className="file-status">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="status-text success">Completed</span>
        </div>
      )}

      {file.status === 'error' && (
        <div className="file-status">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span className="status-text error">Failed</span>
        </div>
      )}

      <div className="file-actions">
        {file.status === 'error' && (
          <button
            type="button"
            onClick={() => onRetry(file.id)}
            className="action-btn retry"
            aria-label="Retry upload"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete(file.id)}
          className="action-btn delete"
          aria-label="Delete file"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FileCard;
