export const ALLOWED_ASSESSMENT_STATUSES = new Set([
  "For Final Interview/For Assessment",
  "Initial Interview",
  "Completion",
  "Final Interview",
  "Final Interview/Incomplete Requirements",
  "Final Interview/Complete Requirements",
]);

export const isAssessmentStatus = (status?: string) => ALLOWED_ASSESSMENT_STATUSES.has(status || "");

export const mapApplicantRow = (r: any) => ({
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

export type AssessmentHistoryItem = {
  id: string | number;
  full_name?: string;
  position_applied_for?: string;
  date_applied?: string;
  status?: string;
};


