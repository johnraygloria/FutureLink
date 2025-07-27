import React, { useState } from "react";

interface ScreeningHistory {
  id: number;
  applicantId: number;
  date: string;
  documentType: 'Resume' | 'Info Sheet' | 'Height Check' | 'Snellen Test' | 'Ishihara Test' | 'Physical Screening';
  status: 'Passed' | 'Failed' | 'Pending' | 'Not Applicable';
  validator: string;
  notes: string;
  score?: number;
  nextAction?: string;
}

type ApplicantsToolbarProps = {
  search: string;
  setSearch: (s: string) => void;
  usersCount: number;
  onOpenModal: () => void;
  onOpenSheet: () => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
};

const initialScreeningHistory: ScreeningHistory[] = [
  {
    id: 1,
    applicantId: 1,
    date: "2024-06-05",
    documentType: "Resume",
    status: "Passed",
    validator: "HR Officer",
    notes: "Resume meets all requirements. Strong educational background and relevant experience.",
    score: 90,
    nextAction: "Proceed to info sheet validation"
  },
  {
    id: 2,
    applicantId: 1,
    date: "2024-06-05",
    documentType: "Info Sheet",
    status: "Passed",
    validator: "HR Officer",
    notes: "All personal information verified and complete. Contact details confirmed.",
    score: 95,
    nextAction: "Schedule physical screening"
  },
  {
    id: 3,
    applicantId: 1,
    date: "2024-06-06",
    documentType: "Height Check",
    status: "Passed",
    validator: "Medical Staff",
    notes: "Height requirement met. Applicant is 5'8\" which exceeds minimum requirement.",
    score: 100,
    nextAction: "Proceed to vision tests"
  },
  {
    id: 4,
    applicantId: 1,
    date: "2024-06-06",
    documentType: "Snellen Test",
    status: "Passed",
    validator: "Medical Staff",
    notes: "Vision test passed with 20/20 vision. No corrective lenses needed.",
    score: 100,
    nextAction: "Proceed to color vision test"
  },
  {
    id: 5,
    applicantId: 1,
    date: "2024-06-06",
    documentType: "Ishihara Test",
    status: "Passed",
    validator: "Medical Staff",
    notes: "Color vision test passed. No color blindness detected.",
    score: 100,
    nextAction: "Complete physical screening"
  },
  {
    id: 6,
    applicantId: 1,
    date: "2024-06-07",
    documentType: "Physical Screening",
    status: "Passed",
    validator: "Medical Officer",
    notes: "Physical examination completed. All health requirements met. Cleared for employment.",
    score: 95,
    nextAction: "Proceed to next stage"
  },
  {
    id: 7,
    applicantId: 2,
    date: "2024-06-06",
    documentType: "Resume",
    status: "Passed",
    validator: "HR Officer",
    notes: "Resume reviewed. Good technical background but needs verification of certifications.",
    score: 85,
    nextAction: "Verify certifications"
  },
  {
    id: 8,
    applicantId: 2,
    date: "2024-06-07",
    documentType: "Info Sheet",
    status: "Pending",
    validator: "HR Officer",
    notes: "Info sheet submitted but requires additional documentation for address verification.",
    score: 70,
    nextAction: "Request additional documents"
  }
];

const ApplicantsToolbar: React.FC<ApplicantsToolbarProps> = ({ 
  search, 
  setSearch, 
  usersCount, 
  onOpenModal, 
  onOpenSheet, 
  showHistory, 
  setShowHistory 
}) => {
  const [screeningHistory] = useState<ScreeningHistory[]>(initialScreeningHistory);

  const getScreeningStats = () => {
    const total = screeningHistory.length;
    const passed = screeningHistory.filter(h => h.status === 'Passed').length;
    const failed = screeningHistory.filter(h => h.status === 'Failed').length;
    const pending = screeningHistory.filter(h => h.status === 'Pending').length;
    const averageScore = screeningHistory.length > 0 
      ? Math.round(screeningHistory.reduce((sum, h) => sum + (h.score || 0), 0) / screeningHistory.length)
      : 0;
    
    return { total, passed, failed, pending, averageScore };
  };

  const stats = getScreeningStats();

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
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Application Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {screeningHistory.map((history) => (
                      <tr key={history.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">Applicant {history.applicantId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{history.documentType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{history.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            history.status === 'Passed' ? 'bg-green-100 text-green-800' :
                            history.status === 'Failed' ? 'bg-red-100 text-red-800' :
                            history.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {history.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-900 rounded-full p-2 transition"
                            title="View Details"
                          >
                            <i className="fas fa-eye" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-gray-700 rounded-full p-2 transition"
                            title="More actions"
                          >
                            <i className="fas fa-ellipsis-h" />
                          </button>
                        </td>
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
          <button
            className="px-4 py-2 rounded-lg bg-green-800 cursor-pointer text-white font-semibold shadow-sm focus:outline-none border border-green-700 ml-2"
            onClick={onOpenSheet}
          >
            Open Google Sheet
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