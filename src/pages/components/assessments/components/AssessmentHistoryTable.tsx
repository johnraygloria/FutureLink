import React from "react";
import PipelineHistoryTable, { historyCellClass, historyRowClass } from "../../../../components/Pipeline/PipelineHistoryTable";
import { useTableSort } from "../../../../components/Tables/useTableSort";
import type { SortColumnMap } from "../../../../components/Tables/tableSort";

type AssessmentHistoryRow = {
  id: string | number;
  full_name?: string;
  position_applied_for?: string;
  date_applied?: string;
  status?: string;
};

type AssessmentHistoryTableProps = {
  rows: AssessmentHistoryRow[];
};

const HISTORY_SORT_COLUMNS: SortColumnMap<AssessmentHistoryRow> = {
  'Name': { accessor: (r) => r.full_name },
  'Position': { accessor: (r) => r.position_applied_for },
  'Applied Date': { accessor: (r) => r.date_applied, type: 'date' },
  'Status': { accessor: (r) => r.status },
};

const AssessmentHistoryTable: React.FC<AssessmentHistoryTableProps> = ({ rows }) => {
  const { sortedRows, sortState, toggleSort } = useTableSort(rows, HISTORY_SORT_COLUMNS);
  return (
  <PipelineHistoryTable columns={['Name', 'Position', 'Applied Date', 'Status']} sortState={sortState} onToggleSort={toggleSort}>
    {sortedRows.map((history) => (
      <tr key={history.id} className={historyRowClass}>
        <td className={`${historyCellClass} text-sm font-medium text-white`}>{history.full_name || '-'}</td>
        <td className={`${historyCellClass} text-sm text-text-secondary group-hover:text-white transition-colors`}>{history.position_applied_for || '-'}</td>
        <td className={`${historyCellClass} text-sm text-text-secondary group-hover:text-white transition-colors`}>{history.date_applied || '-'}</td>
        <td className={historyCellClass}>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${history.status === 'For Completion' ? 'bg-success/10 text-success border-success/20' :
              history.status === 'For Final Interview/For Assessment' ? 'bg-info/10 text-info border-info/20' :
                'bg-white/5 text-text-secondary border-white/10'
            }`}>
            {history.status}
          </span>
        </td>
      </tr>
    ))}
  </PipelineHistoryTable>
  );
};

export default AssessmentHistoryTable;
