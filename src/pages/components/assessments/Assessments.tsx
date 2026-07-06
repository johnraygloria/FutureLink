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
import ProcessTimer from "../../../components/ProcessTimer";
import PipelinePageShell from "../../../components/Pipeline/PipelinePageShell";
import PipelineModuleHeader from "../../../components/Pipeline/PipelineModuleHeader";
import PipelineActionBar from "../../../components/Pipeline/PipelineActionBar";
import PipelineControlStrip from "../../../components/Pipeline/PipelineControlStrip";
import PipelineHistoryShell from "../../../components/Pipeline/PipelineHistoryShell";

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
    setSelectedUser,
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

  const refreshData = (silent = false) => {
    if (!silent) setIsLoading(true);
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
      .finally(() => {
        if (!silent) setIsLoading(false);
      });
  };

  useEffect(() => {
    refreshData();
  }, [setUsers, currentApplicantNo]);

  useEffect(() => {
    function onUpdated(e: any) {
      const detail = e?.detail || {};
      const { no, status } = detail;
      if (!no) return;

      setUsers(prev => {
        const idx = prev.findIndex(u => u.no === no);
        if (idx === -1) return prev;
        const updated = [...prev];
        if (status && !isAssessmentStatus(status)) {
          updated.splice(idx, 1);
          return updated;
        }
        updated[idx] = { ...updated[idx], ...detail } as any;
        return updated;
      });

      setSelectedUser(prev => {
        if (prev && prev.no === no) {
          return { ...prev, ...detail };
        }
        return prev;
      });
    }
    window.addEventListener('applicant-updated', onUpdated);
    return () => window.removeEventListener('applicant-updated', onUpdated);
  }, [setUsers, setSelectedUser]);

  useEffect(() => {
    if (selectedUser) {
      const updated = users.find(u => u.no === selectedUser.no);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedUser)) {
        setSelectedUser(updated);
      }
    }
  }, [users, selectedUser?.no]);

  if (showHistory) {
    return (
      <PipelineHistoryShell
        title="Assessment History"
        backLabel="Back to Assessment"
        onBack={() => setShowHistory(false)}
      >
        <AssessmentHistoryTable rows={assessmentHistory as any} />
      </PipelineHistoryShell>
    );
  }

  return (
    <>
      <PipelinePageShell>
        <PipelineModuleHeader
          title="Assessment"
          subtitle="Track final interviews, requirements, and evaluation outcomes."
          count={users.length}
          filteredCount={hasFilters ? filteredUsers.length : undefined}
          icon="fa-clipboard-check"
        />

        <PipelineControlStrip
          timer={
            <ProcessTimer
              processName="Assessment"
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
        />

        <AssessmentTable
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
        onScreeningUpdate={handleScreeningUpdate}
        onRemoveApplicant={removeApplicant}
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

export default Assessments;
