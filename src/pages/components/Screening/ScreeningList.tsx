import React, { useEffect, useState } from "react";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";
import InputApplicantModal from './InputApplicantModal';
import { useApplicants } from "./hooks/useApplicants";
import ApplicantsTable from "./components/ApplicantsTable";
import ApplicantsToolbar from "./components/ApplicantsToolbar";
import { isScreeningStatus, mapScreeningApplicantRow } from "./utils/screeningUtils";

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
  } = useApplicants();

  useEffect(() => {
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
    <div className="flex w-full">
      <div className="flex-1 max-w-full mx-auto py-10 px-4">
        <div className="bg-white max-w-[77vw] rounded-2xl shadow-lg overflow-hidden">
          <ApplicantsToolbar
            search={search}
            setSearch={setSearch}
            usersCount={users.length}
            onOpenModal={() => setIsModalOpen(true)}
            showHistory={showHistory}
            setShowHistory={setShowHistory}
          />
          <div className="p-0">
            <ApplicantsTable
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