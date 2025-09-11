import React, { useState, useEffect } from 'react';
import { fetchApplicantByNo, saveApplicantAssessment } from '../../../api/assessmentStatus';

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

const API_URL = '/api/applicants';

const companyColumns = [
  "DATIAN", "HOKEI", "POBC", "JINBOWAY", "SURPRISE", "THALESTE", "AOLLY", "ENJOY"
];

const emptyApplicant: { [key: string]: string } = {
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
  showApplicantHeader?: boolean;
}

const Assessment: React.FC<AssessmentProps> = ({ applicantNo, showApplicantHeader = true }) => {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('');
  const [no, setNo] = useState<string>(applicantNo || '');
  const [requirementsStatus, setRequirementsStatus] = useState<string>('');
  const [finalInterviewStatus, setFinalInterviewStatus] = useState<string>('');
  const [medicalStatus, setMedicalStatus] = useState<string>('');
  const [statusRemarks, setStatusRemarks] = useState<string>('');
  const [applicantRemarks, setApplicantRemarks] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [applicantData, setApplicantData] = useState<{ [key: string]: string }>(emptyApplicant);

  const fetchApplicantData = async (applicantNumber: string) => {
    if (!applicantNumber) return;
    
    try {
      const data = await fetchApplicantByNo(applicantNumber);
      if (data && Array.isArray(data) && data.length > 0) {
        const applicant = data[0];
        const fetchedData = { ...emptyApplicant };
        
        Object.keys(emptyApplicant).forEach((key) => {
          fetchedData[key] = applicant[key] || "";
        });
        
        setApplicantData(fetchedData);
        
        setRequirementsStatus(applicant.REQUIREMENTS_STATUS || "");
        setFinalInterviewStatus(applicant.FINAL_INTERVIEW_STATUS || "");
        setMedicalStatus(applicant.MEDICAL_STATUS || "");
        setStatusRemarks(applicant.Status_REMARKS || applicant.STATUS_REMARKS || "");
        setApplicantRemarks(applicant.APPLICANT_REMARKS || "");
        
        const existingCompanies = companyColumns.filter(col => applicant[col] === "Ok");
        setSelectedCompanies(existingCompanies);
        
        console.log('Applicant data loaded:', fetchedData);
      } else {
        setApplicantData({ ...emptyApplicant, NO: applicantNumber });
        setRequirementsStatus("");
        setFinalInterviewStatus("");
        setMedicalStatus("");
        setStatusRemarks("");
        setApplicantRemarks("");
        setSelectedCompanies([]);
      }
    } catch (error) {
      console.error('Error fetching applicant:', error);
      setStatus('Error fetching applicant data');
    }
  };

  const toggleCompany = (company: string) => {
    setSelectedCompanies(prev => (
      prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!no) {
      setStatus('Please enter applicant NO.');
      return;
    }
    setLoading(true);
    setStatus('');

    let updatedApplicantData: { [key: string]: string } = { ...applicantData, NO: no };
    
    companyColumns.forEach(col => {
      updatedApplicantData[col] = selectedCompanies.includes(col) ? "Ok" : (applicantData[col] || "");
    });

    updatedApplicantData["REQUIREMENTS_STATUS"] = requirementsStatus;
    updatedApplicantData["FINAL_INTERVIEW_STATUS"] = finalInterviewStatus;
    updatedApplicantData["MEDICAL_STATUS"] = medicalStatus;
    updatedApplicantData["STATUS_REMARKS"] = statusRemarks;
    updatedApplicantData["APPLICANT_REMARKS"] = applicantRemarks;

    try {
      await saveApplicantAssessment(updatedApplicantData);
      setStatus('Ok');
      setApplicantData(updatedApplicantData);
    } catch (error) {
      console.error('Save error:', error);
      setStatus(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (applicantNo && applicantNo !== no) {
      setNo(applicantNo);
    }
  }, [applicantNo]);

  useEffect(() => {
    if (no) {
      fetchApplicantData(no);
    }
  }, [no]);

  return (
    <div className="flex w-full">
      <div className="flex-1 max-w-full mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-custom-teal">Employee Screening & Assessment</h1>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">Assessment Management</span>
            </div>

          </div>

          <div className="p-6">
            {showApplicantHeader && applicantData.NO && applicantData.FIRST_NAME && (
              <div className="mb-6 bg-gradient-to-r from-custom-teal/5 to-blue-50 rounded-xl p-6 border border-custom-teal/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-custom-teal">Current Applicant</h3>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-custom-teal/10 text-custom-teal rounded-full text-sm font-medium">
                      Active Assessment
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Full Name</span>
                    <span className="text-base font-semibold text-gray-900">
                      {applicantData.FIRST_NAME} {applicantData.LAST_NAME}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Position</span>
                    <span className="text-base font-semibold text-gray-900">
                      {applicantData.POSITION_APPLIED_FOR}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Contact</span>
                    <span className="text-base font-semibold text-gray-900">
                      {applicantData.CONTACT_NUMBER}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Location</span>
                    <span className="text-base font-semibold text-gray-900">
                      {applicantData.LOCATION}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Company Fit Check (multiple)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {companies.map(company => (
                      <label key={company} className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCompanies.includes(company)}
                          onChange={() => toggleCompany(company)}
                        />
                        <span>{company}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Applicant NO *
                  </label>
                  <input
                    type="text"
                    value={no}
                    onChange={e => setNo(e.target.value)}
                    required
                    placeholder="Enter applicant NO"
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Requirements Status
                  </label>
                  <input
                    type="text"
                    value={requirementsStatus}
                    onChange={e => setRequirementsStatus(e.target.value)}
                    placeholder="Enter requirements status"
                    className="input"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Final Interview Status *
                  </label>
                  <select
                    value={finalInterviewStatus}
                    onChange={e => setFinalInterviewStatus(e.target.value)}
                    required
                    className="input"
                  >
                    <option value="" disabled>Select final interview status</option>
                    <option value="Passed">Passed</option>
                    <option value="Good">Good</option>
                    <option value="Very Good">Very Good</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Medical Status
                  </label>
                  <input
                    type="text"
                    value={medicalStatus}
                    onChange={e => setMedicalStatus(e.target.value)}
                    placeholder="Enter medical status"
                    className="input"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status Remarks
                  </label>
                  <input
                    type="text"
                    value={statusRemarks}
                    onChange={e => setStatusRemarks(e.target.value)}
                    placeholder="Enter status remarks"
                    className="input"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Applicant Remarks
                </label>
                <textarea
                  value={applicantRemarks}
                  onChange={e => setApplicantRemarks(e.target.value)}
                  placeholder="Enter applicant remarks"
                  rows={3}
                  className="input resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-lg bg-custom-teal text-white font-semibold shadow-sm focus:outline-none border border-custom-teal hover:bg-custom-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save"></i>
                        <span>Save Assessment</span>
                      </>
                    )}
                  </button>
                </div>
                {status && (
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    status === 'Ok' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {status === 'Ok' ? (
                      <i className="fas fa-check-circle text-green-600"></i>
                    ) : (
                      <i className="fas fa-exclamation-circle text-red-600"></i>
                    )}
                    <span className="font-medium">{status}</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;