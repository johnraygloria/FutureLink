import React from 'react';
import PipelineHistoryTable, { historyCellClass, historyRowClass } from '../../../../components/Pipeline/PipelineHistoryTable';

type SelectionHistoryRow = {
  id: number;
  employeeId: number;
  date: string;
  stage: 'Medical Referral' | 'Trade Test' | 'Medical Clearance' | 'Orientation' | 'SBMA Processing' | 'Gate Pass Issued';
  status: 'Completed' | 'In Progress' | 'Scheduled' | 'Failed' | 'Pending';
  facilitator: string;
  notes: string;
  documents?: string[];
  nextDeadline?: string;
};

type SelectionHistoryTableProps = {
  rows: SelectionHistoryRow[];
  getEmployeeInfo: (employeeId: number) => { name: string; position: string; dateApplied: string };
};

const SelectionHistoryTable: React.FC<SelectionHistoryTableProps> = ({ rows, getEmployeeInfo }) => (
  <PipelineHistoryTable columns={['Name', 'Position', 'Application Date', 'Status', 'Actions']}>
    {rows.map((history) => {
      const info = getEmployeeInfo(history.employeeId);
      return (
        <tr key={history.id} className={historyRowClass}>
          <td className={`${historyCellClass} text-sm font-medium text-white`}>{info.name}</td>
          <td className={`${historyCellClass} text-sm text-text-secondary group-hover:text-white transition-colors`}>{info.position}</td>
          <td className={`${historyCellClass} text-sm text-text-secondary group-hover:text-white transition-colors`}>{info.dateApplied || history.date}</td>
          <td className={historyCellClass}>
            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${history.status === 'Completed' ? 'bg-success/10 text-success border-success/20' :
                history.status === 'In Progress' ? 'bg-info/10 text-info border-info/20' :
                  history.status === 'Scheduled' ? 'bg-warning/10 text-warning border-warning/20' :
                    history.status === 'Failed' ? 'bg-danger/10 text-danger border-danger/20' :
                      'bg-white/5 text-text-secondary border-white/10'
              }`}>
              {history.status}
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
      );
    })}
  </PipelineHistoryTable>
);

export default SelectionHistoryTable;
