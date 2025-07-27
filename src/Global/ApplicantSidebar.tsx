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

interface ApplicantSidebarProps {
  selectedUser: User | null;
  onClose: () => void;
  onStatusChange?: (userId: number, newStatus: ApplicationStatus) => void;
  onOpenScreening?: (user: User) => void;
  onScreeningUpdate?: (userId: number, key: keyof User, status: ScreeningStatus) => void;
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
    await fetch(`https://script.google.com/macros/s/AKfycbyQ96zMGVDFv1SfRQ4r5ooun4iOGZTNJHOuP_KWI39zBp14GmUmdyfy4K0g4IRf2J6A/exec?id=${user.id}&status=${encodeURIComponent(newStatus)}`);
  } catch (error) {
    console.error('Failed to update status in Google Sheet:', error);
  }
};

const ApplicantSidebar: React.FC<ApplicantSidebarProps> = ({ 
  selectedUser, 
  onClose, 
  onStatusChange,
  // onOpenScreening,
  // onScreeningUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'screening'>('overview');
  const isOpen = !!selectedUser;

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    if (selectedUser) {
      onStatusChange?.(selectedUser.id, newStatus);
      updateStatusInGoogleSheet(selectedUser, newStatus);
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
                        className="w-full border border-custom-teal rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-custom-teal"
                        value={selectedUser.status || ''}
                        onChange={e => handleStatusChange(e.target.value as ApplicationStatus)}
                      >
                        <option value="">Select status</option>
                        <option value="For Screening">For Screening</option>
                        <option value="For Final Interview/For Assessment">For Final Interview/For Assessment</option>
                        <option value="For Completion">For Completion</option>
                        <option value="For Medical">For Medical</option>
                        <option value="For SBMA Gate Pass">For SBMA Gate Pass</option>
                        <option value="For Deployment">For Deployment</option>
                        <option value="Deployed">Deployed</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Change the applicant's status.</p>
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
                        <input type="checkbox" checked={!!selectedUser.recentPicture} readOnly />
                        Recent 2x2 picture
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selectedUser.psaBirthCertificate} readOnly />
                        PSA Birth Certificate
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selectedUser.schoolCredentials} readOnly />
                        School Credentials/Certificate
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selectedUser.nbiClearance} readOnly />
                        NBI Clearance
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selectedUser.policeClearance} readOnly />
                        Police Clearance
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selectedUser.barangayClearance} readOnly />
                        Barangay Clearance
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selectedUser.sss} readOnly />
                        SSS No. / E1 Form / Static Information
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selectedUser.pagibig} readOnly />
                        Pag-IBIG #
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selectedUser.cedula} readOnly />
                        Cedula
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selectedUser.vaccinationStatus} readOnly />
                        Vaccination Status
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'screening' && selectedUser && (
                <Assessment applicantNo={selectedUser.no} />
              )}
            </div>
          </div>
          <div className="bg-white border-t border-custom-teal/20 p-4 shadow-sm flex-shrink-0">
            <div className="flex gap-2">
              <button className="cursor-pointer flex-1 bg-custom-teal hover:bg-custom-teal/90 text-white font-semibold py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm flex items-center justify-center gap-2">
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