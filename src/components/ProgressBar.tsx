interface ProgressBarProps {
  progress: number;
  status?: 'uploading' | 'completed' | 'error';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status }) => {
  let barColor = '#3b82f6'; // default blue
  if (status === 'completed') barColor = '#10b981'; // green
  if (status === 'error') barColor = '#ef4444'; // red

  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar-fill"
        style={{ width: `${progress}%`, backgroundColor: barColor }}
      />
    </div>
  );
};

export default ProgressBar;
