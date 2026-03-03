import React from 'react';

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
  <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
    <table className="min-w-full">
      <thead>
        <tr className="border-b border-white/10 bg-white/5">
          <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Name</th>
          <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Position</th>
          <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Application Date</th>
          <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
          <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {rows.map((assessment) => (
          <tr key={assessment.id} className="group hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Assessment {assessment.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary group-hover:text-white transition-colors">{assessment.type}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary group-hover:text-white transition-colors">{assessment.date}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${assessment.status === 'Passed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  assessment.status === 'Failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                }`}>
                {assessment.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary flex items-center gap-3">
              <button className="text-custom-teal hover:text-white transition-colors p-1" title="View Details">
                <i className="fas fa-eye" />
              </button>
              <button className="text-text-secondary hover:text-white transition-colors p-1" title="More actions">
                <i className="fas fa-ellipsis-h" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default EngagementHistoryTable;


