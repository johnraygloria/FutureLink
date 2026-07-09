import { useEffect, useMemo, useRef } from 'react';

/**
 * Returns a stable debounced wrapper around `fn` (trailing edge). Repeated
 * calls within `delay` ms collapse into a single invocation after the burst
 * settles — used to coalesce the storm of `applicant-updated` /
 * `assessment-history-updated` events fired during bulk operations into one
 * refetch instead of hundreds.
 *
 * The latest `fn` is always called (kept in a ref), so it can close over fresh
 * state without resetting the timer.
 */
export function useDebouncedCallback<A extends unknown[]>(
  fn: (...args: A) => void,
  delay = 250
): (...args: A) => void {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return useMemo(() => {
    return (...args: A) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        timer.current = null;
        fnRef.current(...args);
      }, delay);
    };
  }, [delay]);
}
