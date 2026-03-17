import React, { useEffect, useState } from "react";
import type { User, ApplicationStatus, ScreeningStatus } from '../api/applicant';
import {
  IconArrowLeft,
  IconUser,
  IconClipboardCheck,
  IconPhone,
  IconEye,
  IconCalendarEvent,
  IconPencil,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import Assessment from "../pages/components/assessments/assessmentStatus";
import { useNavigation } from "./NavigationContext";
import { fetchClients } from "../api/client";

interface ApplicantSidebarProps {
  selectedUser: User | null;
  onClose: () => void;
  onStatusChange?: (userId: number, newStatus: ApplicationStatus) => void;
  onOpenScreening?: (user: User) => void;
  onScreeningUpdate?: (userId: number, key: keyof User, status: ScreeningStatus) => void;
  onRemoveApplicant?: (userId: number) => void;
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, React.ReactNode> = {
    'For Screening': <IconClipboardCheck size={16} />,
    'Doc Screening': <IconClipboardCheck size={16} />,
    'Physical Screening': <IconUser size={16} />,
    'Initial Interview': <IconCalendarEvent size={16} />,
    'Final Interview/Complete Requirements': <IconClipboardCheck size={16} />,
    'For Medical': <IconUser size={16} />,
    'For SBMA Gate Pass': <IconUser size={16} />,
    'On Boarding': <IconUser size={16} />,
    'Biometrics': <IconClipboardCheck size={16} />,
    'Metrex': <IconUser size={16} />,
    'For Deployment': <IconUser size={16} />,
    'Deployed': <IconUser size={16} />,
    'Document Screening': <IconClipboardCheck size={16} />,
    'Initial Review': <IconEye size={16} />,
    'Interview Scheduled': <IconCalendarEvent size={16} />,
    'Interview Completed': <IconClipboardCheck size={16} />,
    'Reference Check': <IconPhone size={16} />,
    'Offer Extended': <IconUser size={16} />,
    'Hired': <IconUser size={16} />,
    'Withdrawn': <IconUser size={16} />,
  };
  return icons[status] || <IconUser size={16} />;
};

// const formatDate = (dateString: string) => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   });
// };

const updateStatusInGoogleSheet = async (user: User, newStatus: ApplicationStatus) => {
  try {
    // Always fetch current clients from database to preserve them
    let clientIds: number[] = [];
    try {
      // First, try to get clients from user object
      const userClients = (user as any).clients || [];
      if (Array.isArray(userClients) && userClients.length > 0) {
        const allClients = await fetchClients();
        clientIds = allClients
          .filter(client => userClients.includes(client.name))
          .map(client => client.id);
      } else {
        // If user object doesn't have clients, fetch from database
        const response = await fetch(`/api/applicants?NO=${encodeURIComponent(user.no || '')}`);
        if (response.ok) {
          const applicants = await response.json();
          const applicant = applicants.find((a: any) => a.applicant_no === user.no);
          if (applicant && Array.isArray(applicant.clients) && applicant.clients.length > 0) {
            const allClients = await fetchClients();
            clientIds = allClients
              .filter(client => applicant.clients.includes(client.name))
              .map(client => client.id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch clients for status update:', error);
    }

    const payloadBody: Record<string, any> = {
      NO: user.no,
      REFFERED_BY: user.referredBy,
      LAST_NAME: user.lastName,
      FIRST_NAME: user.firstName,
      EXT: user.ext,
      MIDDLE: user.middle,
      GENDER: user.gender,
      SIZE: user.size,
      DATE_OF_BIRTH: user.dateOfBirth,
      DATE_APPLIED: user.dateApplied,
      FB_NAME: user.facebook,
      AGE: user.age,
      LOCATION: user.location,
      CONTACT_NUMBER: user.contactNumber,
      POSITION_APPLIED_FOR: user.positionApplied,
      EXPERIENCE: user.experience,
      STATUS: newStatus,
      REQUIREMENTS_STATUS: user.requirementsStatus,
      FINAL_INTERVIEW_STATUS: user.finalInterviewStatus,
      MEDICAL_STATUS: user.medicalStatus,
      STATUS_REMARKS: user.statusRemarks,
      APPLICANT_REMARKS: user.applicantRemarks,
      RECENT_PICTURE: user.recentPicture ? '1' : '0',
      PSA_BIRTH_CERTIFICATE: user.psaBirthCertificate ? '1' : '0',
      SCHOOL_CREDENTIALS: user.schoolCredentials ? '1' : '0',
      NBI_CLEARANCE: user.nbiClearance ? '1' : '0',
      POLICE_CLEARANCE: user.policeClearance ? '1' : '0',
      BARANGAY_CLEARANCE: user.barangayClearance ? '1' : '0',
      SSS: user.sss ? '1' : '0',
      PAGIBIG: user.pagibig ? '1' : '0',
      CEDULA: user.cedula ? '1' : '0',
      VACCINATION_STATUS: user.vaccinationStatus ? '1' : '0',
      RESUME: (user as any).resume ? '1' : '0',
      COE: (user as any).coe ? '1' : '0',
      PHILHEALTH: (user as any).philhealth ? '1' : '0',
      TIN_NUMBER: (user as any).tinNumber ? '1' : '0',
    };

    // Always send CLIENT_IDS (even if empty) so backend knows to preserve clients
    // Backend will only update if CLIENT_IDS is explicitly provided
    payloadBody.CLIENT_IDS = clientIds;

    await fetch('/api/applicants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadBody)
    });
    // Log every status change to screening history
    try {
      await fetch('/api/applicants/screening-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant_no: user.no,
          action: 'Status Updated',
          status: newStatus,
          notes: '',
        })
      });
    } catch { }
    // Also log to assessment history so assessment view stays in sync regardless of where status was changed
    try {
      await fetch('/api/applicants/assessment-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant_no: user.no,
          action: 'Status Updated',
          status: newStatus,
          notes: '',
        })
      });
      try { window.dispatchEvent(new CustomEvent('assessment-history-updated')); } catch { }
    } catch { }
    // Broadcast change to other lists without reload
    try {
      window.dispatchEvent(new CustomEvent('applicant-updated', { detail: { no: user.no, status: newStatus } }));
    } catch { }
  } catch (error) {
    console.error('Failed to sync status:', error);
  }
};

const updateUserDetails = async (user: User) => {
  try {
    // Always fetch current clients from database to preserve them
    let clientIds: number[] = [];
    try {
      const userClients = (user as any).clients || [];
      if (Array.isArray(userClients) && userClients.length > 0) {
        const allClients = await fetchClients();
        clientIds = allClients
          .filter(client => userClients.includes(client.name))
          .map(client => client.id);
      } else {
        const response = await fetch(`/api/applicants?NO=${encodeURIComponent(user.no || '')}`);
        if (response.ok) {
          const applicants = await response.json();
          const applicant = applicants.find((a: any) => a.applicant_no === user.no);
          if (applicant && Array.isArray(applicant.clients) && applicant.clients.length > 0) {
            const allClients = await fetchClients();
            clientIds = allClients
              .filter(client => applicant.clients.includes(client.name))
              .map(client => client.id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch clients for update:', error);
    }

    const payloadBody: Record<string, any> = {
      NO: user.no,
      REFFERED_BY: user.referredBy,
      LAST_NAME: user.lastName,
      FIRST_NAME: user.firstName,
      EXT: user.ext,
      MIDDLE: user.middle,
      GENDER: user.gender,
      SIZE: user.size,
      DATE_OF_BIRTH: user.dateOfBirth,
      DATE_APPLIED: user.dateApplied,
      FB_NAME: user.facebook,
      AGE: user.age,
      LOCATION: user.location,
      CONTACT_NUMBER: user.contactNumber,
      POSITION_APPLIED_FOR: user.positionApplied,
      EXPERIENCE: user.experience,
      STATUS: user.status,
      REQUIREMENTS_STATUS: (user as any).requirementsStatus,
      FINAL_INTERVIEW_STATUS: (user as any).finalInterviewStatus,
      MEDICAL_STATUS: (user as any).medicalStatus,
      STATUS_REMARKS: (user as any).statusRemarks,
      APPLICANT_REMARKS: (user as any).applicantRemarks,
      RECENT_PICTURE: (user as any).recentPicture ? '1' : '0',
      PSA_BIRTH_CERTIFICATE: (user as any).psaBirthCertificate ? '1' : '0',
      SCHOOL_CREDENTIALS: (user as any).schoolCredentials ? '1' : '0',
      NBI_CLEARANCE: (user as any).nbiClearance ? '1' : '0',
      POLICE_CLEARANCE: (user as any).policeClearance ? '1' : '0',
      BARANGAY_CLEARANCE: (user as any).barangayClearance ? '1' : '0',
      SSS: (user as any).sss ? '1' : '0',
      PAGIBIG: (user as any).pagibig ? '1' : '0',
      CEDULA: (user as any).cedula ? '1' : '0',
      VACCINATION_STATUS: (user as any).vaccinationStatus ? '1' : '0',
      RESUME: (user as any).resume ? '1' : '0',
      COE: (user as any).coe ? '1' : '0',
      PHILHEALTH: (user as any).philhealth ? '1' : '0',
      TIN_NUMBER: (user as any).tinNumber ? '1' : '0',
      CLIENT_IDS: clientIds
    };

    const res = await fetch('/api/applicants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadBody)
    });

    if (!res.ok) throw new Error('Failed to update applicant details');

    // Add to history
    try {
      await fetch('/api/applicants/screening-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant_no: user.no,
          action: 'Details Updated',
          status: user.status,
          notes: 'Personal details updated via edit mode.',
        })
      });
    } catch { }

    // Broadcast change
    window.dispatchEvent(new CustomEvent('applicant-updated', { 
      detail: { 
        no: user.no, 
        ...user 
      } 
    }));
  } catch (error) {
    console.error('Failed to sync details:', error);
    throw error;
  }
};

// Update only the status without triggering full data fetch
const updateStatusOnly = async (user: User, newStatus: ApplicationStatus) => {
  try {
    await fetch('/api/applicants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        NO: user.no,
        STATUS: newStatus,
      })
    });
    // Log to screening history
    try {
      await fetch('/api/applicants/screening-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant_no: user.no,
          action: 'Status Updated',
          status: newStatus,
          notes: '',
        })
      });
    } catch { }
    // Broadcast change
    try {
      window.dispatchEvent(new CustomEvent('applicant-updated', { detail: { no: user.no, status: newStatus } }));
    } catch { }
  } catch (error) {
    console.error('Failed to update status:', error);
  }
};

const updateDocumentFlag = async (user: User, key: string, checked: boolean) => {
  // Map UI keys to server payload keys
  const map: Record<string, string> = {
    recentPicture: 'RECENT_PICTURE',
    psaBirthCertificate: 'PSA_BIRTH_CERTIFICATE',
    schoolCredentials: 'SCHOOL_CREDENTIALS',
    nbiClearance: 'NBI_CLEARANCE',
    policeClearance: 'POLICE_CLEARANCE',
    barangayClearance: 'BARANGAY_CLEARANCE',
    sss: 'SSS',
    pagibig: 'PAGIBIG',
    cedula: 'CEDULA',
    vaccinationStatus: 'VACCINATION_STATUS',
    resume: 'RESUME',
    coe: 'COE',
    philhealth: 'PHILHEALTH',
    tinNumber: 'TIN_NUMBER',
  };
  const payloadKey = map[key];
  if (!payloadKey) return;
  try {
    const res = await fetch('/api/applicants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ NO: user.no, [payloadKey]: checked ? '1' : '0' })
    });
    if (!res.ok) throw new Error('Failed to update document flag');
    // Broadcast change
    try {
      window.dispatchEvent(new CustomEvent('applicant-updated', { 
        detail: { 
          no: user.no, 
          [key]: checked 
        } 
      }));
    } catch { }
  } catch (e) {
    console.error('Failed to sync document flag', key, e);
  }
};

const ApplicantSidebar: React.FC<ApplicantSidebarProps> = ({
  selectedUser,
  onClose,
  onStatusChange,
  // onOpenScreening,
  onScreeningUpdate,

}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'screening'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { activeSection, setActiveSection, setCurrentApplicantNo } = useNavigation();
  const isOpen = !!selectedUser;

  useEffect(() => {
    if (selectedUser) {
      setEditedUser(selectedUser);
      setIsEditing(false);
    }
  }, [selectedUser?.id]);

  const handleSaveDetails = async () => {
    if (!editedUser) return;
    setIsSaving(true);
    try {
      await updateUserDetails(editedUser);
      setIsEditing(false);
    } catch (error) {
      alert('Failed to save details. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (key: keyof User, value: string) => {
    if (editedUser) {
      setEditedUser({ ...editedUser, [key]: value });
    }
  };

  useEffect(() => {
    if (activeSection === 'assessment') {
      setActiveTab('screening');
    } else {
      setActiveTab('overview');
    }
  }, [activeSection, isOpen]);

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    if (selectedUser) {
      let finalStatus = newStatus;

      // Assessment "push through" behavior:
      // When requirements are complete in Assessment, the applicant should move to Selection as "For Medical".
      if (activeSection === 'assessment' && newStatus === 'Final Interview/Complete Requirements') {
        finalStatus = 'For Medical';
        try {
          setCurrentApplicantNo(selectedUser.no);
          setActiveSection('selection');
        } catch { }
      }

      onStatusChange?.(selectedUser.id, finalStatus);

      if (activeSection === 'assessment') {
        updateStatusOnly(selectedUser, finalStatus);
      } else {
        updateStatusInGoogleSheet(selectedUser, finalStatus);
      }
    }
  };

  const getAvatar = (name?: string) => {
    if (!name || typeof name !== 'string') {
      return (
        <div className="h-10 w-10 rounded-full bg-custom-teal/90 flex items-center justify-center shadow">
          <span className="text-white font-semibold">?</span>
        </div>
      );
    }
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    const initials = `${first}${last}`.toUpperCase();
    return (
      <div className="h-10 w-10 rounded-full bg-custom-teal/90 flex items-center justify-center shadow">
        <span className="text-white font-semibold">{initials}</span>
      </div>
    );
  };

  const getStatusBadge = (status: string) => (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-custom-teal bg-custom-teal/10">
      {getStatusIcon(status)}
      {status}
    </span>
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-30 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 h-full w-full z-50 flex flex-col transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ maxWidth: '800px' }}
      >
        <div className="bg-gray-900/95 z-[9999] backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col h-full relative">

          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-custom-teal to-transparent opacity-50" />

          <div className="bg-transparent border-b border-white/10 flex-shrink-0 relative z-10">
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-5">
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 text-text-secondary hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all active:scale-95"
                  title="Close sidebar"
                >
                  <IconArrowLeft size={22} />
                </button>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex items-center gap-4">
                  {selectedUser && getAvatar(selectedUser?.facebook)}
                  <div>
                    <h1 className="text-lg text-white font-bold leading-tight tracking-wide">{selectedUser?.facebook}</h1>
                    <p className="text-sm text-text-secondary mt-0.5 font-medium">{selectedUser?.positionApplied}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedUser?.status || '')}
              </div>
            </div>
            <div className="flex border-t border-white/10 bg-white/5 relative px-2 pt-2">
              {(() => {
                // Build tabs based on current section
                const tabs = [
                  { id: 'overview', label: 'Details', icon: <IconUser size={18} /> },
                  { id: 'screening', label: 'Assessment', icon: <IconClipboardCheck size={18} /> },
                ];
                // Filter: only the Assessment section should show the "Assessment" tab.
                // Screening/Selection/Engagement should behave like "details-only".
                const showBothTabs = activeSection === 'assessment';
                const visibleTabs = showBothTabs
                  ? tabs // Show both tabs in Assessment section
                  : tabs.filter(t => t.id === 'overview');
                return visibleTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex-1 px-4 py-3 text-sm font-semibold transition-all relative flex items-center justify-center gap-2 rounded-t-lg mx-1 ${activeTab === tab.id
                      ? 'text-custom-teal bg-white/10 shadow-[0_-2px_10px_rgba(0,0,0,0.2)]'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                      }`}
                    onClick={() => setActiveTab(tab.id as any)}
                  >
                    {tab.icon}
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute left-0 top-0 w-full h-0.5 bg-custom-teal rounded-t-full shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                    )}
                  </button>
                ));
              })()}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-transparent custom-scrollbar">
            <div className="p-6 space-y-6">
              {activeTab === 'overview' && selectedUser && (
                <div className="space-y-6">
                  {selectedUser && (
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-lg backdrop-blur-sm">
                      <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Status</h2>
                      <div className="relative">
                        <select
                          className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-custom-teal/50 focus:border-custom-teal bg-white/5 text-white appearance-none transition-all hover:bg-white/10"
                          value={selectedUser.status || ''}
                          onChange={e => handleStatusChange(e.target.value as ApplicationStatus)}
                        >
                          {/* Show only screening-related statuses when in screening section */}
                          {activeSection === 'screening' ? (
                            <>
                              <option value="For Screening" className="bg-gray-800 text-white">For Screening</option>
                              <option value="Doc Screening" className="bg-gray-800 text-white">Doc Screening</option>
                              <option value="Physical Screening" className="bg-gray-800 text-white">Physical Screening</option>
                              <option value="Initial Interview" className="bg-gray-800 text-white">Initial Interview</option>
                            </>
                          ) : activeSection === 'assessment' ? (
                            <>
                              {/* Assessment statuses */}
                              <option value="Final Interview" className="bg-gray-800 text-white">Final Interview</option>
                              <option value="Final Interview/Incomplete Requirements" className="bg-gray-800 text-white">Final Interview/Incomplete Requirements</option>
                              <option value="Final Interview/Complete Requirements" className="bg-gray-800 text-white">Final Interview/Complete Requirements</option>
                            </>
                          ) : activeSection === 'selection' ? (
                            <>
                              {/* Selection statuses */}
                              <option value="For Medical" className="bg-gray-800 text-white">For Medical</option>
                              <option value="Pending For Medical" className="bg-gray-800 text-white">Pending For Medical</option>
                              <option value="Biometrics" className="bg-gray-800 text-white">Biometrics</option>
                              <option value="For SBMA Gate Pass" className="bg-gray-800 text-white">For SBMA Gate Pass</option>
                              <option value="For Deployment" className="bg-gray-800 text-white">For Deployment</option>
                            </>
                          ) : activeSection === 'engagement' ? (
                            <>
                              {/* Engagement statuses */}
                              <option value="For Deployment" className="bg-gray-800 text-white">For Deployment</option>
                              <option value="Deployed" className="bg-gray-800 text-white">Deployed</option>
                            </>
                          ) : (
                            <>
                              <option value="For Screening" className="bg-gray-800 text-white">For Screening</option>
                              <option value="Doc Screening" className="bg-gray-800 text-white">Doc Screening</option>
                              <option value="Physical Screening" className="bg-gray-800 text-white">Physical Screening</option>
                              <option value="Initial Interview" className="bg-gray-800 text-white">Initial Interview</option>
                              <option value="Final Interview" className="bg-gray-800 text-white">Final Interview</option>
                              <option value="Final Interview/Incomplete Requirements" className="bg-gray-800 text-white">Final Interview/Incomplete Requirements</option>
                              <option value="Final Interview/Complete Requirements" className="bg-gray-800 text-white">Final Interview/Complete Requirements</option>
                              <option value="For Medical" className="bg-gray-800 text-white">For Medical</option>
                              <option value="Pending For Medical" className="bg-gray-800 text-white">Pending For Medical</option>
                              <option value="Biometrics" className="bg-gray-800 text-white">Biometrics</option>
                              <option value="For SBMA Gate Pass" className="bg-gray-800 text-white">For SBMA Gate Pass</option>
                              <option value="For Deployment" className="bg-gray-800 text-white">For Deployment</option>
                              <option value="Deployed" className="bg-gray-800 text-white">Deployed</option>
                            </>
                          )}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary/70 mt-2 font-medium">
                        Change the applicant's status to move them through the pipeline.
                      </p>
                    </div>
                  )}

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">Personal Details</h2>
                      {activeSection === 'screening' && (
                        <div className="flex items-center gap-2">
                          {isEditing && (
                            <button
                              onClick={() => {
                                setIsEditing(false);
                                setEditedUser(selectedUser);
                              }}
                              className="text-text-secondary hover:text-white px-2 py-1 text-xs rounded-lg transition-all flex items-center gap-1"
                              disabled={isSaving}
                            >
                              <IconX size={14} /> Cancel
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (isEditing) {
                                handleSaveDetails();
                              } else {
                                setIsEditing(true);
                              }
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isEditing
                              ? 'bg-custom-teal text-white shadow-lg shadow-custom-teal/20 scale-105'
                              : 'text-custom-teal bg-custom-teal/10 hover:bg-custom-teal/20'
                              }`}
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              <span className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                              </span>
                            ) : isEditing ? (
                              <><IconCheck size={14} /> Save Details</>
                            ) : (
                              <><IconPencil size={14} /> Edit Details</>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-text-secondary text-xs uppercase font-medium">Applicant No.</span>
                        <span className="font-semibold text-white bg-white/5 py-1.5 px-3 rounded-lg border border-white/5">
                          {selectedUser.no}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-text-secondary text-xs uppercase font-medium">Referred By</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white focus:ring-1 focus:ring-custom-teal outline-none"
                            value={editedUser?.referredBy || ''}
                            onChange={(e) => handleInputChange('referredBy', e.target.value)}
                          />
                        ) : (
                          <span className="font-medium text-white/90 px-1">{selectedUser.referredBy}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-text-secondary text-xs uppercase font-medium">Last Name</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white focus:ring-1 focus:ring-custom-teal outline-none"
                            value={editedUser?.lastName || ''}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                          />
                        ) : (
                          <span className="font-semibold text-white px-1 tracking-wide">{selectedUser.lastName}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-text-secondary text-xs uppercase font-medium">First Name</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white focus:ring-1 focus:ring-custom-teal outline-none"
                            value={editedUser?.firstName || ''}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                          />
                        ) : (
                          <span className="font-semibold text-white px-1 tracking-wide">{selectedUser.firstName}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-text-secondary text-xs uppercase font-medium">Extension</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white focus:ring-1 focus:ring-custom-teal outline-none"
                            value={editedUser?.ext || ''}
                            onChange={(e) => handleInputChange('ext', e.target.value)}
                          />
                        ) : (
                          <span className="font-medium text-white/90 px-1">{selectedUser.ext}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-text-secondary text-xs uppercase font-medium">Middle Name</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white focus:ring-1 focus:ring-custom-teal outline-none"
                            value={editedUser?.middle || ''}
                            onChange={(e) => handleInputChange('middle', e.target.value)}
                          />
                        ) : (
                          <span className="font-medium text-white/90 px-1">{selectedUser.middle}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-text-secondary text-xs uppercase font-medium">Gender</span>
                        {isEditing ? (
                          <select
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white focus:ring-1 focus:ring-custom-teal outline-none"
                            value={editedUser?.gender || ''}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                          >
                            <option value="" className="bg-gray-800">Select Gender</option>
                            <option value="Male" className="bg-gray-800">Male</option>
                            <option value="Female" className="bg-gray-800">Female</option>
                          </select>
                        ) : (
                          <span className="font-medium text-white/90 px-1">{selectedUser.gender}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-text-secondary text-xs uppercase font-medium">Size</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white focus:ring-1 focus:ring-custom-teal outline-none"
                            value={editedUser?.size || ''}
                            onChange={(e) => handleInputChange('size', e.target.value)}
                          />
                        ) : (
                          <span className="font-medium text-white/90 px-1">{selectedUser.size}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-text-secondary text-xs uppercase font-medium">Date of Birth</span>
                        {isEditing ? (
                          <input
                            type="date"
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white focus:ring-1 focus:ring-custom-teal outline-none"
                            value={editedUser?.dateOfBirth || ''}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          />
                        ) : (
                          <span className="font-medium text-white/90 px-1">{selectedUser.dateOfBirth}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-text-secondary text-xs uppercase font-medium">Date Applied</span>
                        {isEditing ? (
                          <input
                            type="date"
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white focus:ring-1 focus:ring-custom-teal outline-none"
                            value={editedUser?.dateApplied || ''}
                            onChange={(e) => handleInputChange('dateApplied', e.target.value)}
                          />
                        ) : (
                          <span className="font-medium text-white/90 px-1">{selectedUser.dateApplied}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-text-secondary text-xs uppercase font-medium">Facebook Name</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white focus:ring-1 focus:ring-custom-teal outline-none"
                            value={editedUser?.facebook || ''}
                            onChange={(e) => handleInputChange('facebook', e.target.value)}
                          />
                        ) : (
                          <span className="font-medium text-white/90 px-1 text-custom-teal underline decoration-custom-teal/30 underline-offset-4">{selectedUser.facebook}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-text-secondary text-xs uppercase font-medium">Age</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white focus:ring-1 focus:ring-custom-teal outline-none"
                            value={editedUser?.age || ''}
                            onChange={(e) => handleInputChange('age', e.target.value)}
                          />
                        ) : (
                          <span className="font-medium text-white/90 px-1">{selectedUser.age}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-text-secondary text-xs uppercase font-medium">Location</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white focus:ring-1 focus:ring-custom-teal outline-none"
                            value={editedUser?.location || ''}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                          />
                        ) : (
                          <span className="font-medium text-white/90 px-1">{selectedUser.location}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-text-secondary text-xs uppercase font-medium">Contact Number</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white focus:ring-1 focus:ring-custom-teal outline-none"
                            value={editedUser?.contactNumber || ''}
                            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                          />
                        ) : (
                          <span className="font-medium text-white/90 px-1">{selectedUser.contactNumber}</span>
                        )}
                      </div>
                      <div className="col-span-1 md:col-span-2 flex flex-col gap-1">
                        <span className="text-text-secondary text-xs uppercase font-medium">Position Applied For</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-custom-teal font-semibold outline-none focus:ring-1 focus:ring-custom-teal"
                            value={editedUser?.positionApplied || ''}
                            onChange={(e) => handleInputChange('positionApplied', e.target.value)}
                          />
                        ) : (
                          <span className="font-semibold text-custom-teal bg-custom-teal/10 py-2 px-3 rounded-lg border border-custom-teal/20 w-full">{selectedUser.positionApplied}</span>
                        )}
                      </div>
                      <div className="col-span-1 md:col-span-2 flex flex-col gap-1">
                        <span className="text-text-secondary text-xs uppercase font-medium">Experience</span>
                        {isEditing ? (
                          <textarea
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:ring-1 focus:ring-custom-teal min-h-[80px]"
                            value={editedUser?.experience || ''}
                            onChange={(e) => handleInputChange('experience' as any, e.target.value)}
                          />
                        ) : (
                          <span className="font-medium text-white/90 px-3 py-2 bg-white/5 rounded-lg border border-white/5 leading-relaxed italic text-sm">{selectedUser.experience || 'No experience listed'}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-lg backdrop-blur-sm">
                    <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                      <IconClipboardCheck size={18} className="text-custom-teal" />
                      Document Checklist
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer"
                          checked={!!selectedUser.recentPicture}
                          onChange={(e) => {
                            onScreeningUpdate?.(selectedUser.id, 'recentPicture' as any, e.target.checked as any);
                            updateDocumentFlag(selectedUser, 'recentPicture', e.target.checked);
                          }}
                        />
                        <span className="text-text-secondary group-hover:text-white transition-colors">Recent 2x2 picture</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer" checked={!!selectedUser.psaBirthCertificate}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'psaBirthCertificate' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'psaBirthCertificate', e.target.checked); }}
                        />
                        <span className="text-text-secondary group-hover:text-white transition-colors">PSA Birth Certificate</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer" checked={!!selectedUser.schoolCredentials}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'schoolCredentials' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'schoolCredentials', e.target.checked); }}
                        />
                        <span className="text-text-secondary group-hover:text-white transition-colors">School Credentials</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer" checked={!!selectedUser.nbiClearance}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'nbiClearance' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'nbiClearance', e.target.checked); }}
                        />
                        <span className="text-text-secondary group-hover:text-white transition-colors">NBI Clearance</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer" checked={!!selectedUser.policeClearance}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'policeClearance' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'policeClearance', e.target.checked); }}
                        />
                        <span className="text-text-secondary group-hover:text-white transition-colors">Police Clearance</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer" checked={!!selectedUser.barangayClearance}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'barangayClearance' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'barangayClearance', e.target.checked); }}
                        />
                        <span className="text-text-secondary group-hover:text-white transition-colors">Barangay Clearance</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer" checked={!!selectedUser.sss}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'sss' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'sss', e.target.checked); }}
                        />
                        <span className="text-text-secondary group-hover:text-white transition-colors">SSS No. / Static Info</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer" checked={!!selectedUser.pagibig}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'pagibig' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'pagibig', e.target.checked); }}
                        />
                        <span className="text-text-secondary group-hover:text-white transition-colors">Pag-IBIG #</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer" checked={!!selectedUser.cedula}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'cedula' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'cedula', e.target.checked); }}
                        />
                        <span className="text-text-secondary group-hover:text-white transition-colors">Cedula</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer" checked={!!selectedUser.vaccinationStatus}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'vaccinationStatus' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'vaccinationStatus', e.target.checked); }}
                        />
                        <span className="text-text-secondary group-hover:text-white transition-colors">Vaccination Status</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer" checked={!!(selectedUser as any).resume}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'resume' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'resume', e.target.checked); }}
                        />
                        <span className="text-text-secondary group-hover:text-white transition-colors">Resume</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer" checked={!!(selectedUser as any).coe}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'coe' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'coe', e.target.checked); }}
                        />
                        <span className="text-text-secondary group-hover:text-white transition-colors">COE</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer" checked={!!(selectedUser as any).philhealth}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'philhealth' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'philhealth', e.target.checked); }}
                        />
                        <span className="text-text-secondary group-hover:text-white transition-colors">PhilHealth</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer" checked={!!(selectedUser as any).tinNumber}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'tinNumber' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'tinNumber', e.target.checked); }}
                        />
                        <span className="text-text-secondary group-hover:text-white transition-colors">TIN Number</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'screening' && selectedUser && (
                <Assessment applicantNo={selectedUser.no} showApplicantHeader={false} 
                />
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ApplicantSidebar;