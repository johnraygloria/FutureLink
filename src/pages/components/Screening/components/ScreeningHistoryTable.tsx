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
        {rows.map((row) => (
          <tr key={row.id} className="group hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{row.full_name || '-'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary group-hover:text-white transition-colors">{row.position_applied_for || '-'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary group-hover:text-white transition-colors">{row.date_applied || ''}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-custom-teal/10 text-custom-teal border border-custom-teal/20">
                {row.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ScreeningHistoryTable;


