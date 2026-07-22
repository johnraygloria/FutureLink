import React, { useState, useEffect, useRef } from "react";
import type { User } from "../../../api/applicant";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";
import { useNavigation } from "../../../Global/NavigationContext";
import { isEngagementStatus, mapEngagementApplicantRow } from "./utils/engagementUtils";
import EngagementHistoryTable from "./components/EngagementHistoryTable";
import { useEngagementApplicants } from "./hooks/useEngagementApplicants";
import FilterBar from "../../../components/Filters/FilterBar";
import FilterSidebar from "../../../components/Filters/FilterSidebar";
import EngagementTable from "./components/EngagementTable";
import ProcessTimer from "../../../components/ProcessTimer";
import PipelinePageShell from "../../../components/Pipeline/PipelinePageShell";
import PipelineModuleHeader from "../../../components/Pipeline/PipelineModuleHeader";
import PipelineActionBar from "../../../components/Pipeline/PipelineActionBar";
import PipelineControlStrip from "../../../components/Pipeline/PipelineControlStrip";
import PipelineHistoryShell from "../../../components/Pipeline/PipelineHistoryShell";

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
  const [showBlacklist, setShowBlacklist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blacklistedUsers, setBlacklistedUsers] = useState<User[]>([]);
  const { currentApplicantNo } = useNavigation();

  // Keep a ref of the currently open applicant so the silent auto-refresh
  // can skip while the sidebar is open (avoids clobbering in-progress edits).
  const selectedUserRef = useRef(selectedUser);
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  const refreshData = (silent = false) => {
    // Don't let the timer's silent refresh overwrite edits while a sidebar is open.
    if (silent && selectedUserRef.current) return;
    if (!silent) setIsLoading(true);
    fetch('/api/applicants')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch applicants');
        return res.json();
      })
      .then((rows) => {
        setUsers(rows.filter((r: any) => isEngagementStatus(r.status)).map(mapEngagementApplicantRow));
        setBlacklistedUsers(
          rows.filter((r: any) => r.status === 'Blacklisted' && isEngagementStatus(r.previous_status || '')).map(mapEngagementApplicantRow)
        );
      })
      .catch(() => { setUsers([]); setBlacklistedUsers([]); })
      .finally(() => {
        if (!silent) setIsLoading(false);
      });
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
          if (allowed) {
            fetch(`/api/applicants?NO=${encodeURIComponent(no)}`)
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

        if (!allowed) {
          return prev.filter(u => u.no !== no);
        }
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...detail } as any;
        return updated;
      });

      setSelectedUser(prev => {
        if (prev && prev.no === no) {
          return { ...prev, ...detail };
        }
        return prev;
      });
    };

    window.addEventListener('applicant-updated', onUpdated);
    return () => window.removeEventListener('applicant-updated', onUpdated);
  }, []);

  useEffect(() => {
    if (!currentApplicantNo || users.length === 0) return;
    const proceededUser = users.find(user => user.no === currentApplicantNo);
    if (proceededUser) {
      setSelectedUser(proceededUser);
    }
  }, [currentApplicantNo, users, setSelectedUser]);

  useEffect(() => {
    if (selectedUser) {
      const updated = users.find(u => u.no === selectedUser.no);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedUser)) {
        setSelectedUser(updated);
      }
    }
  }, [users, selectedUser?.no]);

  // Keep the Blacklisted view + badge current in real time (before the sync timer).
  useEffect(() => {
    const onBlacklisted = (e: any) => {
      const d = e?.detail || {};
      if (!d.no) return;
      if (isEngagementStatus(d.previousStatus || '')) {
        setBlacklistedUsers(prev => (prev.some(u => u.no === d.no) ? prev : [{ ...d } as User, ...prev]));
      }
    };
    const onStatusForBlacklist = (e: any) => {
      const d = e?.detail || {};
      if (!d.no || !d.status || d.status === 'Blacklisted') return;
      setBlacklistedUsers(prev => prev.filter(u => u.no !== d.no));
    };
    window.addEventListener('applicant-blacklisted', onBlacklisted);
    window.addEventListener('applicant-updated', onStatusForBlacklist);
    return () => {
      window.removeEventListener('applicant-blacklisted', onBlacklisted);
      window.removeEventListener('applicant-updated', onStatusForBlacklist);
    };
  }, []);

  if (showHistory) {
    return (
      <PipelineHistoryShell
        title="Engagement History"
        backLabel="Back to Engagement"
        onBack={() => setShowHistory(false)}
      >
        <EngagementHistoryTable rows={assessmentHistory as any} />
      </PipelineHistoryShell>
    );
  }

  if (showBlacklist) {
    return (
      <>
        <PipelineHistoryShell
          title="Engagement — Blacklisted"
          backLabel="Back to Engagement"
          onBack={() => setShowBlacklist(false)}
        >
          <EngagementTable
            users={blacklistedUsers}
            selectedUser={selectedUser}
            onUserClick={handleUserClick}
            isLoading={isLoading}
            hasActiveFilters={false}
          />
        </PipelineHistoryShell>
        <ApplicantSidebar
          selectedUser={selectedUser}
          onClose={handleCloseSidebar}
          onStatusChange={handleStatusChangeAndSync}
          onRemoveApplicant={removeUser}
        />
      </>
    );
  }

  return (
    <>
      <PipelinePageShell fullHeight>
        <PipelineModuleHeader
          title="Engagement"
          subtitle="Monitor deployment readiness and onboarded applicants."
          count={users.length}
          filteredCount={hasFilters ? filteredUsers.length : undefined}
          icon="fa-handshake"
        />

        <PipelineControlStrip
          timer={
            <ProcessTimer
              processName="Engagement"
              duration={5}
              onTimerComplete={() => refreshData(true)}
            />
          }
          filters={
            <FilterBar
              embedded
              activeFilters={activeFilters}
              onOpenFilters={handleOpenFilterSidebar}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
          }
        />

        <PipelineActionBar
          search={search}
          setSearch={setSearch}
          onViewHistory={() => setShowHistory(true)}
          onViewBlacklist={() => { refreshData(); setShowBlacklist(true); }}
          blacklistCount={blacklistedUsers.length}
        />

        <EngagementTable
          users={filteredUsers}
          selectedUser={selectedUser}
          onUserClick={handleUserClick}
          isLoading={isLoading}
          hasActiveFilters={hasFilters}
        />
      </PipelinePageShell>

      <ApplicantSidebar
        selectedUser={selectedUser}
        onClose={handleCloseSidebar}
        onStatusChange={handleStatusChangeAndSync}
        onRemoveApplicant={removeUser}
      />

      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        users={users}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearAllFilters}
      />
    </>
  );
};

export default EngagementHR;
