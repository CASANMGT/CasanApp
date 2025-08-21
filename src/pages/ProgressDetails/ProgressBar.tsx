import React from "react";

interface ProgressBarProps {
  value: number; // current value
  min: number; // maximum value
  max: number; // maximum value
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, min,max }) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full">
      {/* Label */}
      <span className="text-lg font-bold mb-3">{value} kg</span>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between text-sm text-gray-500 mt-1">
        <span className="text-xs">{min} kg</span>
        <span className="text-xs">{max} kg</span>
      </div>
    </div>
  );
};
export default ProgressBar;
