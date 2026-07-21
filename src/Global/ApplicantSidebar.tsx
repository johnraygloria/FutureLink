import React, { useEffect, useState } from "react";
import type { User, ApplicationStatus, ScreeningStatus } from '../api/applicant';
import {
  IconArrowLeft,
  IconArrowBackUp,
  IconArrowDown,
  IconAlertTriangle,
  IconUser,
  IconClipboardCheck,
  IconPhone,
  IconEye,
  IconCalendarEvent,
  IconPencil,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import ConfirmDialog from "../components/ConfirmDialog";
import Assessment from "../pages/components/assessments/assessmentStatus";
import { useNavigation } from "./NavigationContext";
import { fetchPrincipals } from "../api/principal";
import { isAdmin } from "../lib/currentUser";
import { isScreeningStatus } from "../pages/components/Screening/utils/screeningUtils";
import { isAssessmentStatus } from "../pages/components/assessments/utils/assessmentUtils";
import { isSelectionStatus } from "../pages/components/Selection/utils/selectionUtils";
import { isEngagementStatus } from "../pages/components/Engagement/utils/engagementUtils";
import {
  panelClass,
  panelTitleClass,
  fieldLabelClass,
  fieldValueClass,
  inputClass,
  selectClass,
} from "../constants/applicantFormStyles";
import { DOCUMENT_NUMBER_FIELDS } from "../constants/documentChecklist";
import DocumentChecklistFields from "../components/DocumentChecklist/DocumentChecklistFields";

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
    'For Onboarding': <IconUser size={16} />,
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
    let principalIds: number[] = [];
    try {
      const userPrincipals = (user as any).principals || (user as any).clients || [];
      if (Array.isArray(userPrincipals) && userPrincipals.length > 0) {
        const allPrincipals = await fetchPrincipals();
        principalIds = allPrincipals
          .filter(principal => userPrincipals.includes(principal.name))
          .map(principal => principal.id);
      } else {
        const response = await fetch(`/api/applicants?NO=${encodeURIComponent(user.no || '')}`);
        if (response.ok) {
          const applicants = await response.json();
          const applicant = applicants.find((a: any) => a.applicant_no === user.no);
          const applicantPrincipals = applicant?.principals || applicant?.clients || [];
          if (Array.isArray(applicantPrincipals) && applicantPrincipals.length > 0) {
            const allPrincipals = await fetchPrincipals();
            principalIds = allPrincipals
              .filter(principal => applicantPrincipals.includes(principal.name))
              .map(principal => principal.id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch principals for status update:', error);
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
      EMAIL: user.email,
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

    payloadBody.PRINCIPAL_IDS = principalIds;

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
    let principalIds: number[] = [];
    try {
      const userPrincipals = (user as any).principals || (user as any).clients || [];
      if (Array.isArray(userPrincipals) && userPrincipals.length > 0) {
        const allPrincipals = await fetchPrincipals();
        principalIds = allPrincipals
          .filter(principal => userPrincipals.includes(principal.name))
          .map(principal => principal.id);
      } else {
        const response = await fetch(`/api/applicants?NO=${encodeURIComponent(user.no || '')}`);
        if (response.ok) {
          const applicants = await response.json();
          const applicant = applicants.find((a: any) => a.applicant_no === user.no);
          const applicantPrincipals = applicant?.principals || applicant?.clients || [];
          if (Array.isArray(applicantPrincipals) && applicantPrincipals.length > 0) {
            const allPrincipals = await fetchPrincipals();
            principalIds = allPrincipals
              .filter(principal => applicantPrincipals.includes(principal.name))
              .map(principal => principal.id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch principals for update:', error);
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
      EMAIL: user.email,
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
      PRINCIPAL_IDS: principalIds
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
  const numberPayloadMap: Record<string, string> = {
    nbiClearanceNo: 'NBI_CLEARANCE_NO',
    sssNo: 'SSS_NO',
    pagibigNo: 'PAGIBIG_NO',
    philhealthNo: 'PHILHEALTH_NO',
    tinNo: 'TIN_NO',
  };
  const payloadKey = map[key];
  if (!payloadKey) return;
  const payload: Record<string, string> = { NO: user.no || '', [payloadKey]: checked ? '1' : '0' };
  if (!checked) {
    const numberConfig = DOCUMENT_NUMBER_FIELDS[key];
    if (numberConfig) {
      payload[numberPayloadMap[numberConfig.numberKey]] = '';
    }
  }
  try {
    const res = await fetch('/api/applicants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update document flag');
    const broadcastDetail: Record<string, unknown> = { no: user.no, [key]: checked };
    if (!checked) {
      const numberConfig = DOCUMENT_NUMBER_FIELDS[key];
      if (numberConfig) broadcastDetail[numberConfig.numberKey] = '';
    }
    // Broadcast change
    try {
      window.dispatchEvent(new CustomEvent('applicant-updated', { detail: broadcastDetail }));
    } catch { }
  } catch (e) {
    console.error('Failed to sync document flag', key, e);
  }
};

const updateDocumentNumber = async (user: User, numberKey: string, value: string) => {
  const numberPayloadMap: Record<string, string> = {
    nbiClearanceNo: 'NBI_CLEARANCE_NO',
    sssNo: 'SSS_NO',
    pagibigNo: 'PAGIBIG_NO',
    philhealthNo: 'PHILHEALTH_NO',
    tinNo: 'TIN_NO',
  };
  const payloadKey = numberPayloadMap[numberKey];
  if (!payloadKey) return;
  try {
    const res = await fetch('/api/applicants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ NO: user.no || '', [payloadKey]: value })
    });
    if (!res.ok) throw new Error('Failed to update document number');
    try {
      window.dispatchEvent(new CustomEvent('applicant-updated', {
        detail: { no: user.no, [numberKey]: value }
      }));
    } catch { }
  } catch (e) {
    console.error('Failed to sync document number', numberKey, e);
  }
};

// Persist a single free-form status field (e.g. physical screening / medical status).
// Sends only { NO, <PAYLOAD_KEY> } so the upsert preserves all other columns.
const updateApplicantField = async (user: User, payloadKey: string, detailKey: string, value: string) => {
  try {
    const res = await fetch('/api/applicants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ NO: user.no || '', [payloadKey]: value })
    });
    if (!res.ok) throw new Error('Failed to update applicant field');
    try {
      window.dispatchEvent(new CustomEvent('applicant-updated', {
        detail: { no: user.no, [detailKey]: value }
      }));
    } catch { }
  } catch (e) {
    console.error('Failed to sync applicant field', payloadKey, e);
  }
};

// Maps a status to the pipeline section whose ALLOWED set contains it.
const sectionForStatus = (status: string): 'screening' | 'assessment' | 'selection' | 'engagement' | null => {
  if (isScreeningStatus(status)) return 'screening';
  if (isAssessmentStatus(status)) return 'assessment';
  if (isSelectionStatus(status)) return 'selection';
  if (isEngagementStatus(status)) return 'engagement';
  return null;
};

// Fallback when no exact previous status was captured (e.g. bulk-imported
// applicants, or a move made before previous_status tracking existed): send the
// applicant back to the entry status of the previous pipeline stage.
const PREVIOUS_STAGE_ENTRY: Record<string, string> = {
  assessment: 'For Screening',
  selection: 'Initial Interview',
  engagement: 'For Medical',
};
const stageFallbackTarget = (currentStatus: string): string | null => {
  const section = sectionForStatus(currentStatus);
  if (!section) return null;
  return PREVIOUS_STAGE_ENTRY[section] || null;
};

// Reconstructs the applicant's undo stack by replaying its status-change log in
// chronological order — 'Status Updated' = a forward move (push the status being
// left), 'Rollback' = an undo (pop). The top of the resulting stack is the next
// status to roll back to, so repeated rollbacks walk back through the COMPLETE
// recorded history one step at a time (and it stays correct even if forward moves
// and rollbacks are interleaved). Returns null once the recorded trail is exhausted
// (caller then uses the stage fallback for the pre-history / cross-stage origin).
const computeRollbackTarget = (rows: any[], applicantNo: string): string | null => {
  const events = (Array.isArray(rows) ? rows : [])
    .filter((r) => r.applicant_no === applicantNo && (r.action === 'Status Updated' || r.action === 'Rollback'))
    .sort((a, b) => {
      const ta = new Date(a.created_at).getTime();
      const tb = new Date(b.created_at).getTime();
      if (ta !== tb) return ta - tb;
      return (Number(a.id) || 0) - (Number(b.id) || 0);
    });
  let current: string | null = null;
  const stack: string[] = [];
  for (const e of events) {
    if (e.action === 'Rollback') {
      if (stack.length > 0) current = stack.pop() as string;
    } else {
      const to = String(e.status || '');
      if (!to) continue;
      if (current !== null && current !== to) stack.push(current);
      current = to;
    }
  }
  return stack.length > 0 ? stack[stack.length - 1] : null;
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
  const [documentNumbers, setDocumentNumbers] = useState<Record<string, string>>({});
  // Stage-specific status fields relocated out of the Assessment form:
  // Physical Screening Status is edited in Screening, Medical Status in Selection.
  const [stageStatusFields, setStageStatusFields] = useState<{ physicalScreeningStatus: string; medicalStatus: string }>({
    physicalScreeningStatus: '',
    medicalStatus: '',
  });
  const { activeSection, setActiveSection, setCurrentApplicantNo } = useNavigation();
  const isOpen = !!selectedUser;

  // Rollback confirmation modal state
  const [rollbackPrompt, setRollbackPrompt] = useState<
    { currentStatus: string; target: string; usedFallback: boolean; atEarliest?: boolean } | null
  >(null);
  const [rollbackBusy, setRollbackBusy] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setEditedUser(selectedUser);
      setIsEditing(false);
      setDocumentNumbers({
        nbiClearanceNo: selectedUser.nbiClearanceNo || '',
        sssNo: selectedUser.sssNo || '',
        pagibigNo: selectedUser.pagibigNo || '',
        philhealthNo: selectedUser.philhealthNo || '',
        tinNo: selectedUser.tinNo || '',
      });
      setStageStatusFields({
        physicalScreeningStatus: (selectedUser as any).physicalScreeningStatus || '',
        medicalStatus: (selectedUser as any).medicalStatus || '',
      });
    }
  }, [selectedUser?.id, selectedUser?.nbiClearanceNo, selectedUser?.sssNo, selectedUser?.pagibigNo, selectedUser?.philhealthNo, selectedUser?.tinNo]);

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

  const admin = isAdmin();

  // Admin-only: resolve where a rollback would send the applicant, then open the
  // confirmation modal. Prefers walking back through the recorded status history
  // (multi-step undo); once that trail is exhausted it falls back to the previous
  // pipeline stage's entry. The actual change happens in confirmRollback.
  const requestRollback = async () => {
    if (!selectedUser) return;
    const currentStatus = selectedUser.status || '';
    let target: string | null = null;
    try {
      const res = await fetch('/api/applicants/screening-history');
      if (res.ok) {
        const rows = await res.json();
        target = computeRollbackTarget(rows, selectedUser.no || '');
      }
    } catch { }

    let usedFallback = false;
    if (!target) {
      target = stageFallbackTarget(currentStatus);
      usedFallback = true;
    }
    if (!target) {
      setRollbackPrompt({ currentStatus, target: '', usedFallback: false, atEarliest: true });
      return;
    }
    setRollbackPrompt({ currentStatus, target, usedFallback });
  };

  const confirmRollback = async () => {
    if (!selectedUser || !rollbackPrompt || rollbackPrompt.atEarliest) {
      setRollbackPrompt(null);
      return;
    }
    const { currentStatus, target } = rollbackPrompt;
    setRollbackBusy(true);
    try {
      // Log the rollback for the audit trail.
      try {
        await fetch('/api/applicants/screening-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            applicant_no: selectedUser.no,
            action: 'Rollback',
            status: target,
            notes: `Rolled back from ${currentStatus} to ${target} by Admin`,
          }),
        });
      } catch { }

      // Persist the status change (keeps other fields via IFNULL) and move the applicant.
      if (onStatusChange) {
        onStatusChange(selectedUser.id, target as ApplicationStatus);
      } else {
        await fetch('/api/applicants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ NO: selectedUser.no, STATUS: target }),
        });
        try {
          window.dispatchEvent(new CustomEvent('applicant-updated', { detail: { no: selectedUser.no, status: target } }));
        } catch { }
      }

      // Follow the applicant to whichever stage now owns it.
      const targetSection = sectionForStatus(target);
      if (targetSection && targetSection !== activeSection) {
        try {
          setCurrentApplicantNo(selectedUser.no);
          setActiveSection(targetSection);
        } catch { }
      }
    } catch (e) {
      console.error('Rollback failed:', e);
    } finally {
      setRollbackBusy(false);
      setRollbackPrompt(null);
    }
  };

  const getAvatar = (user?: User | null) => {
    const name = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.facebook : '';
    if (!name) {
      return (
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/90 to-primary-dark flex items-center justify-center shadow-lg ring-1 ring-white/10">
          <span className="text-white font-bold text-sm">?</span>
        </div>
      );
    }
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    const initials = `${first}${last}`.toUpperCase();
    return (
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/90 to-primary-dark flex items-center justify-center shadow-lg ring-1 ring-white/10">
        <span className="text-white font-bold text-sm">{initials}</span>
      </div>
    );
  };

  const getDisplayName = (user?: User | null) => {
    if (!user) return 'Applicant';
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    return fullName || user.facebook || 'Applicant';
  };

  const getStatusBadgeClass = (status: string) => {
    if (status.includes('Rejected') || status.includes('Failed')) return 'bg-danger/10 text-danger border-danger/20';
    if (status.includes('Deployed') || status.includes('Hired') || status.includes('Complete')) return 'bg-success/10 text-success border-success/20';
    if (status.includes('Pending') || status.includes('Incomplete')) return 'bg-warning/10 text-warning border-warning/20';
    if (status.includes('Medical') || status.includes('Interview') || status.includes('Screening')) return 'bg-info/10 text-info border-info/20';
    if (status.includes('Deployment') || status.includes('Biometrics') || status.includes('Gate Pass')) return 'bg-primary/10 text-primary-light border-primary/20';
    return 'bg-white/5 text-text-secondary border-white/10';
  };

  const getStatusBadge = (status: string) => (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusBadgeClass(status)}`}>
      {getStatusIcon(status)}
      {status}
    </span>
  );

  const documentFields = selectedUser ? [
    { key: 'recentPicture', label: 'Recent 2x2 picture', checked: !!selectedUser.recentPicture },
    { key: 'psaBirthCertificate', label: 'PSA Birth Certificate', checked: !!selectedUser.psaBirthCertificate },
    { key: 'schoolCredentials', label: 'School Credentials', checked: !!selectedUser.schoolCredentials },
    { key: 'nbiClearance', label: 'NBI Clearance', checked: !!selectedUser.nbiClearance },
    { key: 'policeClearance', label: 'Police Clearance', checked: !!selectedUser.policeClearance },
    { key: 'barangayClearance', label: 'Barangay Clearance', checked: !!selectedUser.barangayClearance },
    { key: 'sss', label: 'SSS No. / Static Info', checked: !!selectedUser.sss },
    { key: 'pagibig', label: 'Pag-IBIG #', checked: !!selectedUser.pagibig },
    { key: 'cedula', label: 'Cedula', checked: !!selectedUser.cedula },
    { key: 'vaccinationStatus', label: 'Vaccination Status', checked: !!selectedUser.vaccinationStatus },
    { key: 'resume', label: 'Resume', checked: !!(selectedUser as any).resume },
    { key: 'coe', label: 'COE', checked: !!(selectedUser as any).coe },
    { key: 'philhealth', label: 'PhilHealth', checked: !!(selectedUser as any).philhealth },
    { key: 'tinNumber', label: 'TIN Number', checked: !!(selectedUser as any).tinNumber },
  ] : [];

  const completedDocuments = documentFields.filter((doc) => doc.checked).length;
  const documentProgress = documentFields.length > 0 ? Math.round((completedDocuments / documentFields.length) * 100) : 0;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 z-30 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 h-full w-full z-50 flex flex-col transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ maxWidth: '820px' }}
      >
        <div className="bg-[#0b1018]/98 backdrop-blur-xl border-l border-white/10 shadow-[-20px_0_60px_rgba(0,0,0,0.45)] flex flex-col h-full relative overflow-hidden">

          <div className="h-[3px] bg-gradient-to-r from-primary via-primary-light to-info/80" />
          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-primary/40 via-white/5 to-transparent" />

          <div className="border-b border-white/10 flex-shrink-0 relative z-10 bg-gradient-to-r from-white/[0.05] via-transparent to-transparent">
            <div className="flex items-start justify-between gap-4 px-5 sm:px-6 py-5">
              <div className="flex items-start gap-4 min-w-0">
                <button
                  onClick={onClose}
                  className="mt-1 flex items-center justify-center h-10 w-10 text-text-secondary hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-95 border border-white/10"
                  title="Close sidebar"
                >
                  <IconArrowLeft size={20} />
                </button>
                <div className="flex items-start gap-4 min-w-0">
                  {selectedUser && getAvatar(selectedUser)}
                  <div className="min-w-0">
                    <h1 className="text-lg sm:text-xl text-white font-bold leading-tight tracking-tight truncate">
                      {getDisplayName(selectedUser)}
                    </h1>
                    <p className="text-sm text-primary-light/90 mt-1 font-semibold truncate">{selectedUser?.positionApplied || 'No position listed'}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/30 text-white/70 border border-white/10">
                        ID {selectedUser?.no || '-'}
                      </span>
                      {selectedUser?.dateApplied && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/30 text-white/70 border border-white/10">
                          Applied {selectedUser.dateApplied}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="shrink-0 pt-1">
                {getStatusBadge(selectedUser?.status || '')}
              </div>
            </div>

            <div className="px-5 sm:px-6 pb-4">
              <div className="inline-flex p-1 rounded-xl bg-black/30 border border-white/10">
              {(() => {
                const tabs = [
                  { id: 'overview', label: 'Details', icon: <IconUser size={16} /> },
                  { id: 'screening', label: 'Assessment', icon: <IconClipboardCheck size={16} /> },
                ];
                const showBothTabs = activeSection === 'assessment';
                const visibleTabs = showBothTabs
                  ? tabs
                  : tabs.filter(t => t.id === 'overview');
                return visibleTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`px-4 py-2 text-sm font-semibold transition-all relative flex items-center justify-center gap-2 rounded-lg ${activeTab === tab.id
                      ? 'text-white bg-primary/20 border border-primary/25 shadow-[0_0_20px_rgba(0,166,167,0.12)]'
                      : 'text-text-secondary hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    onClick={() => setActiveTab(tab.id as any)}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ));
              })()}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-[#0a0f16]/50 custom-scrollbar">
            <div className="p-5 sm:p-6 space-y-5">
              {activeTab === 'overview' && selectedUser && (
                <div className="space-y-5">
                  {selectedUser && (
                    <div className={`${panelClass} p-5 sm:p-6`}>
                      <h2 className={`${panelTitleClass} mb-3`}>Pipeline Status</h2>
                      <div className="relative">
                        <select
                          className={selectClass}
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
                              <option value="For Completion" className="bg-gray-800 text-white">For Completion</option>
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
                              {/* Push through to Engagement */}
                              <option value="For Onboarding" className="bg-gray-800 text-white">For Onboarding</option>
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
                      <p className="text-xs text-text-secondary/70 mt-3">
                        Update status to move this applicant through the hiring pipeline.
                      </p>
                      {admin && (
                        <button
                          type="button"
                          onClick={requestRollback}
                          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border border-warning/30 bg-warning/10 text-warning hover:bg-warning/20 transition-all active:scale-[0.99]"
                          title="Admin only: revert this applicant to its previous status"
                        >
                          <IconArrowBackUp size={16} />
                          Rollback to previous status
                        </button>
                      )}
                    </div>
                  )}

                  {activeSection === 'screening' && selectedUser && (
                    <div className={`${panelClass} p-5 sm:p-6`}>
                      <h2 className={`${panelTitleClass} mb-3`}>Physical Screening Status</h2>
                      <div className="relative">
                        <select
                          className={selectClass}
                          value={stageStatusFields.physicalScreeningStatus}
                          onChange={(e) => {
                            const value = e.target.value;
                            setStageStatusFields((prev) => ({ ...prev, physicalScreeningStatus: value }));
                            updateApplicantField(selectedUser, 'PHYSICAL_SCREENING_STATUS', 'physicalScreeningStatus', value);
                          }}
                        >
                          <option value="" className="bg-gray-800 text-white">— None —</option>
                          <option value="Passed" className="bg-gray-800 text-white">Passed</option>
                          <option value="Failed" className="bg-gray-800 text-white">Failed</option>
                          <option value="Pending" className="bg-gray-800 text-white">Pending</option>
                          <option value="Not Applicable" className="bg-gray-800 text-white">Not Applicable</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'selection' && selectedUser && (
                    <div className={`${panelClass} p-5 sm:p-6`}>
                      <h2 className={`${panelTitleClass} mb-3`}>Medical Status</h2>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Enter medical status"
                        value={stageStatusFields.medicalStatus}
                        onChange={(e) => setStageStatusFields((prev) => ({ ...prev, medicalStatus: e.target.value }))}
                        onBlur={(e) => updateApplicantField(selectedUser, 'MEDICAL_STATUS', 'medicalStatus', e.target.value)}
                      />
                    </div>
                  )}

                  <div className={`${panelClass} p-5 sm:p-6`}>
                    <div className="flex items-center justify-between mb-5">
                      <h2 className={panelTitleClass}>Personal Details</h2>
                      {activeSection === 'screening' && (
                        <div className="flex items-center gap-2">
                          {isEditing && (
                            <button
                              onClick={() => {
                                setIsEditing(false);
                                setEditedUser(selectedUser);
                              }}
                              className="text-text-secondary hover:text-white px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1 border border-white/10"
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
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${isEditing
                              ? 'bg-primary text-white border-primary/30 shadow-lg shadow-primary/20'
                              : 'text-primary-light bg-primary/10 hover:bg-primary/20 border-primary/20'
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-5 text-sm">
                      <div className="flex flex-col gap-1.5">
                        <span className={fieldLabelClass}>Applicant No.</span>
                        <span className={`${fieldValueClass} font-bold text-primary-light`}>
                          {selectedUser.no}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className={fieldLabelClass}>Referred By</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className={inputClass}
                            value={editedUser?.referredBy || ''}
                            onChange={(e) => handleInputChange('referredBy', e.target.value)}
                          />
                        ) : (
                          <span className={fieldValueClass}>{selectedUser.referredBy || '-'}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className={fieldLabelClass}>Last Name</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className={inputClass}
                            value={editedUser?.lastName || ''}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                          />
                        ) : (
                          <span className={`${fieldValueClass} font-semibold`}>{selectedUser.lastName || '-'}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className={fieldLabelClass}>First Name</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className={inputClass}
                            value={editedUser?.firstName || ''}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                          />
                        ) : (
                          <span className={`${fieldValueClass} font-semibold`}>{selectedUser.firstName || '-'}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className={fieldLabelClass}>Extension</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className={inputClass}
                            value={editedUser?.ext || ''}
                            onChange={(e) => handleInputChange('ext', e.target.value)}
                          />
                        ) : (
                          <span className={fieldValueClass}>{selectedUser.ext || '-'}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className={fieldLabelClass}>Middle Name</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className={inputClass}
                            value={editedUser?.middle || ''}
                            onChange={(e) => handleInputChange('middle', e.target.value)}
                          />
                        ) : (
                          <span className={fieldValueClass}>{selectedUser.middle || '-'}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className={fieldLabelClass}>Gender</span>
                        {isEditing ? (
                          <select
                            className={selectClass}
                            value={editedUser?.gender || ''}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                          >
                            <option value="" className="bg-gray-900">Select Gender</option>
                            <option value="Male" className="bg-gray-900">Male</option>
                            <option value="Female" className="bg-gray-900">Female</option>
                          </select>
                        ) : (
                          <span className={fieldValueClass}>{selectedUser.gender || '-'}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className={fieldLabelClass}>Size</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className={inputClass}
                            value={editedUser?.size || ''}
                            onChange={(e) => handleInputChange('size', e.target.value)}
                          />
                        ) : (
                          <span className={fieldValueClass}>{selectedUser.size || '-'}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className={fieldLabelClass}>Date of Birth</span>
                        {isEditing ? (
                          <input
                            type="date"
                            className={inputClass}
                            value={editedUser?.dateOfBirth || ''}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          />
                        ) : (
                          <span className={fieldValueClass}>{selectedUser.dateOfBirth || '-'}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className={fieldLabelClass}>Date Applied</span>
                        {isEditing ? (
                          <input
                            type="date"
                            className={inputClass}
                            value={editedUser?.dateApplied || ''}
                            onChange={(e) => handleInputChange('dateApplied', e.target.value)}
                          />
                        ) : (
                          <span className={fieldValueClass}>{selectedUser.dateApplied || '-'}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className={fieldLabelClass}>Facebook Name</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className={inputClass}
                            value={editedUser?.facebook || ''}
                            onChange={(e) => handleInputChange('facebook', e.target.value)}
                          />
                        ) : (
                          <span className={`${fieldValueClass} text-primary-light`}>{selectedUser.facebook || '-'}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className={fieldLabelClass}>Age</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className={inputClass}
                            value={editedUser?.age || ''}
                            onChange={(e) => handleInputChange('age', e.target.value)}
                          />
                        ) : (
                          <span className={fieldValueClass}>{selectedUser.age || '-'}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className={fieldLabelClass}>Location</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className={inputClass}
                            value={editedUser?.location || ''}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                          />
                        ) : (
                          <span className={fieldValueClass}>{selectedUser.location || '-'}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className={fieldLabelClass}>Contact Number</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className={inputClass}
                            value={editedUser?.contactNumber || ''}
                            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                          />
                        ) : (
                          <span className={`${fieldValueClass} font-mono`}>{selectedUser.contactNumber || '-'}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className={fieldLabelClass}>Email</span>
                        {isEditing ? (
                          <input
                            type="email"
                            className={inputClass}
                            value={editedUser?.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                          />
                        ) : (
                          <span className={fieldValueClass}>{selectedUser.email || '-'}</span>
                        )}
                      </div>
                      <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                        <span className={fieldLabelClass}>Position Applied For</span>
                        {isEditing ? (
                          <input
                            type="text"
                            className={`${inputClass} text-primary-light font-semibold`}
                            value={editedUser?.positionApplied || ''}
                            onChange={(e) => handleInputChange('positionApplied', e.target.value)}
                          />
                        ) : (
                          <span className="font-semibold text-primary-light bg-primary/10 py-2.5 px-3 rounded-xl border border-primary/20 w-full">{selectedUser.positionApplied || '-'}</span>
                        )}
                      </div>
                      <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                        <span className={fieldLabelClass}>Experience</span>
                        {isEditing ? (
                          <textarea
                            className={`${inputClass} min-h-[90px] resize-y`}
                            value={editedUser?.experience || ''}
                            onChange={(e) => handleInputChange('experience' as any, e.target.value)}
                          />
                        ) : (
                          <span className={`${fieldValueClass} leading-relaxed italic text-sm`}>{selectedUser.experience || 'No experience listed'}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`${panelClass} p-5 sm:p-6`}>
                    <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                      <h2 className={`${panelTitleClass} flex items-center gap-2`}>
                        <IconClipboardCheck size={16} className="text-primary-light" />
                        Document Checklist
                      </h2>
                      <span className="text-xs font-bold text-primary-light bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        {completedDocuments}/{documentFields.length} complete
                      </span>
                    </div>
                    <div className="mb-5">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-text-secondary/70 mb-2">
                        <span>Completion</span>
                        <span>{documentProgress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-black/30 border border-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500"
                          style={{ width: `${documentProgress}%` }}
                        />
                      </div>
                    </div>
                    <DocumentChecklistFields
                      variant="sidebar"
                      numberInputClassName={`${inputClass} text-xs py-1.5`}
                      values={{
                        recentPicture: selectedUser.recentPicture,
                        psaBirthCertificate: selectedUser.psaBirthCertificate,
                        schoolCredentials: selectedUser.schoolCredentials,
                        nbiClearance: selectedUser.nbiClearance,
                        policeClearance: selectedUser.policeClearance,
                        barangayClearance: selectedUser.barangayClearance,
                        sss: selectedUser.sss,
                        pagibig: selectedUser.pagibig,
                        cedula: selectedUser.cedula,
                        vaccinationStatus: selectedUser.vaccinationStatus,
                        resume: (selectedUser as any).resume,
                        coe: (selectedUser as any).coe,
                        philhealth: (selectedUser as any).philhealth,
                        tinNumber: (selectedUser as any).tinNumber,
                        nbiClearanceNo: documentNumbers.nbiClearanceNo,
                        sssNo: documentNumbers.sssNo,
                        pagibigNo: documentNumbers.pagibigNo,
                        philhealthNo: documentNumbers.philhealthNo,
                        tinNo: documentNumbers.tinNo,
                      }}
                      onCheckboxChange={(key, checked) => {
                        onScreeningUpdate?.(selectedUser.id, key as any, checked as any);
                        updateDocumentFlag(selectedUser, key, checked);
                        if (!checked) {
                          const numberConfig = DOCUMENT_NUMBER_FIELDS[key];
                          if (numberConfig) {
                            setDocumentNumbers((prev) => ({ ...prev, [numberConfig.numberKey]: '' }));
                            onScreeningUpdate?.(selectedUser.id, numberConfig.numberKey as any, '' as any);
                          }
                        }
                      }}
                      onNumberChange={(numberKey, value) => {
                        setDocumentNumbers((prev) => ({ ...prev, [numberKey]: value }));
                        onScreeningUpdate?.(selectedUser.id, numberKey as any, value as any);
                      }}
                      onNumberBlur={(numberKey, value) => updateDocumentNumber(selectedUser, numberKey, value)}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'screening' && selectedUser && (
                <div className={`${panelClass} p-5 sm:p-6`}>
                  <Assessment applicantNo={selectedUser.no} showApplicantHeader={false} />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <ConfirmDialog
        isOpen={!!rollbackPrompt}
        title={rollbackPrompt?.atEarliest ? 'Nothing to roll back' : 'Roll back applicant'}
        subtitle={rollbackPrompt?.atEarliest ? undefined : (selectedUser ? getDisplayName(selectedUser) : undefined)}
        icon={<IconArrowBackUp size={20} />}
        tone={rollbackPrompt?.atEarliest ? 'primary' : 'warning'}
        confirmLabel={rollbackPrompt?.atEarliest ? 'Got it' : 'Roll back'}
        hideCancel={!!rollbackPrompt?.atEarliest}
        isBusy={rollbackBusy}
        onConfirm={confirmRollback}
        onCancel={() => { if (!rollbackBusy) setRollbackPrompt(null); }}
      >
        {rollbackPrompt?.atEarliest ? (
          <p className="text-sm text-text-secondary leading-relaxed">
            This applicant is already at the earliest stage of the pipeline, so there's no previous status to return to.
          </p>
        ) : rollbackPrompt ? (
          <div className="space-y-3">
            <div className={`${panelClass} p-4 space-y-3`}>
              <div>
                <p className={`${fieldLabelClass} mb-1.5`}>Current status</p>
                {getStatusBadge(rollbackPrompt.currentStatus)}
              </div>
              <div className="flex items-center gap-2 text-text-secondary/60 pl-0.5">
                <IconArrowDown size={16} />
                <span className="text-[11px] uppercase tracking-[0.14em] font-bold">rolls back to</span>
              </div>
              <div>
                <p className={`${fieldLabelClass} mb-1.5`}>New status</p>
                {getStatusBadge(rollbackPrompt.target)}
              </div>
            </div>

            {rollbackPrompt.usedFallback && (
              <div className="flex items-start gap-2.5 rounded-xl border border-warning/25 bg-warning/10 px-3.5 py-3">
                <IconAlertTriangle size={16} className="text-warning flex-shrink-0 mt-0.5" />
                <p className="text-xs text-warning/90 leading-relaxed">
                  No exact prior status was recorded for this applicant, so this returns them to the <span className="font-semibold">start of the previous stage</span>.
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-text-secondary pl-0.5">
              <IconCheck size={14} className="text-success flex-shrink-0" />
              Only the status changes — all field edits are kept.
            </div>
          </div>
        ) : null}
      </ConfirmDialog>
    </>
  );
};

export default ApplicantSidebar;
