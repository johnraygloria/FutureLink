import React from "react";
import PipelineHistoryTable, { historyCellClass, historyRowClass } from "../../../../components/Pipeline/PipelineHistoryTable";

type ScreeningHistoryRow = {
  id: number;
  applicant_no: string;
  action: string;
  status: string;
  notes: string;
  created_at: string;
  full_name?: string;
  position_applied_for?: string;
  date_applied?: string;
};

type ScreeningHistoryTableProps = {
  rows: ScreeningHistoryRow[];
};

const ScreeningHistoryTable: React.FC<ScreeningHistoryTableProps> = ({ rows }) => (
  <PipelineHistoryTable columns={['Name', 'Position', 'Applied Date', 'Status']}>
    {rows.map((row) => (
      <tr key={row.id} className={historyRowClass}>
        <td className={`${historyCellClass} text-sm font-medium text-white`}>{row.full_name || '-'}</td>
        <td className={`${historyCellClass} text-sm text-text-secondary group-hover:text-white transition-colors`}>{row.position_applied_for || '-'}</td>
        <td className={`${historyCellClass} text-sm text-text-secondary group-hover:text-white transition-colors`}>{row.date_applied || '-'}</td>
        <td className={historyCellClass}>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary-light border border-primary/20">
            {row.status}
          </span>
        </td>
      </tr>
    ))}
  </PipelineHistoryTable>
);

export default ScreeningHistoryTable;
