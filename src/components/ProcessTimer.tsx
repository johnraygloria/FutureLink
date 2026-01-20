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
    <div className="flex items-center gap-2 px-3 py-1.5 bg-custom-teal/10 rounded-lg border border-custom-teal/20">
      <div className="flex items-center gap-1.5">
        <i className="fas fa-clock text-custom-teal text-sm"></i>
        <span className="text-xs font-medium text-gray-600">{processName}:</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-sm font-bold text-custom-teal tabular-nums">
          {formatTime(seconds)}
        </span>
        <span className="text-xs text-gray-500">s</span>
      </div>
      {!isActive && (
        <div className="ml-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      )}
    </div>
  );
};

export default ProcessTimer;
