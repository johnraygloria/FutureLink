/** Checklist items that require a reference/ID number when checked. */
export const DOCUMENT_NUMBER_FIELDS: Record<string, { numberKey: string; placeholder: string }> = {
  nbiClearance: { numberKey: 'nbiClearanceNo', placeholder: 'NBI clearance number' },
  sss: { numberKey: 'sssNo', placeholder: 'SSS number' },
  pagibig: { numberKey: 'pagibigNo', placeholder: 'Pag-IBIG number' },
  philhealth: { numberKey: 'philhealthNo', placeholder: 'PhilHealth number' },
  tinNumber: { numberKey: 'tinNo', placeholder: 'TIN number' },
};

export const CHECKLIST_ITEMS = [
  { key: 'recentPicture', label: 'Recent 2x2 picture' },
  { key: 'psaBirthCertificate', label: 'PSA Birth Certificate' },
  { key: 'schoolCredentials', label: 'School Credentials/Certificate' },
  { key: 'nbiClearance', label: 'NBI Clearance' },
  { key: 'policeClearance', label: 'Police Clearance' },
  { key: 'barangayClearance', label: 'Barangay Clearance' },
  { key: 'sss', label: 'SSS' },
  { key: 'pagibig', label: 'Pag-IBIG #' },
  { key: 'cedula', label: 'Cedula' },
  { key: 'vaccinationStatus', label: 'Vaccination Status' },
  { key: 'resume', label: 'Resume' },
  { key: 'coe', label: 'Certificate of Employment (COE)' },
  { key: 'philhealth', label: 'PhilHealth' },
  { key: 'tinNumber', label: 'TIN Number' },
] as const;
