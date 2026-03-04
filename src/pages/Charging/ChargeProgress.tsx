import { useEffect, useRef } from "react";

interface Props {
  currentKwh: number;
  totalKwh: number;
  onFinish: () => {};
}

export default function ChargeProgress({
  currentKwh,
  totalKwh,
  onFinish,
}: Props) {
  const alerted = useRef(false);

  // Clamp max 100%
  const progress = Math.min((currentKwh / totalKwh) * 100, 100);
  const size = 240;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const usedKwh = ((progress / 100) * totalKwh).toFixed(2);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // ✅ Trigger once when >= 100
  useEffect(() => {
    if (progress >= 100 && !alerted.current) {
      alerted.current = true;
      onFinish();
    }
  }, [progress, onFinish]);

  return (
    <div className="my-5">
      <div className="w-full flex flex-col items-center">
        {/* Circular Progress Container */}
        <div className="relative flex items-center bg-white rounded-full justify-center">
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
                <stop offset="0%" stopColor="#E8F7F8" />
                <stop offset="100%" stopColor="#2dba9d" />
              </linearGradient>
            </defs>

            {/* Background Track Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#E8F7F8"
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
              strokeDashoffset={strokeDashoffset}
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
