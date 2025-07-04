import React, { useState, useEffect } from 'react';

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

interface AssessmentProps {
  applicantNo?: string;
}

const Assessment: React.FC<AssessmentProps> = ({ applicantNo }) => {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [no, setNo] = useState<string>(applicantNo || '');
  const [requirementsStatus, setRequirementsStatus] = useState<string>('');
  const [finalInterviewStatus, setFinalInterviewStatus] = useState<string>('');
  const [medicalStatus, setMedicalStatus] = useState<string>('');
  const [statusRemarks, setStatusRemarks] = useState<string>('');
  const [applicantRemarks, setApplicantRemarks] = useState<string>('');
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

    let applicantData = { ...emptyApplicant, NO: no };
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?NO=${encodeURIComponent(no)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data)) {
          Object.keys(emptyApplicant).forEach((key, idx) => {
            applicantData[key] = data[idx] || "";
          });
        }
      }
    } catch (err) {
    }

    companyColumns.forEach(col => {
      applicantData[col] = col === selectedCompany ? "Ok" : "";
    });

    applicantData["REQUIREMENTS_STATUS"] = requirementsStatus;
    applicantData["FINAL_INTERVIEW_STATUS"] = finalInterviewStatus;
    applicantData["MEDICAL_STATUS"] = medicalStatus;
    applicantData["STATUS_REMARKS"] = statusRemarks;
    applicantData["APPLICANT_REMARKS"] = applicantRemarks;

    const formData = new URLSearchParams();
    Object.entries(applicantData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('company', selectedCompany);

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

  useEffect(() => {
    if (applicantNo && applicantNo !== no) {
      setNo(applicantNo);
    }
  }, [applicantNo]);

  return (
    <section
      style={{
        padding: '2.5rem 2rem',
        maxWidth: 520,
        margin: '2rem auto',
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        border: '1px solid #ececec',
        transition: 'box-shadow 0.2s',
      }}
    >
      <h2 style={{ fontWeight: 800, fontSize: '2rem', marginBottom: 8, letterSpacing: '-1px', color: '#1e293b' }}>Employee Screening & Assessment</h2>
      <hr style={{ border: 'none', borderTop: '2px solid #e5e7eb', margin: '0 0 2rem 0' }} />
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 8, color: '#334155' }}>Select company for fit check</label>
          <select
            value={selectedCompany}
            onChange={handleCompanyChange}
            required
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: 8,
              border: '1.5px solid #cbd5e1',
              fontSize: '1rem',
              background: '#f8fafc',
              transition: 'border 0.2s',
              outline: 'none',
            }}
            onFocus={e => (e.currentTarget.style.border = '1.5px solid #2563eb')}
            onBlur={e => (e.currentTarget.style.border = '1.5px solid #cbd5e1')}
          >
            <option value="" disabled>Select a company</option>
            {companies.map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 8, color: '#334155' }}>Applicant NO</label>
          <input
            type="text"
            value={no}
            onChange={e => setNo(e.target.value)}
            required
            placeholder="Enter applicant NO"
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: 8,
              border: '1.5px solid #cbd5e1',
              fontSize: '1rem',
              background: '#f8fafc',
              transition: 'border 0.2s',
              outline: 'none',
            }}
            onFocus={e => (e.currentTarget.style.border = '1.5px solid #2563eb')}
            onBlur={e => (e.currentTarget.style.border = '1.5px solid #cbd5e1')}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8, color: '#334155' }}>Requirements Status</label>
            <input
              type="text"
              value={requirementsStatus}
              onChange={e => setRequirementsStatus(e.target.value)}
              placeholder="Enter requirements status"
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: 8,
                border: '1.5px solid #cbd5e1',
                fontSize: '1rem',
                background: '#f8fafc',
                transition: 'border 0.2s',
                outline: 'none',
              }}
              onFocus={e => (e.currentTarget.style.border = '1.5px solid #2563eb')}
              onBlur={e => (e.currentTarget.style.border = '1.5px solid #cbd5e1')}
            />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8, color: '#334155' }}>Final Interview Status</label>
            <select
              value={finalInterviewStatus}
              onChange={e => setFinalInterviewStatus(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: 8,
                border: '1.5px solid #cbd5e1',
                fontSize: '1rem',
                background: '#f8fafc',
                transition: 'border 0.2s',
                outline: 'none',
              }}
              onFocus={e => (e.currentTarget.style.border = '1.5px solid #2563eb')}
              onBlur={e => (e.currentTarget.style.border = '1.5px solid #cbd5e1')}
            >
              <option value="" disabled>Select final interview status</option>
              <option value="Passed">Passed</option>
              <option value="Good">Good</option>
              <option value="Very Good">Very Good</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8, color: '#334155' }}>Medical Status</label>
            <input
              type="text"
              value={medicalStatus}
              onChange={e => setMedicalStatus(e.target.value)}
              placeholder="Enter medical status"
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: 8,
                border: '1.5px solid #cbd5e1',
                fontSize: '1rem',
                background: '#f8fafc',
                transition: 'border 0.2s',
                outline: 'none',
              }}
              onFocus={e => (e.currentTarget.style.border = '1.5px solid #2563eb')}
              onBlur={e => (e.currentTarget.style.border = '1.5px solid #cbd5e1')}
            />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8, color: '#334155' }}>Status Remarks</label>
            <input
              type="text"
              value={statusRemarks}
              onChange={e => setStatusRemarks(e.target.value)}
              placeholder="Enter status remarks"
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: 8,
                border: '1.5px solid #cbd5e1',
                fontSize: '1rem',
                background: '#f8fafc',
                transition: 'border 0.2s',
                outline: 'none',
              }}
              onFocus={e => (e.currentTarget.style.border = '1.5px solid #2563eb')}
              onBlur={e => (e.currentTarget.style.border = '1.5px solid #cbd5e1')}
            />
          </div>
        </div>
        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 8, color: '#334155' }}>Applicant Remarks</label>
          <input
            type="text"
            value={applicantRemarks}
            onChange={e => setApplicantRemarks(e.target.value)}
            placeholder="Enter applicant remarks"
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: 8,
              border: '1.5px solid #cbd5e1',
              fontSize: '1rem',
              background: '#f8fafc',
              transition: 'border 0.2s',
              outline: 'none',
            }}
            onFocus={e => (e.currentTarget.style.border = '1.5px solid #2563eb')}
            onBlur={e => (e.currentTarget.style.border = '1.5px solid #cbd5e1')}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '1rem 1.5rem',
            borderRadius: 8,
            border: 'none',
            background: loading ? '#93c5fd' : '#2563eb',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.1rem',
            boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
          onMouseOver={e => { if (!loading) e.currentTarget.style.background = '#1d4ed8'; }}
          onMouseOut={e => { if (!loading) e.currentTarget.style.background = '#2563eb'; }}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        {status && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              borderRadius: 8,
              background: status === 'Ok' ? '#dcfce7' : '#fee2e2',
              color: status === 'Ok' ? '#166534' : '#b91c1c',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}
          >
            {status === 'Ok' ? (
              <span style={{ fontSize: '1.3rem' }}>✔️</span>
            ) : (
              <span style={{ fontSize: '1.3rem' }}>❌</span>
            )}
            {status}
          </div>
        )}
      </form>
    </section>
  );
};

export default Assessment;