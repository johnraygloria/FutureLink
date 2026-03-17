import React, { useEffect, useMemo, useState } from 'react';

interface ProcessTimerProps {
  processName: string;
  onTimerComplete?: () => void;
  duration?: number; // in seconds
}

type PersistedTimer = {
  nextAtMs: number;
  durationSec: number;
};

const ProcessTimer: React.FC<ProcessTimerProps> = ({
  processName,
  onTimerComplete,
  duration = 5
}) => {
  const storageKey = useMemo(() => `processTimer:${processName}`, [processName]);
  const [seconds, setSeconds] = useState<number>(duration);
  const [isDue, setIsDue] = useState(false);

  useEffect(() => {
    const now = Date.now();
    const durationMs = Math.max(1, duration) * 1000;

    const readPersisted = (): PersistedTimer | null => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Partial<PersistedTimer>;
        if (!parsed || typeof parsed.nextAtMs !== 'number' || typeof parsed.durationSec !== 'number') return null;
        return { nextAtMs: parsed.nextAtMs, durationSec: parsed.durationSec };
      } catch {
        return null;
      }
    };

    const writePersisted = (value: PersistedTimer) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(value));
      } catch { }
    };

    let persisted = readPersisted();
    if (!persisted || persisted.durationSec !== duration) {
      // Reset schedule when duration changes or nothing is stored yet.
      persisted = { nextAtMs: now + durationMs, durationSec: duration };
      writePersisted(persisted);
    }

    const tick = () => {
      const current = Date.now();
      const p = readPersisted() || persisted!;

      if (current >= p.nextAtMs) {
        // Timer elapsed while on another page: trigger once and schedule the next run.
        setIsDue(true);
        try {
          onTimerComplete?.();
        } catch { }
        const next = { nextAtMs: current + durationMs, durationSec: duration };
        persisted = next;
        writePersisted(next);
        setSeconds(duration);
        setIsDue(false);
        return;
      }

      const remaining = Math.max(0, Math.ceil((p.nextAtMs - current) / 1000));
      setSeconds(remaining);
      setIsDue(false);
    };

    // Initial sync (and catch-up if it already elapsed).
    tick();

    const interval = window.setInterval(tick, 1000);
    const onVisibility = () => tick(); // resync on tab focus
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [duration, onTimerComplete, storageKey]);

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
      {isDue && (
        <div className="ml-1 w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
      )}
    </div>
  );
};

export default ProcessTimer;
