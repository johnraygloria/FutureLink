
const API_URL = '/api/applicants';

export async function fetchApplicantByNo(no: string) {
  const res = await fetch(`${API_URL}?NO=${encodeURIComponent(no)}`);
  if (!res.ok) throw new Error('Failed to fetch applicant');
  const rows = await res.json();
  // Map MySQL columns to Assessment's expected keys
  return rows.map((r: any) => ({
    NO: r.applicant_no || '',
    REFFERED_BY: r.referred_by || '',
    LAST_NAME: r.last_name || '',
    FIRST_NAME: r.first_name || '',
    EXT: r.ext || '',
    MIDDLE: r.middle_name || '',
    GENDER: r.gender || '',
    SIZE: r.size || '',
    DATE_OF_BIRTH: r.date_of_birth || '',
    DATE_APPLIED: r.date_applied || '',
    FB_NAME: r.fb_name || '',
    AGE: r.age || '',
    LOCATION: r.location || '',
    CONTACT_NUMBER: r.contact_number || '',
    POSITION_APPLIED_FOR: r.position_applied_for || '',
    EXPERIENCE: r.experience || '',
    DATIAN: r.datian || '',
    HOKEI: r.hokei || '',
    POBC: r.pobc || '',
    JINBOWAY: r.jinboway || '',
    SURPRISE: r.surprise || '',
    THALESTE: r.thaleste || '',
    AOLLY: r.aolly || '',
    ENJOY: r.enjoy || '',
    STATUS: r.status || '',
    REQUIREMENTS_STATUS: r.requirements_status || '',
    FINAL_INTERVIEW_STATUS: r.final_interview_status || '',
    MEDICAL_STATUS: r.medical_status || '',
    PHYSICAL_SCREENING_STATUS: r.physical_screening_status || '',
    DOC_SCREENING_STATUS: r.doc_screening_status || '',
    STATUS_REMARKS: r.status_remarks || '',
    APPLICANT_REMARKS: r.applicant_remarks || '',
    // Document Checklist - Map to boolean for frontend convenience
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
    id: r.id, // Ensure ID is included for identification
  }));
}

export async function saveApplicantAssessment(applicantData: any) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(applicantData),
  });
  if (!response.ok) throw new Error('Failed to save applicant assessment');
  return response.json();
}