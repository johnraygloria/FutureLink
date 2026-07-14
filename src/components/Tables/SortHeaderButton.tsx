import React from 'react';
import { IconArrowDown, IconArrowUp, IconArrowsSort } from '@tabler/icons-react';
import type { SortState } from './tableSort';

/** aria-sort value for a th; undefined omits the attribute on inactive columns. */
export const ariaSortValue = (key: string, sortState: SortState): 'ascending' | 'descending' | undefined => {
  if (!sortState || sortState.key !== key) return undefined;
  return sortState.direction === 'asc' ? 'ascending' : 'descending';
};

type SortHeaderButtonProps = {
  label: React.ReactNode;
  sortKey: string;
  sortState: SortState;
  onToggle: (key: string) => void;
  className?: string;
};

// Preflight makes buttons inherit the th's font/letter-spacing/color, so this
// matches every table's header styling without per-table CSS.
const SortHeaderButton: React.FC<SortHeaderButtonProps> = ({ label, sortKey, sortState, onToggle, className = '' }) => {
  const direction = sortState && sortState.key === sortKey ? sortState.direction : null;
  return (
    <button
      type="button"
      onClick={() => onToggle(sortKey)}
      className={`group/sort flex w-full items-center gap-1.5 cursor-pointer select-none whitespace-nowrap ${direction ? 'text-white/80' : ''} ${className}`}
    >
      <span>{label}</span>
      {direction === 'asc' && <IconArrowUp size={13} className="shrink-0 text-primary-light" aria-hidden />}
      {direction === 'desc' && <IconArrowDown size={13} className="shrink-0 text-primary-light" aria-hidden />}
      {!direction && (
        <IconArrowsSort size={13} className="shrink-0 opacity-35 group-hover/sort:opacity-70 transition-opacity" aria-hidden />
      )}
    </button>
  );
};

export default SortHeaderButton;
