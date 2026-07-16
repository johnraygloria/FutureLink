import { useCallback, useMemo, useState } from 'react';
import type { SortColumnMap, SortState } from './tableSort';
import { sortRows } from './tableSort';

/**
 * Column-sort state + derived sorted rows. Sorting is recomputed from the
 * incoming rows on every change, so background refetches and optimistic
 * updates upstream flow through automatically.
 *
 * `columns` lists only the columns needing a custom accessor or a non-string
 * type; any other key falls back to reading `row[key]` as a natural string.
 * Pass a stable reference (module-scope constant, or useMemo when it closes
 * over props).
 */
export function useTableSort<T>(rows: readonly T[], columns: SortColumnMap<T>) {
  const [sortState, setSortState] = useState<SortState>(null);

  const toggleSort = useCallback((key: string) => {
    setSortState((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return null; // third click clears back to the natural order
    });
  }, []);

  const sortedRows = useMemo(() => {
    if (!sortState) return rows as T[];
    const config = columns[sortState.key];
    const accessor = config?.accessor ?? ((row: T) => (row as Record<string, unknown>)[sortState.key]);
    return sortRows(rows, accessor, config?.type ?? 'string', sortState.direction);
  }, [rows, columns, sortState]);

  return { sortedRows, sortState, toggleSort };
}
