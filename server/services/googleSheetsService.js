const fetch = require('node-fetch');

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyQ96zMGVDFv1SfRQ4r5ooun4iOGZTNJHOuP_KWI39zBp14GmUmdyfy4K0g4IRf2J6A/exec';

exports.fetchApplicants = async () => {
  const res = await fetch(GOOGLE_SHEET_URL);
  if (!res.ok) throw new Error('Failed to fetch applicants');
  return res.json();
};

exports.addOrUpdateApplicant = async (applicantData) => {
  const formData = new URLSearchParams();
  Object.entries(applicantData).forEach(([key, value]) => {
    formData.append(key, value);
  });
  const res = await fetch(GOOGLE_SHEET_URL, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to add/update applicant');
  return res.json();
}; 