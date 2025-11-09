import React, { useEffect, useState } from "react";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";
import AssessmentTable from "./assessmenetTable";
import { useApplicants } from "../Screening/hooks/useApplicants";
import { useNavigation } from "../../../Global/NavigationContext";
import { isAssessmentStatus, mapApplicantRow } from "./utils/assessmentUtils";
import { useAssessmentHistory } from "./hooks/useAssessments";
import AssessmentHistoryTable from "./components/AssessmentHistoryTable";

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
  } = useApplicants();
  const { currentApplicantNo } = useNavigation();
  const [showHistory, setShowHistory] = useState(false);
  const { history: assessmentHistory } = useAssessmentHistory();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    <div className="flex w-full">
      <div className="flex-1 max-w-full mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col gap-4 p-6 border-b bg-white sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Assessment</h1>
              <span className="inline-flex items-center rounded-full bg-custom-teal/10 text-custom-teal px-2.5 py-0.5 text-xs font-medium border border-custom-teal/30">{users.length}</span>
              <button
                onClick={() => setShowHistory(true)}
                className="ml-2 px-3 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium shadow-sm focus:outline-none hover:bg-gray-800"
              >
                View History
              </button>
            </div>
            <div className="relative w-full sm:w-auto">
              <span className="pointer-events-none absolute left-3 top-2.5 text-gray-400">
                <i className="fas fa-search" />
              </span>
              <input
                type="text"
                placeholder="Search by name or position"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full sm:w-72 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-teal/30 bg-gray-50"
                aria-label="Search applicants"
              />
            </div>
          </div>
          <div className="p-0">
            <AssessmentTable
              users={filteredUsers}
              selectedUser={selectedUser}
              onUserClick={handleUserClick}
              isLoading={isLoading}
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
    </div>
  );
};

export default Assessments;