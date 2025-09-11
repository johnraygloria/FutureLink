import React, { useEffect, useState } from "react";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";
import AssessmentTable from "./assessmenetTable";
import { useApplicants } from "../Screening/hooks/useApplicants";
import { useNavigation } from "../../../Global/NavigationContext";

const Assessments: React.FC = () => {
  const {
    selectedUser,
    setSelectedUser,
    search,
    setSearch,
    users,
    setUsers,
    handleUserClick,
    handleCloseSidebar,
    handleStatusChangeAndSync,
    handleScreeningUpdate,
    removeApplicant,
    filteredUsers,
  } = useApplicants();
  const { currentApplicantNo } = useNavigation();
  const [showHistory, setShowHistory] = useState(false);
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/applicants')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch applicants');
        return res.json();
      })
      .then((rows) => {
        const mapped = rows.map((r: any) => ({
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
        }));
        // Only show applicants that are currently in Assessment stage
        const allowedStatuses = new Set([
          'For Final Interview/For Assessment',
        ]);
        const assessmentUsers = mapped.filter((u: any) => allowedStatuses.has(u.status || ''));
        setUsers(assessmentUsers);
        // Do not auto-open sidebar on Assessments entry
      })
      .catch(() => {
        setUsers([]);
      });
  }, [setUsers, setSelectedUser, currentApplicantNo]);

  // Fetch assessment history
  useEffect(() => {
    fetch('/api/applicants/screening-history')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch history');
        return res.json();
      })
      .then((history) => {
        const assessmentHistory = history.filter((h: any) => 
          h.action === 'Proceeded to Selection' || h.action === 'Proceeded to Assessment'
        );
        setAssessmentHistory(assessmentHistory);
      })
      .catch(() => setAssessmentHistory([]));
  }, []);

  // Assessment History Page
  if (showHistory) {
    return (
      <div className="flex w-full">
        <div className="flex-1 max-w-full mx-auto py-10 px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b bg-white">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowHistory(false)}
                  className="px-4 py-2 rounded-lg bg-gray-600 text-white font-semibold shadow-sm focus:outline-none border border-gray-700"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Assessment
                </button>
                <h1 className="text-2xl font-bold text-custom-teal">Assessment History</h1>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant No</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {assessmentHistory.map((history) => (
                      <tr key={history.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{history.applicant_no}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{history.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            history.status === 'For Completion' ? 'bg-green-100 text-green-800' :
                            history.status === 'For Final Interview/For Assessment' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {history.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(history.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{history.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <div className="flex-1 max-w-full mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 rounded-lg bg-custom-teal/10 text-black font-semibold shadow-sm focus:outline-none border border-custom-teal/80">
                Assessment <span className="ml-1 bg-indigo-100 text-custom-teal rounded px-2 py-0.5 text-xs font-bold">{users.length}</span>
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="px-4 py-2 rounded-lg bg-orange-600 text-white font-semibold shadow-sm focus:outline-none border border-orange-700"
              >
                View Assessment History
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <i className="fas fa-search" />
              </span>
              <input
                type="text"
                placeholder="Search candidate"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50"
              />
            </div>
          </div>
          <div className="p-0">
            <AssessmentTable
              users={filteredUsers}
              selectedUser={selectedUser}
              onUserClick={handleUserClick}
            />
          </div>
        </div>
      </div>
      <ApplicantSidebar
        selectedUser={selectedUser}
        onClose={handleCloseSidebar}
        onStatusChange={handleStatusChangeAndSync}
        onScreeningUpdate={handleScreeningUpdate}
        onRemoveApplicant={removeApplicant}
      />
    </div>
  );
};

export default Assessments;