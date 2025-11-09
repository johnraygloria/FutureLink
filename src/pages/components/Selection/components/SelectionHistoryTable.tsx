import React from 'react';

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
        {rows.map((history) => {
          const info = getEmployeeInfo(history.employeeId);
          return (
            <tr key={history.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{info.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{info.position}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{info.dateApplied || history.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  history.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  history.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  history.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                  history.status === 'Failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {history.status}
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
          );
        })}
      </tbody>
    </table>
  </div>
);

export default SelectionHistoryTable;


