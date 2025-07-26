import React, { useState } from "react";
import type { User, ApplicationStatus } from "../../../api/applicant";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";

const initialApplicants: User[] = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    position: "Engineer",
    status: "Deployed",
    contactNumber: "09171234567",
    experience: "5 years",
    email: "juan@email.com",
    applicationDate: "2024-06-01",
    referredBy: "HR",
    lastName: "Dela Cruz",
    firstName: "Juan",
    ext: "",
    middle: "",
    gender: "Male",
    size: "M",
    dateOfBirth: "1990-01-01",
    dateApplied: "2024-05-20",
    age: "34",
    location: "Manila",
    no: "001",
    datian: "",
    hokei: "",
    pobc: "",
    jinboway: "",
    surprise: "",
    thaleste: "",
    aolly: "",
    enjoy: "",
    requirementsStatus: "Complete",
    finalInterviewStatus: "Passed",
    medicalStatus: "Cleared",
    statusRemarks: "Ready for deployment",
    applicantRemarks: "",
  },
];

const EngagementHR: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>(initialApplicants);

  const deployedApplicants = users.filter(user => user.status === "Deployed");

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

  const filteredUsers = deployedApplicants.filter((user) =>
    (user.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (user.position?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="flex w-full">
      <div className="flex-1 max-w-full mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <h1 className="text-2xl font-bold text-custom-teal">Engagement - Deployed Applicants</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search deployed applicant"
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
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{user.status}</span>
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
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default EngagementHR;