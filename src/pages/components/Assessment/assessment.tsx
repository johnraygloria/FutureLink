import React, { useState } from 'react';

const companies = [
  'DATIAN',
  'HOKEI',
  'POBC',
  'JINBOWAY',
  'SURPRISE',
  'THALESTE',
  'AOLLY',
  'ENJOY'
];

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzoIigCHaEaHcgLQqviokawZJFcgaum6w6P7wWliTyd-2asV7hyo8LmuPlRRhIUHZf0/exec';

const companyColumns = [
  "DATIAN", "HOKEI", "POBC", "JINBOWAY", "SURPRISE", "THALESTE", "AOLLY", "ENJOY"
];

const emptyApplicant = {
  NO: "",
  REFFERED_BY: "",
  LAST_NAME: "",
  FIRST_NAME: "",
  EXT: "",
  MIDDLE: "",
  GENDER: "",
  SIZE: "",
  DATE_OF_BIRTH: "",
  DATE_APPLIED: "",
  FB_NAME: "",
  AGE: "",
  LOCATION: "",
  CONTACT_NUMBER: "",
  POSITION_APPLIED_FOR: "",
  EXPERIENCE: "",
  DATIAN: "",
  HOKEI: "",
  POBC: "",
  JINBOWAY: "",
  SURPRISE: "",
  THALESTE: "",
  AOLLY: "",
  ENJOY: "",
  STATUS: "",
  REQUIREMENTS_STATUS: "",
  FINAL_INTERVIEW_STATUS: "",
  MEDICAL_STATUS: "",
  STATUS_REMARKS: "",
  APPLICANT_REMARKS: ""
};

const Assessment: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [no, setNo] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompany(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!no || !selectedCompany) {
      setStatus('Please enter applicant NO and select a company.');
      return;
    }
    setLoading(true);
    setStatus('');

    // 1. Fetch existing applicant data
    let applicantData = { ...emptyApplicant, NO: no };
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?NO=${encodeURIComponent(no)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data)) {
          // Map array to object by column order
          Object.keys(emptyApplicant).forEach((key, idx) => {
            applicantData[key] = data[idx] || "";
          });
        }
      }
    } catch (err) {
      // If fetch fails, just use emptyApplicant
    }

    // 2. Set all company columns to "", except the selected one to "Ok"
    companyColumns.forEach(col => {
      applicantData[col] = col === selectedCompany ? "Ok" : "";
    });

    // 3. Prepare form data
    const formData = new URLSearchParams();
    Object.entries(applicantData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('company', selectedCompany);

    // 4. POST to Google Script
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setStatus('Ok');
      } else {
        setStatus('Failed');
      }
    } catch (error) {
      setStatus('Failed');
    }
    setLoading(false);
  };

  return (
    <section
      style={{
        padding: '2.5rem 2rem',
        maxWidth: 520,
        margin: '2rem auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        border: '1px solid #ececec',
      }}
    >
      <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 4 }}>Employee Screening & Assessment</h2>
      <hr style={{ border: 'none', borderTop: '1px solid #ececec', margin: '0 0 2rem 0' }} />
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Select company for fit check:</label>
          <select
            value={selectedCompany}
            onChange={handleCompanyChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              fontSize: '1rem',
              background: '#fafbfc',
            }}
          >
            <option value="" disabled>Select a company</option>
            {companies.map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Enter applicant NO:</label>
          <input
            type="text"
            value={no}
            onChange={e => setNo(e.target.value)}
            required
            placeholder="Enter applicant NO"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: 6,
            border: 'none',
            background: '#2563eb',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        {status && (
          <div style={{ marginTop: '1.5rem', color: status === 'Ok' ? 'green' : 'red', fontWeight: 600 }}>
            {status}
          </div>
        )}
      </form>
    </section>
  );
};

export default Assessment;