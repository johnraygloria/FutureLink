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
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Date</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {rows.map((history) => (
          <tr key={history.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{history.full_name || '-'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{history.position_applied_for || '-'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{history.date_applied || ''}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                history.status === 'For Completion' ? 'bg-green-100 text-green-800' :
                history.status === 'For Final Interview/For Assessment' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
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


