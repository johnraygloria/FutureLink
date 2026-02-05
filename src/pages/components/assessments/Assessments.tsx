import React, { useEffect, useState } from "react";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";
import AssessmentTable from "./components/AssessmentTable";
import { useAssessmentApplicants } from "./hooks/useAssessmentApplicants";
import { useNavigation } from "../../../Global/NavigationContext";
import { isAssessmentStatus, mapApplicantRow } from "./utils/assessmentUtils";
import { useAssessmentHistory } from "./hooks/useAssessments";
import AssessmentHistoryTable from "./components/AssessmentHistoryTable";
import FilterBar from "../../../components/Filters/FilterBar";
import FilterSidebar from "../../../components/Filters/FilterSidebar";
import AssessmentToolbar from "./components/AssessmentToolbar";
import ProcessTimer from "../../../components/ProcessTimer";

const Assessments: React.FC = () => {
  const {
    selectedUser,
    search,
    setSearch,
    users,
    setUsers,
    handleUserClick,
    handleCloseSidebar,
    handleStatusChangeAndSync,
    handleScreeningUpdate,
    removeApplicant,
    filteredUsers,
    filters,
    activeFilters,
    hasFilters,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    handleApplyFilters,
    handleRemoveFilter,
    handleClearAllFilters,
    handleOpenFilterSidebar,
  } = useAssessmentApplicants();
  const { currentApplicantNo } = useNavigation();
  const [showHistory, setShowHistory] = useState(false);
  const { history: assessmentHistory } = useAssessmentHistory();
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = () => {
    setIsLoading(true);
    fetch('/api/applicants')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch applicants');
        return res.json();
      })
      .then((rows) => {
        const mapped = rows.map(mapApplicantRow);
        const assessmentUsers = mapped.filter((u: any) => isAssessmentStatus(u.status));
        setUsers(assessmentUsers);
      })
      .catch(() => setUsers([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    refreshData();
  }, [setUsers, currentApplicantNo]);

  // Listen for applicant status updates and update list without reload
  useEffect(() => {
    function onUpdated(e: any) {
      const detail = e?.detail || {};
      const { no, status } = detail;
      if (!no) return;
      setUsers(prev => {
        const idx = prev.findIndex(u => u.no === no);
        const allowed = isAssessmentStatus(status);
        if (idx === -1) return prev;
        const updated = [...prev];
        if (!allowed) {
          updated.splice(idx, 1);
          return updated;
        }
        updated[idx] = { ...updated[idx], status } as any;
        return updated;
      });
    }
    window.addEventListener('applicant-updated', onUpdated);
    return () => window.removeEventListener('applicant-updated', onUpdated);
  }, [setUsers]);

  // History handled by useAssessmentHistory

  // Assessment History Page
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
                  Back to Assessment
                </button>
                <h1 className="text-2xl font-bold text-custom-teal">Assessment History</h1>
              </div>
            </div>

            <div className="p-6">
              <AssessmentHistoryTable rows={assessmentHistory as any} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full relative overflow-hidden">
      {/* Dynamic background elements could be added here if not global */}
      <div className="flex-1 max-w-full mx-auto py-6 px-4 md:px-8">
        <div className="glass-card max-w-full rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 backdrop-blur-xl relative z-10 transition-all hover:border-white/20">
          {/* Timer and Filter Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
            <ProcessTimer
              processName="Assessment"
              duration={7}
              onTimerComplete={refreshData}
            />
            <FilterBar
              activeFilters={activeFilters}
              onOpenFilters={handleOpenFilterSidebar}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
          </div>

          {/* Toolbar */}
          <AssessmentToolbar
            search={search}
            setSearch={setSearch}
            usersCount={users.length}
            showHistory={showHistory}
            setShowHistory={setShowHistory}
          />

          {/* Table */}
          <div className="p-0">
            <AssessmentTable
              users={filteredUsers}
              selectedUser={selectedUser}
              onUserClick={handleUserClick}
              isLoading={isLoading}
              hasActiveFilters={hasFilters}
            />
          </div>
        </div>
      </div>

      <ApplicantSidebar
        selectedUser={selectedUser}
        onClose={handleCloseSidebar}
        onStatusChange={handleStatusChangeAndSync}
        onScreeningUpdate={handleScreeningUpdate}
        onRemoveApplicant={removeApplicant}
      />

      {/* Filter Sidebar Modal */}
      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        users={users}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearAllFilters}
      />
    </div>
  );
};

export default Assessments;