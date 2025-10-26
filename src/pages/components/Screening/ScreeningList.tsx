import React, { useEffect, useState } from "react";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";
import InputApplicantModal from './InputApplicantModal';
import { useApplicants } from "./hooks/useApplicants";
import ApplicantsTable from "./components/ApplicantsTable";
import ApplicantsToolbar from "./components/ApplicantsToolbar";

const ScreeningList: React.FC = () => {
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
    removeApplicant,
    filteredUsers,
  } = useApplicants();

  useEffect(() => {
    fetch('/api/applicants')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch applicants');
        return res.json();
      })
      .then((rows) => {
        const mapped = rows.map((r: any) => ({
          id: r.id,
          no: r.applicant_no || '',
          referredBy: r.referred_by || '',
          lastName: r.last_name || '',
          firstName: r.first_name || '',
          ext: r.ext || '',
          middle: r.middle_name || '',
          gender: r.gender || '',
          size: r.size || '',
          dateOfBirth: r.date_of_birth || '',
          dateApplied: r.date_applied || '',
          facebook: r.fb_name || '',
          age: r.age || '',
          location: r.location || '',
          contactNumber: r.contact_number || '',
          positionApplied: r.position_applied_for || '',
          experience: r.experience || '',
          datian: r.datian || '',
          hokei: r.hokei || '',
          pobc: r.pobc || '',
          jinboway: r.jinboway || '',
          surprise: r.surprise || '',
          thaleste: r.thaleste || '',
          aolly: r.aolly || '',
          enjoy: r.enjoy || '',
          status: r.status || '',
          requirementsStatus: r.requirements_status || '',
          finalInterviewStatus: r.final_interview_status || '',
          medicalStatus: r.medical_status || '',
          statusRemarks: r.status_remarks || '',
          applicantRemarks: r.applicant_remarks || '',
          // Document checklist flags
          recentPicture: Boolean(r.recent_picture),
          psaBirthCertificate: Boolean(r.psa_birth_certificate),
          schoolCredentials: Boolean(r.school_credentials),
          nbiClearance: Boolean(r.nbi_clearance),
          policeClearance: Boolean(r.police_clearance),
          barangayClearance: Boolean(r.barangay_clearance),
          sss: Boolean(r.sss),
          pagibig: Boolean(r.pagibig),
          cedula: Boolean(r.cedula),
          vaccinationStatus: Boolean(r.vaccination_status),
          // Extra flags used in sidebar via runtime props
          resume: Boolean(r.resume),
          coe: Boolean(r.coe),
          philhealth: Boolean(r.philhealth),
          tinNumber: Boolean(r.tin_number),
        }));
        setUsers(mapped.filter((u: any) => ['For Screening', 'Doc Screening', 'Physical Screening'].includes(u.status || '')));
      })
      .catch(() => {
        setUsers([]);
      });
  }, [setUsers]);

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