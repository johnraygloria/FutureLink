
const API_URL = '/api/applicants';

export async function fetchApplicantByNo(no: string) {
  const res = await fetch(`${API_URL}?NO=${encodeURIComponent(no)}`);
  if (!res.ok) throw new Error('Failed to fetch applicant');
  return res.json();
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