import React, { useEffect, useState } from "react";
import type { User, ApplicationStatus, ScreeningStatus } from '../api/applicant';
import { 
  IconArrowLeft, 
  IconUser, 
  IconClipboardCheck, 
  IconPhone, 
  IconEye,
  IconCalendarEvent,
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
    'Completion': <IconClipboardCheck size={16} />,
    'Final Interview': <IconCalendarEvent size={16} />,
    'Final Interview/Incomplete Requirements': <IconCalendarEvent size={16} />,
    'Final Interview/Complete Requirements': <IconCalendarEvent size={16} />,
    'For Final Interview/For Assessment': <IconCalendarEvent size={16} />,
    'For Completion': <IconClipboardCheck size={16} />,
    'For Medical': <IconUser size={16} />,
    'For SBMA Gate Pass': <IconUser size={16} />,
    'On Boarding': <IconUser size={16} />,
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
    } catch {}
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
      try { window.dispatchEvent(new CustomEvent('assessment-history-updated')); } catch {}
    } catch {}
    // Broadcast change to other lists without reload
    try {
      window.dispatchEvent(new CustomEvent('applicant-updated', { detail: { no: user.no, status: newStatus } }));
    } catch {}
  } catch (error) {
    console.error('Failed to sync status:', error);
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
    } catch {}
    // Broadcast change
    try {
      window.dispatchEvent(new CustomEvent('applicant-updated', { detail: { no: user.no, status: newStatus } }));
    } catch {}
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
    await fetch('/api/applicants', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ NO: user.no, [payloadKey]: checked ? '1' : '0' })
    });
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
  onRemoveApplicant
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'screening'>('overview');
  const { setActiveSection, activeSection, setCurrentApplicantNo } = useNavigation();
  const isOpen = !!selectedUser;

  // Ensure the correct tab is selected based on the current app section
  useEffect(() => {
    if (activeSection === 'assessment') {
      setActiveTab('screening'); // default to Assessment content, but allow switching to Screening
    } else {
      setActiveTab('overview'); // show Screening content
    }
  }, [activeSection, isOpen]);

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    if (selectedUser) {
      onStatusChange?.(selectedUser.id, newStatus);
      
      // For Assessment, only update status without full data fetch
      if (activeSection === 'assessment') {
        updateStatusOnly(selectedUser, newStatus);
      } else {
        // For other sections, use full update
        updateStatusInGoogleSheet(selectedUser, newStatus);
      }
      // Status change only updates status - no automatic removal or navigation
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
        className={`fixed right-0 top-0 h-full w-full z-40 flex flex-col transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ maxWidth: '800px' }}
      >
        <div className="bg-white border-l border-gray-200 shadow-2xl flex flex-col h-full relative">

          <div className="absolute left-0 top-0 h-full w-2 bg-custom-teal rounded-l-xl" />

          <div className="bg-white border-b border-gray-200 flex-shrink-0 relative z-10">
            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 text-gray-600 hover:text-custom-teal rounded-md p-2 transition-colors"
                  title="Close sidebar"
                >
                  <IconArrowLeft size={20} />
                </button>
                <div className="h-5 w-px bg-gray-200" />
                <div className="flex items-center gap-3">
                  {selectedUser && getAvatar(selectedUser?.facebook)}
                  <div>
                    <h1 className="text-base text-gray-900 font-semibold leading-tight">{selectedUser?.facebook}</h1>
                    <p className="text-sm text-gray-600">{selectedUser?.positionApplied}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedUser?.status || '')}
              </div>
            </div>
            <div className="flex border-t border-gray-100 bg-gray-50 relative">
              {(() => {
                // Build tabs based on current section
                const tabs = [
                  { id: 'overview', label: 'Details', icon: <IconUser size={16} /> },
                  { id: 'screening', label: 'Assessment', icon: <IconClipboardCheck size={16} /> },
                ];
                // Filter: show relevant tabs in each section
                const showBothTabs = activeSection === 'assessment' || activeSection === 'selection' || activeSection === 'engagement';
                const visibleTabs = showBothTabs
                  ? tabs // Show both tabs in assessment/selection/engagement sections
                  : tabs.filter(t => t.id === 'overview');
                return visibleTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors relative flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? 'text-custom-teal bg-white'
                        : 'text-gray-600 hover:text-custom-teal'
                    }`}
                    onClick={() => setActiveTab(tab.id as any)}
                  >
                    {tab.icon}
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-8 h-0.5 bg-custom-teal rounded-full" />
                    )}
                  </button>
                ));
              })()}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-5 space-y-5">
              {activeTab === 'overview' && selectedUser && (
                <div className="space-y-5">
{selectedUser && (
  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-2">
    <h2 className="text-sm font-semibold text-gray-800 mb-2">Status</h2>
    <select
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-custom-teal focus:border-custom-teal bg-white"
      value={selectedUser.status || ''}
      onChange={e => handleStatusChange(e.target.value as ApplicationStatus)}
    >
      {/* Show only screening-related statuses when in screening section */}
      {activeSection === 'screening' ? (
        <>
          <option value="For Screening">For Screening</option>
          <option value="Doc Screening">Doc Screening</option>
          <option value="Physical Screening">Physical Screening</option>
          <option value="Initial Interview">Initial Interview</option>
        </>
      ) : activeSection === 'assessment' ? (
        <>
          {/* Assessment statuses */}
          <option value="For Final Interview/For Assessment">For Final Interview/For Assessment</option>
          <option value="Final Interview">Final Interview</option>
          <option value="Final Interview/Incomplete Requirements">Final Interview/Incomplete Requirements</option>
          <option value="Final Interview/Complete Requirements">Final Interview/Complete Requirements</option>
          <option value="For Completion">For Completion</option>
        </>
      ) : activeSection === 'selection' ? (
        <>
          {/* Selection statuses */}
          <option value="For Completion">For Completion</option>
          <option value="For Medical">For Medical</option>
          <option value="For SBMA Gate Pass">For SBMA Gate Pass</option>
          <option value="For Deployment">For Deployment</option>
        </>
      ) : activeSection === 'engagement' ? (
        <>
          {/* Engagement statuses */}
          <option value="For Deployment">For Deployment</option>
          <option value="Deployed">Deployed</option>
        </>
      ) : (
        <>
          <option value="For Screening">For Screening</option>
          <option value="Doc Screening">Doc Screening</option>
          <option value="Physical Screening">Physical Screening</option>
          <option value="Initial Interview">Initial Interview</option>
          <option value="For Final Interview/For Assessment">For Final Interview/For Assessment</option>
          <option value="Final Interview">Final Interview</option>
          <option value="Final Interview/Incomplete Requirements">Final Interview/Incomplete Requirements</option>
          <option value="Final Interview/Complete Requirements">Final Interview/Complete Requirements</option>
          <option value="For Completion">For Completion</option>
          <option value="For Medical">For Medical</option>
          <option value="For SBMA Gate Pass">For SBMA Gate Pass</option>
          <option value="For Deployment">For Deployment</option>
          <option value="Deployed">Deployed</option>
        </>
      )}
    </select>
    <p className="text-xs text-gray-500 mt-1">
      Change the applicant's status.
    </p>
  </div>
)}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-semibold text-gray-800">Personal Details</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                      <div><span className="text-gray-500">Applicant No.:</span> <span className="font-medium text-gray-900">{selectedUser.no}</span></div>
                      <div><span className="text-gray-500">Referred By:</span> <span className="font-medium text-gray-900">{selectedUser.referredBy}</span></div>
                      <div><span className="text-gray-500">Last Name:</span> <span className="font-medium text-gray-900">{selectedUser.lastName}</span></div>
                      <div><span className="text-gray-500">First Name:</span> <span className="font-medium text-gray-900">{selectedUser.firstName}</span></div>
                      <div><span className="text-gray-500">Extension:</span> <span className="font-medium text-gray-900">{selectedUser.ext}</span></div>
                      <div><span className="text-gray-500">Middle Name:</span> <span className="font-medium text-gray-900">{selectedUser.middle}</span></div>
                      <div><span className="text-gray-500">Gender:</span> <span className="font-medium text-gray-900">{selectedUser.gender}</span></div>
                      <div><span className="text-gray-500">Size:</span> <span className="font-medium text-gray-900">{selectedUser.size}</span></div>
                      <div><span className="text-gray-500">Date of Birth:</span> <span className="font-medium text-gray-900">{selectedUser.dateOfBirth}</span></div>
                      <div><span className="text-gray-500">Date Applied:</span> <span className="font-medium text-gray-900">{selectedUser.dateApplied}</span></div>
                      <div><span className="text-gray-500">Facebook Name:</span> <span className="font-medium text-gray-900">{selectedUser.facebook}</span></div>
                      <div><span className="text-gray-500">Age:</span> <span className="font-medium text-gray-900">{selectedUser.age}</span></div>
                      <div><span className="text-gray-500">Location:</span> <span className="font-medium text-gray-900">{selectedUser.location}</span></div>
                      <div><span className="text-gray-500">Contact Number:</span> <span className="font-medium text-gray-900">{selectedUser.contactNumber}</span></div>
                      <div><span className="text-gray-500">Position Applied For:</span> <span className="font-medium text-gray-900">{selectedUser.positionApplied}</span></div>
                      <div className="md:col-span-2"><span className="text-gray-500">Experience:</span> <span className="font-medium text-gray-900">{selectedUser.experience}</span></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-800 mb-3">Document Checklist</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-custom-teal focus:ring-custom-teal"
                          checked={!!selectedUser.recentPicture}
                          onChange={(e) => {
                            onScreeningUpdate?.(selectedUser.id, 'recentPicture' as any, e.target.checked as any);
                            updateDocumentFlag(selectedUser, 'recentPicture', e.target.checked);
                          }}
                        />
                        Recent 2x2 picture
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-custom-teal focus:ring-custom-teal" checked={!!selectedUser.psaBirthCertificate}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'psaBirthCertificate' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'psaBirthCertificate', e.target.checked); }}
                        />
                        PSA Birth Certificate
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-custom-teal focus:ring-custom-teal" checked={!!selectedUser.schoolCredentials}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'schoolCredentials' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'schoolCredentials', e.target.checked); }}
                        />
                        School Credentials/Certificate
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-custom-teal focus:ring-custom-teal" checked={!!selectedUser.nbiClearance}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'nbiClearance' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'nbiClearance', e.target.checked); }}
                        />
                        NBI Clearance
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-custom-teal focus:ring-custom-teal" checked={!!selectedUser.policeClearance}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'policeClearance' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'policeClearance', e.target.checked); }}
                        />
                        Police Clearance
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-custom-teal focus:ring-custom-teal" checked={!!selectedUser.barangayClearance}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'barangayClearance' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'barangayClearance', e.target.checked); }}
                        />
                        Barangay Clearance
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-custom-teal focus:ring-custom-teal" checked={!!selectedUser.sss}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'sss' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'sss', e.target.checked); }}
                        />
                        SSS No. / E1 Form / Static Information
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-custom-teal focus:ring-custom-teal" checked={!!selectedUser.pagibig}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'pagibig' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'pagibig', e.target.checked); }}
                        />
                        Pag-IBIG #
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-custom-teal focus:ring-custom-teal" checked={!!selectedUser.cedula}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'cedula' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'cedula', e.target.checked); }}
                        />
                        Cedula
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-custom-teal focus:ring-custom-teal" checked={!!selectedUser.vaccinationStatus}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'vaccinationStatus' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'vaccinationStatus', e.target.checked); }}
                        />
                        Vaccination Status
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-custom-teal focus:ring-custom-teal" checked={!!(selectedUser as any).resume}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'resume' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'resume', e.target.checked); }}
                        />
                        Resume
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-custom-teal focus:ring-custom-teal" checked={!!(selectedUser as any).coe}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'coe' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'coe', e.target.checked); }}
                        />
                        Certificate of Employment (COE)
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-custom-teal focus:ring-custom-teal" checked={!!(selectedUser as any).philhealth}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'philhealth' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'philhealth', e.target.checked); }}
                        />
                        PhilHealth
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-custom-teal focus:ring-custom-teal" checked={!!(selectedUser as any).tinNumber}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'tinNumber' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'tinNumber', e.target.checked); }}
                        />
                        TIN Number
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'screening' && selectedUser && (
                <Assessment applicantNo={selectedUser.no} showApplicantHeader={false} />
              )}
            </div>
          </div>
          <div className="bg-white border-t border-gray-200 p-4 shadow-sm flex-shrink-0">
            <div className="flex gap-2">
              <button
                className="cursor-pointer flex-1 bg-custom-teal hover:bg-custom-teal/90 text-white font-medium py-2.5 rounded-md transition-colors text-sm flex items-center justify-center gap-2"
                onClick={async () => {
                  if (activeSection === 'screening') {
                    if (selectedUser?.no) setCurrentApplicantNo(selectedUser.no);
                    // Move out of Screening: update status so Screening table (which shows only "For Screening") hides it
                    if (selectedUser) {
                      onStatusChange?.(selectedUser.id, 'For Final Interview/For Assessment' as any);
                      await updateStatusInGoogleSheet(selectedUser, 'For Final Interview/For Assessment' as any);
                      // log screening history
                      try {
                        await fetch('/api/applicants/screening-history', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            applicant_no: selectedUser.no,
                            action: 'Proceeded to Assessment',
                            status: 'For Final Interview/For Assessment',
                            notes: '',
                          })
                        });
                      } catch {}
                      // Remove from Screening table immediately
                      onRemoveApplicant?.(selectedUser.id);
                    }
                    // Do not navigate to Assessment automatically; just close the sidebar
                    onClose();
                  } else if (activeSection === 'assessment') {
                    // Handle assessment workflow based on current status
                    if (selectedUser) {
                      const currentStatus = selectedUser.status || '';
                      
                      if (currentStatus === 'Final Interview') {
                        // Show requirement completion options
                        const requirementStatus = prompt('Requirements Status:\n1. Complete Requirements\n2. Incomplete Requirements\n\nEnter 1 or 2:');
                        
                        if (requirementStatus === '1') {
                          // Complete Requirements - change status to Final Interview/Complete Requirements
                          onStatusChange?.(selectedUser.id, 'Final Interview/Complete Requirements' as any);
                          await updateStatusInGoogleSheet(selectedUser, 'Final Interview/Complete Requirements' as any);
                          
                          // Log the progression
                          try {
                            await fetch('/api/applicants/assessment-history', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                applicant_no: selectedUser.no,
                                action: 'Final Interview - Requirements Complete',
                                status: 'Final Interview/Complete Requirements',
                                notes: 'Requirements completed successfully',
                              })
                            });
                          } catch {}
                          try { window.dispatchEvent(new CustomEvent('assessment-history-updated')); } catch {}
                          
                          // Don't remove from Assessment table - just change status
                        } else if (requirementStatus === '2') {
                          // Incomplete Requirements - change status to Final Interview/Incomplete Requirements
                          onStatusChange?.(selectedUser.id, 'Final Interview/Incomplete Requirements' as any);
                          await updateStatusInGoogleSheet(selectedUser, 'Final Interview/Incomplete Requirements' as any);
                          
                          // Log the progression
                          try {
                            await fetch('/api/applicants/assessment-history', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                applicant_no: selectedUser.no,
                                action: 'Final Interview - Requirements Incomplete',
                                status: 'Final Interview/Incomplete Requirements',
                                notes: 'Requirements incomplete',
                              })
                            });
                          } catch {}
                          try { window.dispatchEvent(new CustomEvent('assessment-history-updated')); } catch {}
                          
                          // Don't remove from Assessment table - just change status
                        }
                      } else if (currentStatus === 'Final Interview/Complete Requirements') {
                        // Complete Requirements - proceed to For Medical
                        onStatusChange?.(selectedUser.id, 'For Medical' as any);
                        await updateStatusInGoogleSheet(selectedUser, 'For Medical' as any);
                        
                        // Log the progression
                        try {
                          await fetch('/api/applicants/assessment-history', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              applicant_no: selectedUser.no,
                              action: 'Requirements Complete - Proceeded to Medical',
                              status: 'For Medical',
                              notes: 'Requirements completed successfully',
                            })
                          });
                        } catch {}
                        try { window.dispatchEvent(new CustomEvent('assessment-history-updated')); } catch {}
                        
                        // Remove from Assessment table immediately
                        onRemoveApplicant?.(selectedUser.id);
                        setActiveSection('engagement'); // Go to engagement/medical section
                      } else if (currentStatus === 'Final Interview/Incomplete Requirements') {
                        // Incomplete Requirements - send back to screening
                        onStatusChange?.(selectedUser.id, 'For Screening' as any);
                        await updateStatusInGoogleSheet(selectedUser, 'For Screening' as any);
                        
                        // Log the progression
                        try {
                          await fetch('/api/applicants/assessment-history', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              applicant_no: selectedUser.no,
                              action: 'Requirements Incomplete - Returned to Screening',
                              status: 'For Screening',
                              notes: 'Requirements incomplete, returned to screening',
                            })
                          });
                        } catch {}
                        try { window.dispatchEvent(new CustomEvent('assessment-history-updated')); } catch {}
                        
                        // Remove from Assessment table immediately
                        onRemoveApplicant?.(selectedUser.id);
                        setActiveSection('screening'); // Go back to screening
                      } else if (currentStatus === 'Initial Interview') {
                        // Initial Interview automatically proceeds to assessment
                        onStatusChange?.(selectedUser.id, 'For Final Interview/For Assessment' as any);
                        await updateStatusInGoogleSheet(selectedUser, 'For Final Interview/For Assessment' as any);
                        
                        // Log the progression
                        try {
                          await fetch('/api/applicants/assessment-history', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              applicant_no: selectedUser.no,
                              action: 'Initial Interview Complete - Proceeded to Assessment',
                              status: 'For Final Interview/For Assessment',
                              notes: 'Initial interview completed, proceeding to assessment',
                            })
                          });
                        } catch {}
                        try { window.dispatchEvent(new CustomEvent('assessment-history-updated')); } catch {}
                        
                        // Don't remove from Assessment table - just change status and stay
                        // The applicant will remain visible in assessment with new status
                      } else if (currentStatus === 'Completion') {
                        // Don't auto-proceed for Completion
                        alert(`Status "${currentStatus}" requires manual progression. Please change the status to proceed.`);
                        return;
                      } else {
                        // Default assessment progression for other statuses
                      if (selectedUser.status !== 'For Completion') {
                        onStatusChange?.(selectedUser.id, 'For Completion' as any);
                        updateStatusInGoogleSheet(selectedUser, 'For Completion' as any);
                      }
                      // Log the progression
                      try {
                        await fetch('/api/applicants/assessment-history', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            applicant_no: selectedUser.no,
                            action: 'Proceeded to Selection',
                            status: 'For Completion',
                            notes: '',
                          })
                        });
                      } catch {}
                      // Remove from Assessment table immediately
                      onRemoveApplicant?.(selectedUser.id);
                        setActiveSection('selection');
                      }
                    }
                  } else if (activeSection === 'selection') {
                    // Handle Selection workflow based on current status
                    if (selectedUser) {
                      const currentStatus = selectedUser.status || '';
                      
                      if (currentStatus === 'For Completion') {
                        // For Completion -> For Medical
                        onStatusChange?.(selectedUser.id, 'For Medical' as any);
                        await updateStatusInGoogleSheet(selectedUser, 'For Medical' as any);
                        
                        // Log the progression
                        try {
                          await fetch('/api/applicants/screening-history', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              applicant_no: selectedUser.no,
                              action: 'Proceeded to Medical',
                              status: 'For Medical',
                              notes: 'Moved to medical stage',
                            })
                          });
                        } catch {}
                        
                        // Remove from Selection table immediately
                        onRemoveApplicant?.(selectedUser.id);
                        setActiveSection('engagement'); // Go to engagement section
                      } else if (currentStatus === 'For Medical') {
                        // For Medical -> For SBMA Gate Pass
                        onStatusChange?.(selectedUser.id, 'For SBMA Gate Pass' as any);
                        await updateStatusInGoogleSheet(selectedUser, 'For SBMA Gate Pass' as any);
                        
                        // Log the progression
                        try {
                          await fetch('/api/applicants/screening-history', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              applicant_no: selectedUser.no,
                              action: 'Medical Complete - Proceeded to SBMA Gate Pass',
                              status: 'For SBMA Gate Pass',
                              notes: 'Medical completed, proceeding to SBMA gate pass',
                            })
                          });
                        } catch {}
                        
                        // Don't remove from Selection table - just change status
                      } else if (currentStatus === 'For SBMA Gate Pass') {
                        // For SBMA Gate Pass -> For Deployment
                        onStatusChange?.(selectedUser.id, 'For Deployment' as any);
                        await updateStatusInGoogleSheet(selectedUser, 'For Deployment' as any);
                        
                        // Log the progression
                        try {
                          await fetch('/api/applicants/screening-history', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              applicant_no: selectedUser.no,
                              action: 'SBMA Gate Pass Complete - Proceeded to Deployment',
                              status: 'For Deployment',
                              notes: 'SBMA gate pass completed, proceeding to deployment',
                            })
                          });
                        } catch {}
                        
                        // Remove from Selection table immediately
                        onRemoveApplicant?.(selectedUser.id);
                        setActiveSection('engagement'); // Go to engagement section
                      } else {
                        // Default Selection progression
                      const engagementAllowed = new Set(['For Deployment', 'Deployed']);
                        const nextStatus = engagementAllowed.has(currentStatus) ? currentStatus : 'For Medical';
                        if (nextStatus !== currentStatus) {
                        onStatusChange?.(selectedUser.id, nextStatus as any);
                        updateStatusInGoogleSheet(selectedUser, nextStatus as any);
                      }
                      // Log the progression
                      try {
                        await fetch('/api/applicants/screening-history', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            applicant_no: selectedUser.no,
                            action: 'Proceeded to Engagement',
                            status: nextStatus,
                            notes: '',
                          })
                        });
                      } catch {}
                      // Remove from Selection table immediately
                      onRemoveApplicant?.(selectedUser.id);
                        setActiveSection('engagement');
                      }
                    }
                  } else if (activeSection === 'engagement') {
                    // Update status to move applicant to Recruitment Database
                    if (selectedUser) {
                      onStatusChange?.(selectedUser.id, 'Deployed' as any);
                      updateStatusInGoogleSheet(selectedUser, 'Deployed' as any);
                      // Log the progression
                      try {
                        await fetch('/api/applicants/screening-history', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            applicant_no: selectedUser.no,
                            action: 'Proceeded to Recruitment Database',
                            status: 'Deployed',
                            notes: '',
                          })
                        });
                      } catch {}
                      // Remove from Engagement table immediately
                      onRemoveApplicant?.(selectedUser.id);
                    }
                    setActiveSection('recruitment-database');
                  }
                }}
              >
                <IconClipboardCheck size={16} />
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicantSidebar;