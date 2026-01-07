import React from "react";

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
}

const ProgressBar = ({ value, max, label }: ProgressBarProps) => {
  const percentage = (value / max) * 100;

  return (
    <div className="relative h-2 rounded bg-slate-200 overflow-hidden">
      <div
        className="absolute h-full bg-blue-500 transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
      <div className="absolute w-full h-full flex items-center justify-center text-xs text-slate-700">
        {label}
      </div>
    </div>
  );
};

export default ProgressBar;
