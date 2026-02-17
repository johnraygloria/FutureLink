import React from "react";

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

const AssessmentHistoryTable: React.FC<AssessmentHistoryTableProps> = ({ rows }) => (
  <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
    <table className="min-w-full">
      <thead>
        <tr className="border-b border-white/10 bg-white/5">
          <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Name</th>
          <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Position</th>
          <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Applied Date</th>
          <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {rows.map((history) => (
          <tr key={history.id} className="group hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{history.full_name || '-'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary group-hover:text-white transition-colors">{history.position_applied_for || '-'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary group-hover:text-white transition-colors">{history.date_applied || ''}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${history.status === 'For Completion' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  history.status === 'For Final Interview/For Assessment' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-white/10 text-text-secondary border-white/10'
                }`}>
                {history.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AssessmentHistoryTable;


