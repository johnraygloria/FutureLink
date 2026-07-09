import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

/**
 * Windowed rendering for the pipeline tables: only the rows near the viewport
 * are mounted, with spacer rows preserving scroll geometry. Attach
 * `containerRef` to the scrollable table container (it must have a bounded
 * height and overflow-y auto), then render `items` inside <tbody> between two
 * spacer rows of `topSpacer` / `bottomSpacer` pixels.
 *
 * Row heights are measured from the DOM (`measureRow` + data-index), so the
 * estimate only needs to be in the right ballpark.
 */
export function useVirtualRows<T>(rows: T[], estimateRowHeight = 73) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: 8,
  });

  const items = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const topSpacer = items.length > 0 ? items[0].start : 0;
  const bottomSpacer = items.length > 0 ? totalSize - items[items.length - 1].end : 0;

  return {
    containerRef,
    items,
    topSpacer,
    bottomSpacer,
    measureRow: virtualizer.measureElement,
  };
}

/** Spacer row for table virtualization — zero-styling filler that keeps scroll height correct. */
export const spacerRowStyle = (height: number): React.CSSProperties => ({
  height,
  padding: 0,
  border: 'none',
});
