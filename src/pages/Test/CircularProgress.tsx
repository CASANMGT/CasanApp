import { useEffect, useRef, useState } from "react";

interface ChargeProgressProps {
  duration?: number; // total waktu sampai 100% (detik)
  totalKwh: number;
}

export default function ChargeProgress({
  duration = 20, // misal 20 detik sampai 100%
  totalKwh,
}: ChargeProgressProps) {
  const [progress, setProgress] = useState(0);
  const alerted = useRef(false);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const size = 220;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const totalDurationMs = duration * 1000;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;

      const elapsed = timestamp - startTimeRef.current;
      const percent = Math.min((elapsed / totalDurationMs) * 100, 100);

      setProgress(percent);

      if (percent < 100) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        if (!alerted.current) {
          alerted.current = true;
          setTimeout(() => {
            alert("Charging Completed ⚡ Battery 100%");
          }, 300);
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current)
        cancelAnimationFrame(animationRef.current);
    };
  }, [duration]);

  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  const usedKwh = ((progress / 100) * totalKwh).toFixed(2);

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background */}
          <circle
            stroke="#e6f4f1"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />

          {/* Progress */}
          <circle
            stroke="url(#gradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            r={radius}
            cx={size / 2}
            cy={size / 2}
            className="drop-shadow-xl transition-all"
          />

          <defs>
            <linearGradient id="gradient">
              <stop offset="0%" stopColor="#2dba9d" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-900">
            {Math.floor(progress)}%
          </h1>
          <p className="text-lg font-medium text-gray-800">
            {usedKwh} / {totalKwh} kWh
          </p>
          <p className="text-sm text-gray-500">
            Terpakai dari Penuh
          </p>
        </div>
      </div>
    </div>
  );
}