import React from 'react';
import { pipelineTableContainer, pipelineTable, pipelineThead, pipelineTh, pipelineTd, pipelineRowDefault } from '../Tables/pipelineTableStyles';
import type { SortState } from '../Tables/tableSort';
import SortHeaderButton, { ariaSortValue } from '../Tables/SortHeaderButton';

type PipelineHistoryTableProps = {
  columns: string[];
  children: React.ReactNode;
  // Sorting is opt-in: the parent owns the rows, so it owns the sort state too.
  sortState?: SortState;
  onToggleSort?: (key: string) => void;
  unsortableColumns?: readonly string[];
};

const PipelineHistoryTable: React.FC<PipelineHistoryTableProps> = ({
  columns,
  children,
  sortState = null,
  onToggleSort,
  unsortableColumns = [],
}) => (
  <div className={pipelineTableContainer}>
    <table className={`${pipelineTable} min-w-[900px]`}>
      <thead className={pipelineThead}>
        <tr>
          {columns.map((col) => (
            <th key={col} aria-sort={onToggleSort ? ariaSortValue(col, sortState) : undefined} className={pipelineTh}>
              {onToggleSort && !unsortableColumns.includes(col) ? (
                <SortHeaderButton label={col} sortKey={col} sortState={sortState} onToggle={onToggleSort} />
              ) : (
                col
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export const historyRowClass = pipelineRowDefault;
export const historyCellClass = pipelineTd;

export default PipelineHistoryTable;
