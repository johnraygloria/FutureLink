import type { User } from "../../../../api/applicant";

export const ALLOWED_SELECTION_STATUSES = new Set([
  'For Completion',
  'For Medical',
  'For SBMA Gate Pass',
]);

export const isSelectionStatus = (status?: string) => ALLOWED_SELECTION_STATUSES.has(status || '');

export const mapSelectionApplicantRow = (r: any): User => ({
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


