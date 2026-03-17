import type { User } from "../../../../api/applicant";

export const ALLOWED_SCREENING_STATUSES = new Set([
  'For Screening',
  'Doc Screening',
  'Physical Screening',
]);

export const isScreeningStatus = (status?: string) => ALLOWED_SCREENING_STATUSES.has(status || '');

export const mapScreeningApplicantRow = (r: any): User => ({
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
  recentPicture: r.recent_picture === '1' || r.recent_picture === 1,
  psaBirthCertificate: r.psa_birth_certificate === '1' || r.psa_birth_certificate === 1,
  schoolCredentials: r.school_credentials === '1' || r.school_credentials === 1,
  nbiClearance: r.nbi_clearance === '1' || r.nbi_clearance === 1,
  policeClearance: r.police_clearance === '1' || r.police_clearance === 1,
  barangayClearance: r.barangay_clearance === '1' || r.barangay_clearance === 1,
  sss: r.sss === '1' || r.sss === 1,
  pagibig: r.pagibig === '1' || r.pagibig === 1,
  cedula: r.cedula === '1' || r.cedula === 1,
  vaccinationStatus: r.vaccination_status === '1' || r.vaccination_status === 1,
  resume: r.resume === '1' || r.resume === 1,
  coe: r.coe === '1' || r.coe === 1,
  philhealth: r.philhealth === '1' || r.philhealth === 1,
  tinNumber: r.tin_number === '1' || r.tin_number === 1,
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

export const ADDITIONAL_SCREENING_COLUMNS = [
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
