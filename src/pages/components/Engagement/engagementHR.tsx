import React, { useState, useEffect } from "react";
import type { User, ApplicationStatus } from "../../../api/applicant";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";
import { useNavigation } from "../../../Global/NavigationContext";
import { isEngagementStatus, mapEngagementApplicantRow } from "./utils/engagementUtils";
import EngagementHistoryTable from "./components/EngagementHistoryTable";
import { useEngagementApplicants } from "./hooks/useEngagementApplicants";
import FilterBar from "../../../components/Filters/FilterBar";
import FilterSidebar from "../../../components/Filters/FilterSidebar";
import EngagementToolbar from "./components/EngagementToolbar";
import EngagementTable from "./components/EngagementTable";
import ProcessTimer from "../../../components/ProcessTimer";

interface AssessmentHistory {
  id: number;
  date: string;
  type: 'Performance Review' | 'Skills Assessment' | 'Behavioral Review' | 'Project Evaluation';
  score: number;
  evaluator: string;
  comments: string;
  status: 'Passed' | 'Failed' | 'Needs Improvement';
}

const initialAssessmentHistory: AssessmentHistory[] = [
  {
    id: 1,
    date: "2024-06-15",
    type: "Performance Review",
    score: 85,
    evaluator: "Manager Smith",
    comments: "Excellent work ethic and technical skills. Shows strong leadership potential.",
    status: "Passed"
  },
  {
    id: 2,
    date: "2024-07-01",
    type: "Skills Assessment",
    score: 92,
    evaluator: "Tech Lead Johnson",
    comments: "Advanced problem-solving abilities. Ready for more complex projects.",
    status: "Passed"
  },
  {
    id: 3,
    date: "2024-07-15",
    type: "Behavioral Review",
    score: 78,
    evaluator: "HR Manager",
    comments: "Good team player but needs improvement in communication skills.",
    status: "Needs Improvement"
  }
];

const EngagementHR: React.FC = () => {
  const {
    selectedUser,
    setSelectedUser,
    search,
    setSearch,
    users,
    setUsers,
    handleUserClick,
    handleCloseSidebar,
    handleStatusChange,
    handleStatusChangeAndSync,
    removeApplicant: removeUser,
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
  } = useEngagementApplicants();
  const [assessmentHistory] = useState<AssessmentHistory[]>(initialAssessmentHistory);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentApplicantNo } = useNavigation();

  // Fetch engagement-stage applicants from API
  const refreshData = () => {
    fetch('/api/applicants')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch applicants');
        return res.json();
      })
      .then((rows) => {
        const mapped: User[] = rows
          .filter((r: any) => isEngagementStatus(r.status))
          .map(mapEngagementApplicantRow);
        setUsers(mapped);
      })
      .catch(() => setUsers([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    refreshData();

    const onUpdated = (e: any) => {
      const detail = e?.detail || {};
      const { no, status } = detail;
      if (!no) return;
      
      setUsers(prev => {
        const idx = prev.findIndex(u => u.no === no);
        const allowed = isEngagementStatus(status);
        
        if (idx === -1) {
          // If applicant is new to this section and status matches, refetch data to get full details including clients
          if (allowed) {
            fetch('/api/applicants')
              .then(res => res.json())
              .then((rows: any[]) => {
                const mapped: User[] = rows
                  .filter((r: any) => r.applicant_no === no && isEngagementStatus(r.status))
                  .map(mapEngagementApplicantRow);
                if (mapped.length > 0) {
                  setUsers(prevUsers => {
                    const exists = prevUsers.find(u => u.no === no);
                    if (!exists) {
                      return [...prevUsers, ...mapped];
                    }
                    return prevUsers;
                  });
                }
              })
              .catch(console.error);
          }
          return prev;
        }
        
        // Preserve all existing fields including clients when updating status
        const updated = [...prev];
        updated[idx] = { ...updated[idx], status } as any;
        return updated;
      });
    };
    
    window.addEventListener('applicant-updated', onUpdated);
    
    return () => {
      window.removeEventListener('applicant-updated', onUpdated);
    };
  }, []);

  // Auto-open the proceeded applicant if coming from Selection
  useEffect(() => {
    if (!currentApplicantNo || users.length === 0) return;
    const proceededUser = users.find(user => user.no === currentApplicantNo);
    if (proceededUser) {
      setSelectedUser(proceededUser);
    }
  }, [currentApplicantNo, users, setSelectedUser]);

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
                  Back to Deployed Applicants
                </button>
                <h1 className="text-2xl font-bold text-custom-teal">Engagement History</h1>
              </div>
            </div>

            <div className="p-6">
              <EngagementHistoryTable rows={assessmentHistory as any} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Deployed Applicants Page
  return (
    <div className="flex w-full">
      <div className="flex-1 max-w-full mx-auto py-10 px-4">
        <div className="bg-white max-w-[77vw] rounded-2xl shadow-lg overflow-hidden">
          {/* Timer and Filter Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <ProcessTimer 
              processName="Engagement" 
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
          <EngagementToolbar
            search={search}
            setSearch={setSearch}
            usersCount={users.length}
            showHistory={showHistory}
            setShowHistory={setShowHistory}
          />

          {/* Table */}
          <div className="p-0">
            <EngagementTable
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
        onRemoveApplicant={removeUser}
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

export default EngagementHR;