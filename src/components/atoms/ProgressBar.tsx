import { useEffect, useState } from "react";

interface ProgressBarProps {
  max: number;
  onFinish: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ max, onFinish }) => {
  const [progress, setProgress] = useState(0);
  const totalSeconds = max;

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 100 / totalSeconds;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) onFinish();
  }, [progress]);

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="w-full bg-primary10 rounded-full h-2.5">
        <div
          className="bg-primary100 h-2.5 rounded-full transition-all duration-1000 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Countdown Text */}
      <p className="mt-1 text-primary100 text-[10px]">
        Mulai pengecasan {Math.ceil((100 - progress) / (100 / totalSeconds))}{" "}
        detik lagi...
      </p>
    </div>
  );
};

export default ProgressBar;
