import type { User } from "../../../../api/applicant";

export const ALLOWED_ENGAGEMENT_STATUSES = new Set([
  'On Boarding',
  'Metrex',
  'For Deployment',
]);

export const isEngagementStatus = (status?: string) => ALLOWED_ENGAGEMENT_STATUSES.has(status || '');

export const mapEngagementApplicantRow = (r: any): User => ({
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
  // Clients from backend (array of names)
  ...(r.clients ? { clients: r.clients } : {}),
  status: r.status || '',
  requirementsStatus: r.requirements_status || '',
  finalInterviewStatus: r.final_interview_status || '',
  medicalStatus: r.medical_status || '',
  statusRemarks: r.status_remarks || '',
  applicantRemarks: r.applicant_remarks || '',
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
  resume: Boolean(r.resume),
  coe: Boolean(r.coe),
  philhealth: Boolean(r.philhealth),
  tinNumber: Boolean(r.tin_number),
});

export const getUserInitials = (user: Pick<User, 'firstName' | 'lastName'>) => {
  const composite = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  const parts = composite.split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return '?';
  return parts.map(p => p[0]).join('').toUpperCase();
};

export const formatAppliedDate = (value?: string) => {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
};

export const ADDITIONAL_ENGAGEMENT_COLUMNS = [
  "NO",
  "REFFERED BY",
  "EXT",
  "MIDDLE",
  "GENDER",
  "SIZE",
  "DATE OF BIRTH",
  "FB NAME",
  "AGE",
  "LOCATION",
  "CONTACT NUMBER",
  "EXPERIENCE",
  "CLIENTS",
  "REQUIREMENTS STATUS",
  "FINAL INTERVIEW STATUS",
  "MEDICAL STATUS",
  "STATUS REMARKS",
  "APPLICANT REMARKS"
] as const;

export const mapUserToDisplayFormat = (user: User): Record<string, any> => {
  // Get clients from the user object (from backend row.clients array)
  const clients = (user as any).clients || [];
  const clientsDisplay = Array.isArray(clients) ? clients.join(', ') : '';
  
  return {
    "NO": user.no || '',
    "REFFERED BY": user.referredBy || '',
    "LAST NAME": user.lastName || '',
    "FIRST NAME": user.firstName || '',
    "EXT": user.ext || '',
    "MIDDLE": user.middle || '',
    "GENDER": user.gender || '',
    "SIZE": user.size || '',
    "DATE OF BIRTH": user.dateOfBirth || '',
    "DATE APPLIED": user.dateApplied || '',
    "FB NAME": user.facebook || '',
    "AGE": user.age || '',
    "LOCATION": user.location || '',
    "CONTACT NUMBER": user.contactNumber || '',
    "POSITION APPLIED FOR": user.positionApplied || '',
    "EXPERIENCE": user.experience || '',
    "CLIENTS": clientsDisplay,
    "STATUS": user.status || '',
    "REQUIREMENTS STATUS": user.requirementsStatus || '',
    "FINAL INTERVIEW STATUS": user.finalInterviewStatus || '',
    "MEDICAL STATUS": user.medicalStatus || '',
    "STATUS REMARKS": user.statusRemarks || '',
    "APPLICANT REMARKS": user.applicantRemarks || '',
  };
};


