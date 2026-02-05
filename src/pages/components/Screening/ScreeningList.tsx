import React, { useEffect, useState } from "react";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";
import InputApplicantModal from './InputApplicantModal';
import { useApplicants } from "./hooks/useApplicants";
import ApplicantsTable from "./components/ApplicantsTable";
import ApplicantsToolbar from "./components/ApplicantsToolbar";
import { isScreeningStatus, mapScreeningApplicantRow } from "./utils/screeningUtils";
import FilterBar from "../../../components/Filters/FilterBar";
import FilterSidebar from "../../../components/Filters/FilterSidebar";
import ProcessTimer from "../../../components/ProcessTimer";

const ScreeningList: React.FC = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    handleStatusChangeAndSync,
    handleScreeningUpdate,
    handleAddApplicant,
    removeApplicant,
    filteredUsers,
    // Filter-related
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

  const refreshData = () => {
    setIsLoading(true);
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
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    refreshData();
  }, [setUsers]);

  useEffect(() => {
    function onUpdated(e: any) {
      const detail = e?.detail || {};
      const { no, status } = detail;
      if (!no) return;
      setUsers(prev => {
        const idx = prev.findIndex(u => u.no === no);
        if (idx === -1) return prev;
        if (!isScreeningStatus(status)) {
          const updated = [...prev];
          updated.splice(idx, 1);
          return updated;
        }
        const updated = [...prev];
        updated[idx] = { ...updated[idx], status } as any;
        return updated;
      });
    }
    window.addEventListener('applicant-updated', onUpdated);
    return () => window.removeEventListener('applicant-updated', onUpdated);
  }, [setUsers]);

  if (showHistory) {
    return (
      <div>
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: '#10b981',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          📊 History View Active
        </div>
        <ApplicantsToolbar
          search={search}
          setSearch={setSearch}
          usersCount={users.length}
          onOpenModal={() => setIsModalOpen(true)}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
        />
      </div>
    );
  }

  return (
    <div className="flex w-full relative overflow-hidden">
      <div className="flex-1 max-w-full mx-auto py-6 px-4 md:px-8">
        <div className="glass-card max-w-full rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 backdrop-blur-xl relative z-10 transition-all hover:border-white/20">
          {/* Timer and Filter Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
            <ProcessTimer
              processName="Screening"
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

          {/* Existing Toolbar */}
          <ApplicantsToolbar
            search={search}
            setSearch={setSearch}
            usersCount={users.length}
            onOpenModal={() => setIsModalOpen(true)}
            showHistory={showHistory}
            setShowHistory={setShowHistory}
          />

          {/* Existing Table */}
          <div className="p-0">
            <ApplicantsTable
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

      {/* Filter Sidebar Modal - NEW */}
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
    </div>
  );
};

export default ScreeningList; 