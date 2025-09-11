import React, { useState, useEffect } from "react";

// removed old hardcoded interface

type ApplicantsToolbarProps = {
  search: string;
  setSearch: (s: string) => void;
  usersCount: number;
  onOpenModal: () => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
};

type ScreeningHistoryRow = {
  id: number;
  applicant_no: string;
  action: string;
  status: string;
  notes: string;
  created_at: string;
}


const ApplicantsToolbar: React.FC<ApplicantsToolbarProps> = ({ 
  search, 
  setSearch, 
  usersCount, 
  onOpenModal, 
  showHistory, 
  setShowHistory 
}) => {
  // API-backed screening history

  const [screeningHistory, setScreeningHistory] = useState<ScreeningHistoryRow[]>([]);

  useEffect(() => {
    if (!showHistory) return;
    fetch('/api/applicants/screening-history')
      .then(res => (res.ok ? res.json() : []))
      .then((rows: ScreeningHistoryRow[]) => setScreeningHistory(rows))
      .catch(() => setScreeningHistory([]));
  }, [showHistory]);

  // const stats = getScreeningStats();

  // Screening History Page
  if (showHistory) {
    return (
      <div className="flex w-full">
        <div className="flex-1 max-w-full mx-auto py-10 px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b bg-white">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowHistory(false)}
                  className="px-4 py-2 rounded-lg bg-gray-600 text-white font-semibold shadow-sm focus:outline-none border border-gray-700"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Screening
                </button>
                <h1 className="text-2xl font-bold text-custom-teal">Screening History</h1>
              </div>
           
            </div>

            <div className="p-6">
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
  {screeningHistory.map((row) => (
    <tr key={row.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{row.applicant_no}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.action}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{row.status}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.created_at).toLocaleString()}</td>
    </tr>
  ))}
</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Toolbar
  return (
    <div className="flex items-center justify-between p-6 border-b bg-white">
      <div className="flex items-center space-x-4">
        <div className="flex space-x-2">
          <button className="px-4 py-2 rounded-lg bg-custom-teal/10 text-black font-semibold shadow-sm focus:outline-none border border-custom-teal/80">
            Applied <span className="ml-1 bg-indigo-100 text-custom-teal rounded px-2 py-0.5 text-xs font-bold">{usersCount}</span>
          </button>
          <button
            className="px-4 py-2 cursor-pointer rounded-lg bg-custom-teal text-white font-semibold shadow-sm focus:outline-none border bordercustom-teal ml-2"
            onClick={onOpenModal}
          >
            Input Data
          </button>
          
        </div>
        <button
          onClick={() => {
            console.log('History button clicked, setting showHistory to true');
            setShowHistory(true);
          }}
          className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-bold shadow-lg focus:outline-none border border-indigo-700 hover:bg-indigo-700 transition-colors"
          style={{ fontSize: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
        >
          View Screening History ({screeningHistory.length} records)
        </button>
      </div>
      <div className="relative">
        <span className="absolute left-3 top-2.5 text-gray-400">
          <i className="fas fa-search" />
        </span>
        <input
          type="text"
          placeholder="Search candidate"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50"
        />
      </div>
    </div>
  );
};

export default ApplicantsToolbar; 