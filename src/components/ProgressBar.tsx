type ProgressBarProps = {
  progress: number;
};

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="progressBar">
      <div
        className="progressFill"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
