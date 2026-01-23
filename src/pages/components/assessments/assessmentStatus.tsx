import React, { useState, useEffect } from 'react';
import { fetchApplicantByNo, saveApplicantAssessment } from '../../../api/assessmentStatus';
import { fetchClients, createClient, deleteClient, type Client } from '../../../api/client';

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
  STATUS: "",
  REQUIREMENTS_STATUS: "",
  FINAL_INTERVIEW_STATUS: "",
  MEDICAL_STATUS: "",
  DOC_SCREENING_STATUS: "",
  PHYSICAL_SCREENING_STATUS: "",
  STATUS_REMARKS: "",
  APPLICANT_REMARKS: ""
};

interface AssessmentProps {
  applicantNo?: string;
  showApplicantHeader?: boolean;
}

const Assessment: React.FC<AssessmentProps> = ({ applicantNo, showApplicantHeader = true }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('');
  const [no, setNo] = useState<string>(applicantNo || '');
  const [requirementsStatus, setRequirementsStatus] = useState<string>('');
  const [finalInterviewStatus, setFinalInterviewStatus] = useState<string>('');
  const [medicalStatus, setMedicalStatus] = useState<string>('');
  const [docScreeningStatus, setDocScreeningStatus] = useState<string>('');
  const [physicalScreeningStatus, setPhysicalScreeningStatus] = useState<string>('');
  const [statusRemarks, setStatusRemarks] = useState<string>('');
  const [applicantRemarks, setApplicantRemarks] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [applicantData, setApplicantData] = useState<{ [key: string]: string }>(emptyApplicant);
  const [newClientName, setNewClientName] = useState<string>('');
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [deletingClientId, setDeletingClientId] = useState<number | null>(null);

  // Fetch clients from API
  const loadClients = async () => {
    try {
      const fetchedClients = await fetchClients();
      setClients(fetchedClients);
      return fetchedClients;
    } catch (error) {
      console.error('Error fetching clients:', error);
      setStatus('Error loading clients');
      return [];
    }
  };

  // Initialize clients on mount and migrate if needed
  useEffect(() => {
    const initializeClients = async () => {
      try {
        const currentClients = await loadClients();
        // If no clients exist, initialize defaults (first time setup)
        if (currentClients.length === 0) {
          try {
            const response = await fetch('/api/clients/init-defaults', { method: 'POST' });
            if (response.ok) {
              await loadClients();
            }
          } catch (error) {
            console.error('Error initializing default clients:', error);
          }
        }
      } catch (error) {
        console.error('Error loading clients:', error);
        // Try to initialize defaults if fetch fails (might be first run)
        try {
          const response = await fetch('/api/clients/init-defaults', { method: 'POST' });
          if (response.ok) {
            await loadClients();
          }
        } catch (initError) {
          console.error('Error initializing default clients:', initError);
        }
      }
    };
    initializeClients();
  }, []);

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
        setDocScreeningStatus(applicant.DOC_SCREENING_STATUS || "");
        setPhysicalScreeningStatus(applicant.PHYSICAL_SCREENING_STATUS || "");
        setStatusRemarks(applicant.Status_REMARKS || applicant.STATUS_REMARKS || "");
        setApplicantRemarks(applicant.APPLICANT_REMARKS || "");
        
        // Check selected companies based on current clients from API
        const clientNames = clients.map(c => c.name);
        const existingCompanies = clientNames.filter(clientName => {
          const colName = clientName as keyof typeof applicant;
          return applicant[colName] === "Ok";
        });
        setSelectedCompanies(existingCompanies);
        
        console.log('Applicant data loaded:', fetchedData);
      } else {
        setApplicantData({ ...emptyApplicant, NO: applicantNumber });
        setRequirementsStatus("");
        setFinalInterviewStatus("");
        setMedicalStatus("");
        setDocScreeningStatus("");
        setPhysicalScreeningStatus("");
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

    // Get client IDs for selected companies
    const selectedClientIds = clients
      .filter(client => selectedCompanies.includes(client.name))
      .map(client => client.id);

    let updatedApplicantData: { [key: string]: any } = { ...applicantData, NO: no };
    
    // Update client fields for backward compatibility (if needed)
    clients.forEach(client => {
      updatedApplicantData[client.name] = selectedCompanies.includes(client.name) ? "Ok" : "";
    });

    // Add CLIENT_IDS array for new junction table approach
    updatedApplicantData["CLIENT_IDS"] = selectedClientIds;

    updatedApplicantData["REQUIREMENTS_STATUS"] = requirementsStatus;
    updatedApplicantData["FINAL_INTERVIEW_STATUS"] = finalInterviewStatus;
    updatedApplicantData["MEDICAL_STATUS"] = medicalStatus;
    updatedApplicantData["DOC_SCREENING_STATUS"] = docScreeningStatus;
    updatedApplicantData["PHYSICAL_SCREENING_STATUS"] = physicalScreeningStatus;
    updatedApplicantData["STATUS_REMARKS"] = statusRemarks;
    updatedApplicantData["APPLICANT_REMARKS"] = applicantRemarks;

    try {
      await saveApplicantAssessment(updatedApplicantData);
      setStatus('Ok');
      setApplicantData(updatedApplicantData);
      // Log to assessment history
      try {
        await fetch('/api/applicants/assessment-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            applicant_no: no,
            action: 'Assessment Updated',
            status: finalInterviewStatus || requirementsStatus || medicalStatus || '',
            notes: statusRemarks || applicantRemarks || ''
          })
        });
        try { window.dispatchEvent(new CustomEvent('assessment-history-updated')); } catch {}
      } catch {}
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
  }, [no, clients]);

  // Handle adding a new client
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) {
      setStatus('Please enter a client name');
      return;
    }

    try {
      await createClient(newClientName.trim());
      setNewClientName('');
      setIsAddingClient(false);
      await loadClients(); // Refresh the client list
      setStatus('Client added successfully');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to add client');
    }
  };

  // Handle deleting a client
  const handleDeleteClient = async (clientId: number, clientName: string) => {
    if (!confirm(`Are you sure you want to delete "${clientName}"? This will also remove it from all applicant records.`)) {
      return;
    }

    try {
      setDeletingClientId(clientId);
      await deleteClient(clientId);
      await loadClients(); // Refresh the client list
      // Remove from selected companies if it was selected
      setSelectedCompanies(prev => prev.filter(c => c !== clientName));
      setStatus('Client deleted successfully');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to delete client');
    } finally {
      setDeletingClientId(null);
    }
  };

  const isCompact = !showApplicantHeader;

  return (
    <div className="flex w-full">
      <div className={`flex-1 max-w-full ${isCompact ? '' : 'mx-auto py-10 px-4'}`}>
        <div className={`${isCompact ? 'bg-transparent shadow-none overflow-visible' : 'bg-white rounded-2xl shadow-lg overflow-hidden'}`}>
          {!isCompact && (
            <div className="flex items-center justify-between p-6 border-b bg-white">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-custom-teal">Employee Screening & Assessment</h1>
                <div className="h-6 w-px bg-gray-300"></div>
                <span className="text-sm text-gray-500">Assessment Management</span>
              </div>
            </div>
          )}

          <div className={`${isCompact ? 'p-0' : 'p-6'}`}>
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

            <form onSubmit={handleSubmit} className={`${isCompact ? 'space-y-4' : 'space-y-6'}`}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 ${isCompact ? 'gap-4' : 'gap-6'}`}>
                <div className="flex flex-col gap-3 bg-gradient-to-br from-custom-teal/5 to-blue-50/50 rounded-xl p-4 border border-custom-teal/20">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <i className="fas fa-building text-custom-teal"></i>
                      Clients (Multiple Selection)
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddingClient(!isAddingClient)}
                      className="px-3 py-1.5 text-xs bg-custom-teal text-white hover:bg-custom-teal/90 font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <i className={`fas ${isAddingClient ? 'fa-times' : 'fa-plus'}`}></i>
                      {isAddingClient ? 'Cancel' : 'Add Client'}
                    </button>
                  </div>
                  
                  {isAddingClient && (
                    <form onSubmit={handleAddClient} className="mb-2 p-3 bg-white rounded-lg border-2 border-custom-teal/30 shadow-sm">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newClientName}
                          onChange={(e) => setNewClientName(e.target.value)}
                          placeholder="Enter client name"
                          className="flex-1 text-sm border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-custom-teal focus:border-custom-teal bg-white"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-custom-teal text-white text-sm rounded-lg hover:bg-custom-teal/90 transition-colors font-medium shadow-sm"
                        >
                          <i className="fas fa-check mr-1"></i>Add
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {clients.length === 0 ? (
                      <div className="col-span-2 text-center py-4 text-sm text-gray-500">
                        <i className="fas fa-info-circle mb-2 text-gray-400"></i>
                        <p>No clients available. Click "Add Client" to create one.</p>
                      </div>
                    ) : (
                      clients.map(client => (
                        <label 
                          key={client.id} 
                          className={`inline-flex items-center gap-2.5 text-sm p-2.5 rounded-lg border-2 transition-all cursor-pointer group ${
                            selectedCompanies.includes(client.name)
                              ? 'bg-custom-teal/10 border-custom-teal/40 text-custom-teal'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-custom-teal/30 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-custom-teal focus:ring-custom-teal cursor-pointer"
                            checked={selectedCompanies.includes(client.name)}
                            onChange={() => toggleCompany(client.name)}
                          />
                          <span className="flex-1 font-medium">{client.name}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteClient(client.id, client.name);
                            }}
                            disabled={deletingClientId === client.id}
                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity p-1 disabled:opacity-50 hover:bg-red-50 rounded"
                            title="Delete client"
                          >
                            {deletingClientId === client.id ? (
                              <i className="fas fa-spinner fa-spin text-xs"></i>
                            ) : (
                              <i className="fas fa-trash text-xs"></i>
                            )}
                          </button>
                        </label>
                      ))
                    )}
                  </div>
                  
                  {selectedCompanies.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs font-medium text-gray-600">Selected:</span>
                        {selectedCompanies.map((clientName, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-custom-teal text-white"
                          >
                            {clientName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 bg-white rounded-xl p-4 border border-gray-200">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <i className="fas fa-id-card text-custom-teal"></i>
                    Applicant NO *
                  </label>
                  <input
                    type="text"
                    value={no}
                    onChange={e => setNo(e.target.value)}
                    required
                    placeholder="Enter applicant NO"
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-custom-teal focus:border-custom-teal bg-white transition-colors font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <i className="fas fa-clipboard-check text-custom-teal"></i>
                    Requirements Status
                  </label>
                  <input
                    type="text"
                    value={requirementsStatus}
                    onChange={e => setRequirementsStatus(e.target.value)}
                    placeholder="Enter requirements status"
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-custom-teal focus:border-custom-teal bg-white transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <i className="fas fa-user-tie text-custom-teal"></i>
                    Final Interview Status *
                  </label>
                  <select
                    value={finalInterviewStatus}
                    onChange={e => setFinalInterviewStatus(e.target.value)}
                    required
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-custom-teal focus:border-custom-teal bg-white transition-colors"
                  >
                    <option value="" disabled>Select final interview status</option>
                    <option value="Passed">Passed</option>
                    <option value="Good">Good</option>
                    <option value="Very Good">Very Good</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <i className="fas fa-file-alt text-custom-teal"></i>
                    Doc Screening Status
                  </label>
                  <select
                    value={docScreeningStatus}
                    onChange={e => setDocScreeningStatus(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-custom-teal focus:border-custom-teal bg-white transition-colors"
                  >
                    <option value="" disabled>Select doc screening status</option>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                    <option value="Pending">Pending</option>
                    <option value="Not Applicable">Not Applicable</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <i className="fas fa-user-md text-custom-teal"></i>
                    Physical Screening Status
                  </label>
                  <select
                    value={physicalScreeningStatus}
                    onChange={e => setPhysicalScreeningStatus(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-custom-teal focus:border-custom-teal bg-white transition-colors"
                  >
                    <option value="" disabled>Select physical screening status</option>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                    <option value="Pending">Pending</option>
                    <option value="Not Applicable">Not Applicable</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <i className="fas fa-heartbeat text-custom-teal"></i>
                    Medical Status
                  </label>
                  <input
                    type="text"
                    value={medicalStatus}
                    onChange={e => setMedicalStatus(e.target.value)}
                    placeholder="Enter medical status"
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-custom-teal focus:border-custom-teal bg-white transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <i className="fas fa-comment-dots text-custom-teal"></i>
                    Status Remarks
                  </label>
                  <input
                    type="text"
                    value={statusRemarks}
                    onChange={e => setStatusRemarks(e.target.value)}
                    placeholder="Enter status remarks"
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-custom-teal focus:border-custom-teal bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 bg-white rounded-xl p-4 border border-gray-200">
                <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <i className="fas fa-sticky-note text-custom-teal"></i>
                  Applicant Remarks
                </label>
                <textarea
                  value={applicantRemarks}
                  onChange={e => setApplicantRemarks(e.target.value)}
                  placeholder="Enter applicant remarks"
                  rows={4}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-custom-teal focus:border-custom-teal bg-white resize-none transition-colors"
                />
              </div>

              <div className={`flex items-center justify-between ${isCompact ? 'pt-4' : 'pt-6'} border-t-2 border-gray-200 bg-gray-50 -mx-6 px-6 py-4 ${isCompact ? '' : '-mb-6 rounded-b-2xl'}`}>
                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`${isCompact ? 'px-5 py-2.5 text-sm' : 'px-8 py-3'} bg-custom-teal text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none border-2 border-custom-teal hover:bg-custom-teal/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
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
                  <div className={`flex items-center space-x-2 ${isCompact ? 'px-4 py-2 text-sm rounded-lg' : 'px-5 py-2.5 rounded-lg'} shadow-sm ${
                    status === 'Ok' 
                      ? 'bg-green-50 text-green-700 border-2 border-green-300' 
                      : 'bg-red-50 text-red-700 border-2 border-red-300'
                  }`}>
                    {status === 'Ok' ? (
                      <i className="fas fa-check-circle text-green-600"></i>
                    ) : (
                      <i className="fas fa-exclamation-circle text-red-600"></i>
                    )}
                    <span className="font-semibold">{status}</span>
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