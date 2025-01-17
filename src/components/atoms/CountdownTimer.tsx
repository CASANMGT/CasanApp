import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: number;
}

interface CalculationTimeLeftProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<CalculationTimeLeftProps>(
    calculateTimeLeft()
  );

  function calculateTimeLeft() {
    const now: number = new Date().getTime();
    const difference: number = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-4xl font-bold text-gray-800">
        <span className="px-2">{String(timeLeft.days).padStart(2, "0")}</span>:
        <span className="px-2">{String(timeLeft.hours).padStart(2, "0")}</span>:
        <span className="px-2">
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        :
        <span className="px-2">
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Days : Hours : Minutes : Seconds
      </p>
    </div>
  );
};

export default CountdownTimer;
