import React, { useState } from "react";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";
import InputApplicantModal from './InputApplicantModal';
import { useApplicants } from "./hooks/useApplicants";
import { useGoogleSheetApplicants } from "./hooks/useGoogleSheetApplicants";
import ApplicantsTable from "./components/ApplicantsTable";
import ApplicantsToolbar from "./components/ApplicantsToolbar";

const ScreeningList: React.FC = () => {
  const { applicants, loading } = useGoogleSheetApplicants();
  const [showHistory, setShowHistory] = useState(false);
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
    filteredUsers,
  } = useApplicants();

  React.useEffect(() => {
    if (!loading && applicants.length > 0) {
      setUsers(applicants);
    }
  }, [loading, applicants, setUsers]);

  // If history is shown, render the toolbar component which will handle the full-page view
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
          onOpenSheet={() => {
            window.open('https://docs.google.com/spreadsheets/d/1Iwz2TJ6We1FtIL4BhEnDW_qlt5Q7f2aAIX2fn2SDqUQ/edit?gid=0#gid=0', '_blank');
          }}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
        />
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <div className="flex-1 max-w-full mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <ApplicantsToolbar
            search={search}
            setSearch={setSearch}
            usersCount={users.length}
            onOpenModal={() => setIsModalOpen(true)}
            onOpenSheet={() => {
              window.open('https://docs.google.com/spreadsheets/d/1Iwz2TJ6We1FtIL4BhEnDW_qlt5Q7f2aAIX2fn2SDqUQ/edit?gid=0#gid=0', '_blank');
            }}
            showHistory={showHistory}
            setShowHistory={setShowHistory}
          />
          <div className="p-0">
            <ApplicantsTable
              users={filteredUsers}
              selectedUser={selectedUser}
              onUserClick={handleUserClick}
            />
          </div>
        </div>
      </div>
      <ApplicantSidebar
        selectedUser={selectedUser}
        onClose={handleCloseSidebar}
        onStatusChange={handleStatusChangeAndSync}
        onScreeningUpdate={handleScreeningUpdate}
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