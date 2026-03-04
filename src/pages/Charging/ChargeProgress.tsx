import { useEffect, useRef, useState } from "react";

interface Props {
  duration: number;
  totalKwh: number;
}

export default function ChargeProgress({ duration, totalKwh }: Props) {
  // State for the charging simulation
  const [progress, setProgress] = useState(0);
  const alerted = useRef(false);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

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
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [duration]);

  // SVG Circular Progress Math
  const size = 240;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const usedKwh = ((progress / 100) * totalKwh).toFixed(2);
  const strokeDashoffset2 = circumference - (progress / 100) * circumference;

  return (
    <div
      className="my-5"
     
    >
      <div className="w-full flex flex-col items-center">
        {/* Circular Progress Container */}
        <div className="relative flex items-center justify-center">
          {/* SVG Ring */}
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90 overflow-visible"
          >
            {/* Glow Filter Definition */}
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Gradient for the active stroke */}
              <linearGradient
                id="progress-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#4ade80" /> {/* emerald-400 */}
                <stop offset="100%" stopColor="#2dd4bf" /> {/* teal-400 */}
              </linearGradient>
            </defs>

            {/* Background Track Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#d1f0e8"
              strokeWidth={strokeWidth}
              className="opacity-60"
            />

            {/* Active Progress Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="url(#progress-gradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset2}
              filter="url(#glow)"
              className="transition-all duration-500 ease-out"
            />
          </svg>

          {/* Center Text Content (Matches Image) */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <div
              className="font-extrabold leading-none tracking-tighter text-black100"
              style={{ fontSize: "48px" }}
            >
              {Math.floor(progress)}
              <span className="text-4xl">%</span>
            </div>
            <div className="text-xl font-bold mt-2 text-black100">
              {usedKwh} / {totalKwh} kWh
            </div>
            <div className="text-sm font-medium text-black90 mt-1">
              Terpakai dari Penuh
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
