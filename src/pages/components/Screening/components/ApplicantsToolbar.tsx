import React, { useState, useEffect } from "react";
import ScreeningHistoryTable from "./ScreeningHistoryTable";

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
  full_name?: string;
  position_applied_for?: string;
  date_applied?: string;
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
                  className="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium shadow-sm focus:outline-none hover:bg-gray-800"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Screening
                </button>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Screening History</h1>
              </div>

            </div>

            <div className="p-6">
              <ScreeningHistoryTable rows={screeningHistory} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Toolbar
  return (
    <div className="flex flex-col gap-4 p-6 border-b border-white/10 bg-transparent sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Screening</h1>
        <span className="inline-flex items-center rounded-full bg-primary/20 text-primary-light px-3 py-1 text-xs font-bold border border-primary/30 shadow-[0_0_10px_0_rgba(0,128,129,0.2)]">{usersCount}</span>
        <button
          className="ml-2 px-4 py-2 cursor-pointer rounded-xl bg-primary text-white text-sm font-semibold shadow-lg hover:bg-primary-light transition-all active:scale-95 border border-primary-light/50"
          onClick={onOpenModal}
        >
          Input Data
        </button>
        <button
          onClick={() => setShowHistory(true)}
          className="ml-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-medium shadow-lg hover:bg-white/20 transition-all border border-white/10 hover:border-white/20"
        >
          View History
        </button>
      </div>
      <div className="relative w-full sm:w-auto group">
        <span className="pointer-events-none absolute left-3 top-2.5 text-text-secondary group-focus-within:text-primary transition-colors">
          <i className="fas fa-search" />
        </span>
        <input
          type="text"
          placeholder="Search by name or position"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-72 pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white/5 text-white placeholder-text-secondary/50 transition-all hover:bg-white/10"
          aria-label="Search applicants"
        />
      </div>
    </div>
  );
};

export default ApplicantsToolbar; 