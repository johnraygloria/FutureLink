import React, { useState } from "react";
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
    await fetch('/api/applicants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
        DATIAN: (user as any).datian,
        HOKEI: (user as any).hokei,
        POBC: (user as any).pobc,
        JINBOWAY: (user as any).jinboway,
        SURPRISE: (user as any).surprise,
        THALESTE: (user as any).thaleste,
        AOLLY: (user as any).aolly,
        ENJOY: (user as any).enjoy,
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
      })
    });
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
        <div className="h-12 w-12 rounded-full border-4 border-custom-teal bg-custom-teal flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">?</span>
        </div>
      );
    }
    const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase();
    return (
      <div className="h-12 w-12 rounded-full border-4 border-custom-teal bg-custom-teal flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-xl">{initials}</span>
      </div>
    );
  };

  const getStatusBadge = (status: string) => (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border border-custom-teal text-custom-teal bg-custom-teal/10 shadow-sm">
      {getStatusIcon(status)}
      {status}
    </span>
  );

  return (
    <>
      <div 
        className={`fixed inset-0 bg-opacity-20 backdrop-blur-[1px] transition-opacity duration-300 z-30 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-2xl z-40 flex flex-col transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ maxWidth: '48vw' }}
      >
        <div className="bg-white border-l border-gray-200 shadow-2xl flex flex-col h-full relative">

          <div className="absolute left-0 top-0 h-full w-2 bg-custom-teal rounded-l-xl" />

          <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0 relative z-10">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 text-custom-teal hover:bg-custom-teal/10 hover:text-white rounded-lg px-3 py-2 transition-all duration-200"
                  title="Close sidebar"
                >
                  <IconArrowLeft size={20} />
                </button>
                <div className="h-6 w-px bg-gray-300" />
                <div className="flex items-center gap-3">
                  {selectedUser && getAvatar(selectedUser?.facebook)}
                  <div>
                    <h1 className="text-xl text-custom-teal font-bold leading-tight">{selectedUser?.facebook}</h1>
                    <p className=" text-sm font-medium">{selectedUser?.positionApplied}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedUser?.status || '')}
              </div>
            </div>
            <div className="flex border-b border-gray-200 bg-gray-50 relative">
              {[
                { id: 'overview', label: 'Screening', icon: <IconUser size={16} /> },
                { id: 'screening', label: 'Assessment', icon: <IconClipboardCheck size={16} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 relative flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-custom-teal bg-white font-bold'
                      : 'text-gray-500 hover:text-custom-teal hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  {tab.icon}
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-8 h-1 bg-custom-teal rounded-t-full transition-all duration-300" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6 space-y-6">
              {activeTab === 'overview' && selectedUser && (
                <div className="space-y-6">
                            {selectedUser && (
                    <div className="bg-white rounded-2xl p-4 border border-custom-teal/20 shadow-sm mb-4">
                      <h2 className="text-base font-semibold text-custom-teal mb-2">Status</h2>
                      <select
                        className={`w-full border border-custom-teal rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-custom-teal ${activeSection === 'screening' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        value={selectedUser.status || ''}
                        onChange={e => handleStatusChange(e.target.value as ApplicationStatus)}
                        disabled={activeSection === 'screening'}
                      >
                        <option value="For Screening">For Screening</option>
                        <option value="For Final Interview/For Assessment">For Final Interview/For Assessment</option>
                        <option value="For Completion">For Completion</option>
                        <option value="For Medical">For Medical</option>
                        <option value="For SBMA Gate Pass">For SBMA Gate Pass</option>
                        <option value="For Deployment">For Deployment</option>
                        <option value="Deployed">Deployed</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {activeSection === 'screening' ? 'Status is automatic during Screening.' : "Change the applicant's status."}
                      </p>
                    </div>
                  )}
                  <div className="bg-white rounded-2xl p-6 border border-custom-teal/20 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-semibold text-custom-teal">Personal Details</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><span className="font-semibold">Applicant No.:</span> {selectedUser.no}</div>
                      <div><span className="font-semibold">Referred By:</span> {selectedUser.referredBy}</div>
                      <div><span className="font-semibold">Last Name:</span> {selectedUser.lastName}</div>
                      <div><span className="font-semibold">First Name:</span> {selectedUser.firstName}</div>
                      <div><span className="font-semibold">Extension:</span> {selectedUser.ext}</div>
                      <div><span className="font-semibold">Middle Name:</span> {selectedUser.middle}</div>
                      <div><span className="font-semibold">Gender:</span> {selectedUser.gender}</div>
                      <div><span className="font-semibold">Size:</span> {selectedUser.size}</div>
                      <div><span className="font-semibold">Date of Birth:</span> {selectedUser.dateOfBirth}</div>
                      <div><span className="font-semibold">Date Applied:</span> {selectedUser.dateApplied}</div>
                      <div><span className="font-semibold">Facebook Name:</span> {selectedUser.facebook}</div>
                      <div><span className="font-semibold">Age:</span> {selectedUser.age}</div>
                      <div><span className="font-semibold">Location:</span> {selectedUser.location}</div>
                      <div><span className="font-semibold">Contact Number:</span> {selectedUser.contactNumber}</div>
                      <div><span className="font-semibold">Position Applied For:</span> {selectedUser.positionApplied}</div>
                      <div className="md:col-span-2"><span className="font-semibold">Experience:</span> {selectedUser.experience}</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-custom-teal/20 shadow-sm">
                    <h2 className="text-base font-semibold text-custom-teal mb-3">Document Checklist</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!selectedUser.recentPicture}
                          onChange={(e) => {
                            onScreeningUpdate?.(selectedUser.id, 'recentPicture' as any, e.target.checked as any);
                            updateDocumentFlag(selectedUser, 'recentPicture', e.target.checked);
                          }}
                        />
                        Recent 2x2 picture
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selectedUser.psaBirthCertificate}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'psaBirthCertificate' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'psaBirthCertificate', e.target.checked); }}
                        />
                        PSA Birth Certificate
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selectedUser.schoolCredentials}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'schoolCredentials' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'schoolCredentials', e.target.checked); }}
                        />
                        School Credentials/Certificate
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selectedUser.nbiClearance}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'nbiClearance' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'nbiClearance', e.target.checked); }}
                        />
                        NBI Clearance
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selectedUser.policeClearance}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'policeClearance' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'policeClearance', e.target.checked); }}
                        />
                        Police Clearance
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selectedUser.barangayClearance}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'barangayClearance' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'barangayClearance', e.target.checked); }}
                        />
                        Barangay Clearance
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selectedUser.sss}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'sss' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'sss', e.target.checked); }}
                        />
                        SSS No. / E1 Form / Static Information
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selectedUser.pagibig}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'pagibig' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'pagibig', e.target.checked); }}
                        />
                        Pag-IBIG #
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selectedUser.cedula}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'cedula' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'cedula', e.target.checked); }}
                        />
                        Cedula
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selectedUser.vaccinationStatus}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'vaccinationStatus' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'vaccinationStatus', e.target.checked); }}
                        />
                        Vaccination Status
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!(selectedUser as any).resume}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'resume' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'resume', e.target.checked); }}
                        />
                        Resume
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!(selectedUser as any).coe}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'coe' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'coe', e.target.checked); }}
                        />
                        Certificate of Employment (COE)
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!(selectedUser as any).philhealth}
                          onChange={(e) => { onScreeningUpdate?.(selectedUser.id, 'philhealth' as any, e.target.checked as any); updateDocumentFlag(selectedUser, 'philhealth', e.target.checked); }}
                        />
                        PhilHealth
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!(selectedUser as any).tinNumber}
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
          <div className="bg-white border-t border-custom-teal/20 p-4 shadow-sm flex-shrink-0">
            <div className="flex gap-2">
              <button
                className="cursor-pointer flex-1 bg-custom-teal hover:bg-custom-teal/90 text-white font-semibold py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm flex items-center justify-center gap-2"
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
                    // Update status to move applicant to Selection stage
                    if (selectedUser) {
                      // Only update status if it's not already "For Completion"
                      if (selectedUser.status !== 'For Completion') {
                        onStatusChange?.(selectedUser.id, 'For Completion' as any);
                        updateStatusInGoogleSheet(selectedUser, 'For Completion' as any);
                      }
                      // Log the progression
                      try {
                        await fetch('/api/applicants/screening-history', {
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
                    }
                    setActiveSection('selection');
                  } else if (activeSection === 'selection') {
                    // Update status to move applicant to Engagement stage
                    if (selectedUser) {
                      onStatusChange?.(selectedUser.id, 'For Medical' as any);
                      updateStatusInGoogleSheet(selectedUser, 'For Medical' as any);
                      // Log the progression
                      try {
                        await fetch('/api/applicants/screening-history', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            applicant_no: selectedUser.no,
                            action: 'Proceeded to Engagement',
                            status: 'For Medical',
                            notes: '',
                          })
                        });
                      } catch {}
                      // Remove from Selection table immediately
                      onRemoveApplicant?.(selectedUser.id);
                    }
                    setActiveSection('engagement');
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