import { useEffect, useMemo, useState } from "react";

type CountdownTimerProps = {
  initialSeconds: number;
  className?: string;
  label?: string;
  onFinish?: () => void;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  label,
  className,
  onFinish,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      const count = seconds - 1;
      setSeconds(count);

      if (count === 0 && onFinish) onFinish();
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((secs % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const isShowLabel = useMemo(() => (label ? true : false), [label]);

  return (
    <span className={`font-medium text-blackBold ${className}`}>{`${
      isShowLabel ? `${label} ` : ""
    }${formatTime(seconds)}`}</span>
  );
};

export default CountdownTimer;
