import React, { useEffect, useState } from "react";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";
import InputApplicantModal from './InputApplicantModal';
import { useApplicants } from "./hooks/useApplicants";
import ApplicantsTable from "./components/ApplicantsTable";
import ScreeningHistoryTable from "./components/ScreeningHistoryTable";
import { isScreeningStatus, mapScreeningApplicantRow } from "./utils/screeningUtils";
import FilterBar from "../../../components/Filters/FilterBar";
import FilterSidebar from "../../../components/Filters/FilterSidebar";
import ProcessTimer from "../../../components/ProcessTimer";
import PipelinePageShell from "../../../components/Pipeline/PipelinePageShell";
import PipelineModuleHeader from "../../../components/Pipeline/PipelineModuleHeader";
import PipelineActionBar from "../../../components/Pipeline/PipelineActionBar";
import PipelineControlStrip from "../../../components/Pipeline/PipelineControlStrip";
import PipelineHistoryShell from "../../../components/Pipeline/PipelineHistoryShell";

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

const ScreeningList: React.FC = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [screeningHistory, setScreeningHistory] = useState<ScreeningHistoryRow[]>([]);
  const {
    selectedUser,
    search,
    setSearch,
    users,
    setUsers,
    isModalOpen,
    setIsModalOpen,
    handleUserClick,
    handleCloseSidebar,
    setSelectedUser,
    handleStatusChangeAndSync,
    handleScreeningUpdate,
    handleAddApplicant,
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
  } = useApplicants();

  const refreshData = (silent = false) => {
    if (!silent) setIsLoading(true);
    fetch('/api/applicants')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch applicants');
        return res.json();
      })
      .then((rows) => {
        const mapped = rows.map(mapScreeningApplicantRow).filter((u: any) => isScreeningStatus(u.status));
        setUsers(mapped);
      })
      .catch(() => setUsers([]))
      .finally(() => {
        if (!silent) setIsLoading(false);
      });
  };

  useEffect(() => {
    refreshData();
  }, [setUsers]);

  useEffect(() => {
    if (!showHistory) return;
    fetch('/api/applicants/screening-history')
      .then(res => (res.ok ? res.json() : []))
      .then((rows: ScreeningHistoryRow[]) => setScreeningHistory(rows))
      .catch(() => setScreeningHistory([]));
  }, [showHistory]);

  useEffect(() => {
    function onUpdated(e: any) {
      const detail = e?.detail || {};
      const { no, status } = detail;
      if (!no) return;

      setUsers(prev => {
        const idx = prev.findIndex(u => u.no === no);
        if (idx === -1) return prev;
        const updated = [...prev];
        if (status && !isScreeningStatus(status)) {
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
  }, [users, selectedUser?.id]);

  if (showHistory) {
    return (
      <PipelineHistoryShell
        title="Screening History"
        backLabel="Back to Screening"
        onBack={() => setShowHistory(false)}
      >
        <ScreeningHistoryTable rows={screeningHistory} />
      </PipelineHistoryShell>
    );
  }

  return (
    <>
      <PipelinePageShell>
        <PipelineModuleHeader
          title="Screening"
          subtitle="Review new applicants, documents, and initial interview progress."
          count={users.length}
          filteredCount={hasFilters ? filteredUsers.length : undefined}
          icon="fa-user-check"
        />

        <PipelineControlStrip
          timer={
            <ProcessTimer
              processName="Screening"
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
          primaryAction={{
            label: 'Input Data',
            icon: 'fa-plus',
            onClick: () => setIsModalOpen(true),
          }}
        />

        <ApplicantsTable
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

      <InputApplicantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddApplicant}
        onUpdateStatus={(_form, _newStatus) => { /* TODO: implement if needed */ }}
      />
    </>
  );
};

export default ScreeningList;
