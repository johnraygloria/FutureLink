import React from "react";

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
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{row.full_name || '-'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.position_applied_for || '-'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.date_applied || ''}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{row.status}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ScreeningHistoryTable;


