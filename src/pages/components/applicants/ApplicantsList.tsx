import React, { useState } from "react";
import type { User, ApplicationStatus, ScreeningStatus } from "../../../types/applicant";
import ApplicantSidebar from "./ApplicantSidebar";
import InputApplicantModal, { initialFormState } from './InputApplicantModal';

const ApplicantsList: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleCloseSidebar = () => {
    setSelectedUser(null);
  };

  const handleStatusChange = (userId: number, newStatus: ApplicationStatus) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleScreeningUpdate = (userId: number, key: keyof User, status: ScreeningStatus) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, [key]: status } : user
      )
    );
    
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, [key]: status } : null);
    }
  };

  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzoIigCHaEaHcgLQqviokawZJFcgaum6w6P7wWliTyd-2asV7hyo8LmuPlRRhIUHZf0/exec";

  const handleAddApplicant = async (data: typeof initialFormState) => {
    const payload = {
      NO: data.no,
      REFFERED_BY: data.referredBy,
      LAST_NAME: data.lastName,
      FIRST_NAME: data.firstName,
      EXT: data.ext,
      MIDDLE: data.middle,
      GENDER: data.gender,
      SIZE: data.size,
      DATE_OF_BIRTH: data.dateOfBirth,
      DATE_APPLIED: data.dateApplied,
      FB_NAME: data.name,
      AGE: data.age,
      LOCATION: data.location,
      CONTACT_NUMBER: data.contactNumber,
      POSITION_APPLIED_FOR: data.positionApplied,
      EXPERIENCE: data.experience,
      DATIAN: data.datian || '',
      HOKEI: data.hokei || '',
      POBC: data.pobc || '',
      JINBOWAY: data.jinboway || '',
      SURPRISE: data.surprise || '',
      THALESTE: data.thaleste || '',
      AOLLY: data.aolly || '',
      ENJOY: data.enjoy || '',
      STATUS: data.status || '',
      REQUIREMENTS_STATUS: data.requirementsStatus || '',
      FINAL_INTERVIEW_STATUS: data.finalInterviewStatus || '',
      MEDICAL_STATUS: data.medicalStatus || '',
      STATUS_REMARKS: data.statusRemarks || '',
      APPLICANT_REMARKS: data.applicantRemarks || '',
    };

    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(payload).toString(),
      });
      // Optionally, add to local state for UI update
      const newApplicant: User = {
        id: Date.now(),
        name: data.name || `${data.firstName} ${data.lastName}`,
        position: data.positionApplied || '',
        status: data.status || 'Document Screening',
        contactNumber: data.contactNumber || '',
        experience: data.experience || '',
        email: '',
        applicationDate: data.dateApplied || new Date().toISOString(),
        referredBy: data.referredBy,
        lastName: data.lastName,
        firstName: data.firstName,
        ext: data.ext,
        middle: data.middle,
        gender: data.gender,
        size: data.size,
        dateOfBirth: data.dateOfBirth,
        dateApplied: data.dateApplied,
        age: data.age,
        location: data.location,
        no: data.no,
        datian: data.datian || '',
        hokei: data.hokei || '',
        pobc: data.pobc || '',
        jinboway: data.jinboway || '',
        surprise: data.surprise || '',
        thaleste: data.thaleste || '',
        aolly: data.aolly || '',
        enjoy: data.enjoy || '',
        requirementsStatus: data.requirementsStatus || '',
        finalInterviewStatus: data.finalInterviewStatus || '',
        medicalStatus: data.medicalStatus || '',
        statusRemarks: data.statusRemarks || '',
        applicantRemarks: data.applicantRemarks || '',
        // ... add other fields as needed ...
      };
      setUsers(prev => [...prev, newApplicant]);
    } catch (error) {
      alert("Failed to add applicant to Google Sheet.");
    }
  };

  const handleStatusChangeAndSync = async (userId: number, newStatus: ApplicationStatus) => {
    // Find the user
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Build the payload with all fields, but update status
    const payload = {
      NO: user.no,
      REFFERED_BY: user.referredBy,
      LAST_NAME: user.lastName,
      FIRST_NAME: user.firstName,
      EXT: user.ext,
      MIDDLE: user.middle,
      GENDER: user.gender,
      SIZE: user.size,
      DATE_OF_BIRTH: user.dateOfBirth,
      DATE_APPLIED: user.dateApplied,
      FB_NAME: user.name,
      AGE: user.age,
      LOCATION: user.location,
      CONTACT_NUMBER: user.contactNumber,
      POSITION_APPLIED_FOR: user.positionApplied,
      EXPERIENCE: user.experience,
      DATIAN: user.datian || '',
      HOKEI: user.hokei || '',
      POBC: user.pobc || '',
      JINBOWAY: user.jinboway || '',
      SURPRISE: user.surprise || '',
      THALESTE: user.thaleste || '',
      AOLLY: user.aolly || '',
      ENJOY: user.enjoy || '',
      STATUS: newStatus, // <-- update status here
      REQUIREMENTS_STATUS: user.requirementsStatus || '',
      FINAL_INTERVIEW_STATUS: user.finalInterviewStatus || '',
      MEDICAL_STATUS: user.medicalStatus || '',
      STATUS_REMARKS: user.statusRemarks || '',
      APPLICANT_REMARKS: user.applicantRemarks || '',
    };

    // Update local state
    setUsers(prevUsers =>
      prevUsers.map(u => u.id === userId ? { ...u, status: newStatus } : u)
    );

    // Send to Google Sheets
    await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(payload).toString(),
    });
  };

  const checkApplicantExists = async (no: string, lastName: string, firstName: string) => {
    const url = `${GOOGLE_SHEET_URL}?NO=${encodeURIComponent(no)}&LAST_NAME=${encodeURIComponent(lastName)}&FIRST_NAME=${encodeURIComponent(firstName)}`;
    const response = await fetch(url);
    if (!response.ok) return false;
    const data = await response.json();
    return data !== null;
  };

  const filteredUsers = users.filter((user) =>
    (user.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (user.position?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="flex w-full">
      <div className="flex-1 max-w-full mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div className="flex space-x-2">
              <button className="px-4 py-2 rounded-lg bg-custom-teal/10 text-black font-semibold shadow-sm focus:outline-none border border-custom-teal/80">
                Applied <span className="ml-1 bg-indigo-100 text-custom-teal rounded px-2 py-0.5 text-xs font-bold">{users.length}</span>
              </button>
              <button
                className="px-4 py-2 cursor-pointer rounded-lg bg-custom-teal text-white font-semibold shadow-sm focus:outline-none border bordercustom-teal ml-2"
                onClick={() => setIsModalOpen(true)}
              >
                Input Data
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-green-800 cursor-pointer text-white font-semibold shadow-sm focus:outline-none border border-green-700 ml-2"
                onClick={() => {
                  window.open('https://docs.google.com/spreadsheets/d/1Iwz2TJ6We1FtIL4BhEnDW_qlt5Q7f2aAIX2fn2SDqUQ/edit?gid=0#gid=0', '_blank');
                }}
              >
                Open Google Sheet
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
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Application Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={`hover:bg-indigo-50 transition cursor-pointer ${selectedUser?.id === user.id ? 'bg-indigo-50' : ''}`}
                      onClick={() => handleUserClick(user)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-custom-teal flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {user.name.split(" ").map((n: string) => n[0]).join("")}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-400">{user.email || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{user.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.applicationDate ? new Date(user.applicationDate).toLocaleDateString() : ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">{user.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 rounded-full p-2 transition"
                          title="View Details"
                          onClick={e => { e.stopPropagation(); handleUserClick(user); }}
                        >
                          <i className="fas fa-eye" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 rounded-full p-2 transition"
                          title="Screening"
                          onClick={e => { e.stopPropagation() }}
                        >
                          <i className="fas fa-clipboard-check" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-gray-700 rounded-full p-2 transition"
                          title="More actions"
                          onClick={e => e.stopPropagation()}
                        >
                          <i className="fas fa-ellipsis-h" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <ApplicantSidebar 
        selectedUser={selectedUser} 
        onClose={handleCloseSidebar}
        onStatusChange={handleStatusChangeAndSync}
        onScreeningUpdate={handleScreeningUpdate}
      />
      <InputApplicantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddApplicant}
        onUpdateStatus={handleStatusChangeAndSync}
      />

    </div>
  );
};

export default ApplicantsList; 