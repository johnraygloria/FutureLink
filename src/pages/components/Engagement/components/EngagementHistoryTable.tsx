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
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Application Date</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {rows.map((assessment) => (
          <tr key={assessment.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">Assessment {assessment.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assessment.type}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assessment.date}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                assessment.status === 'Passed' ? 'bg-green-100 text-green-800' :
                assessment.status === 'Failed' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {assessment.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
              <button className="text-blue-600 hover:text-blue-900 rounded-full p-2 transition" title="View Details">
                <i className="fas fa-eye" />
              </button>
              <button className="text-gray-400 hover:text-gray-700 rounded-full p-2 transition" title="More actions">
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


