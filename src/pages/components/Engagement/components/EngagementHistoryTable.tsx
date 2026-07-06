import React from 'react';
import PipelineHistoryTable, { historyCellClass, historyRowClass } from '../../../../components/Pipeline/PipelineHistoryTable';

type EngagementHistoryRow = {
  id: number;
  date: string;
  type: 'Performance Review' | 'Skills Assessment' | 'Behavioral Review' | 'Project Evaluation';
  score: number;
  evaluator: string;
  comments: string;
  status: 'Passed' | 'Failed' | 'Needs Improvement';
};

type EngagementHistoryTableProps = {
  rows: EngagementHistoryRow[];
};

const EngagementHistoryTable: React.FC<EngagementHistoryTableProps> = ({ rows }) => (
  <PipelineHistoryTable columns={['Assessment', 'Type', 'Date', 'Status', 'Actions']}>
    {rows.map((assessment) => (
      <tr key={assessment.id} className={historyRowClass}>
        <td className={`${historyCellClass} text-sm font-medium text-white`}>Assessment {assessment.id}</td>
        <td className={`${historyCellClass} text-sm text-text-secondary group-hover:text-white transition-colors`}>{assessment.type}</td>
        <td className={`${historyCellClass} text-sm text-text-secondary group-hover:text-white transition-colors`}>{assessment.date}</td>
        <td className={historyCellClass}>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${assessment.status === 'Passed' ? 'bg-success/10 text-success border-success/20' :
              assessment.status === 'Failed' ? 'bg-danger/10 text-danger border-danger/20' :
                'bg-warning/10 text-warning border-warning/20'
            }`}>
            {assessment.status}
          </span>
        </td>
        <td className={`${historyCellClass} text-sm text-text-secondary flex items-center gap-3`}>
          <button className="text-primary-light hover:text-white transition-colors p-1" title="View Details">
            <i className="fas fa-eye" />
          </button>
          <button className="text-text-secondary hover:text-white transition-colors p-1" title="More actions">
            <i className="fas fa-ellipsis-h" />
          </button>
        </td>
      </tr>
    ))}
  </PipelineHistoryTable>
);

export default EngagementHistoryTable;
