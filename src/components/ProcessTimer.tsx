import React, { useState, useEffect } from 'react';

interface ProcessTimerProps {
  processName: string;
  onTimerComplete?: () => void;
  duration?: number; // in seconds
}

const ProcessTimer: React.FC<ProcessTimerProps> = ({
  processName,
  onTimerComplete,
  duration = 7
}) => {
  const [seconds, setSeconds] = useState(duration);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      if (onTimerComplete) {
        onTimerComplete();
      }
      // Reset timer after completion
      setTimeout(() => {
        setSeconds(duration);
        setIsActive(true);
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, onTimerComplete, duration]);

  const formatTime = (secs: number) => {
    return secs.toString().padStart(2, '0');
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg border border-white/20 shadow-md backdrop-blur-sm">
      <div className="flex items-center gap-1.5">
        <i className="fas fa-clock text-primary-light text-sm drop-shadow"></i>
        <span className="text-xs font-semibold text-white/90">{processName}:</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-sm font-bold text-white tabular-nums tracking-wide drop-shadow-sm">
          {formatTime(seconds)}
        </span>
        <span className="text-xs text-white/70">s</span>
      </div>
      {!isActive && (
        <div className="ml-1 w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
      )}
    </div>
  );
};

export default ProcessTimer;
