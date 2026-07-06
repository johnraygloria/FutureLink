import React, { useEffect, useMemo, useState } from 'react';

interface ProcessTimerProps {
  processName: string;
  onTimerComplete?: () => void;
  duration?: number;
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
      persisted = { nextAtMs: now + durationMs, durationSec: duration };
      writePersisted(persisted);
    }

    const tick = () => {
      const current = Date.now();
      const p = readPersisted() || persisted!;

      if (current >= p.nextAtMs) {
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

    tick();
    const interval = window.setInterval(tick, 1000);
    const onVisibility = () => tick();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [duration, onTimerComplete, storageKey]);

  const progress = Math.max(0, Math.min(100, ((duration - seconds) / duration) * 100));

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-black/25 border border-white/10 shadow-inner min-w-[220px]">
      <div className="relative h-9 w-9 shrink-0">
        <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-primary"
            strokeDasharray={`${progress * 0.94} 100`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fas fa-sync-alt text-[10px] text-primary-light" />
        </div>
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary/80">{processName} Sync</div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-black text-white tabular-nums">{seconds.toString().padStart(2, '0')}</span>
          <span className="text-xs text-text-secondary">sec</span>
          {isDue && <span className="ml-2 w-2 h-2 bg-success rounded-full animate-pulse" />}
        </div>
      </div>
    </div>
  );
};

export default ProcessTimer;
