import React, { useState } from "react";
import type { User, ApplicationStatus } from "../../../api/applicant";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";

interface AssessmentHistory {
  id: number;
  date: string;
  type: 'Performance Review' | 'Skills Assessment' | 'Behavioral Review' | 'Project Evaluation';
  score: number;
  evaluator: string;
  comments: string;
  status: 'Passed' | 'Failed' | 'Needs Improvement';
}

const initialApplicants: User[] = [
  {
    id: 1,
    firstName: "Juan",
    lastName: "Dela Cruz",
    positionApplied: "Engineer",
    status: "Deployed",
    contactNumber: "09171234567",
    experience: "5 years",
    dateApplied: "2024-06-01",
    referredBy: "HR",
    ext: "",
    middle: "",
    gender: "Male",
    size: "M",
    dateOfBirth: "1990-01-01",
    age: "34",
    location: "Manila",
    no: "001",
    facebook: "",
  },
];

const initialAssessmentHistory: AssessmentHistory[] = [
  {
    id: 1,
    date: "2024-06-15",
    type: "Performance Review",
    score: 85,
    evaluator: "Manager Smith",
    comments: "Excellent work ethic and technical skills. Shows strong leadership potential.",
    status: "Passed"
  },
  {
    id: 2,
    date: "2024-07-01",
    type: "Skills Assessment",
    score: 92,
    evaluator: "Tech Lead Johnson",
    comments: "Advanced problem-solving abilities. Ready for more complex projects.",
    status: "Passed"
  },
  {
    id: 3,
    date: "2024-07-15",
    type: "Behavioral Review",
    score: 78,
    evaluator: "HR Manager",
    comments: "Good team player but needs improvement in communication skills.",
    status: "Needs Improvement"
  }
];

const EngagementHR: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>(initialApplicants);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistory[]>(initialAssessmentHistory);
  const [showHistory, setShowHistory] = useState(false);

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

  const addAssessmentHistory = (newAssessment: Omit<AssessmentHistory, 'id'>) => {
    const newId = Math.max(...assessmentHistory.map(h => h.id)) + 1;
    setAssessmentHistory(prev => [...prev, { ...newAssessment, id: newId }]);
  };

  const filteredUsers = deployedApplicants.filter((user) =>
    ((user.firstName || '') + ' ' + (user.lastName || '')).toLowerCase().includes(search.toLowerCase()) ||
    (user.positionApplied?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (user.contactNumber?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const getAverageScore = () => {
    if (assessmentHistory.length === 0) return 0;
    const total = assessmentHistory.reduce((sum, assessment) => sum + assessment.score, 0);
    return Math.round(total / assessmentHistory.length);
  };

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
                  Back to Deployed Applicants
                </button>
                <h1 className="text-2xl font-bold text-custom-teal">Engagement History</h1>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Application Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {assessmentHistory.map((assessment) => (
                      <tr key={assessment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">Assessment {assessment.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assessment.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assessment.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            assessment.status === 'Passed' ? 'bg-green-100 text-green-800' :
                            assessment.status === 'Failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {assessment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-900 rounded-full p-2 transition"
                            title="View Details"
                          >
                            <i className="fas fa-eye" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-gray-700 rounded-full p-2 transition"
                            title="More actions"
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
      </div>
    );
  }

  // Main Deployed Applicants Page
  return (
    <div className="flex w-full">
      <div className="flex-1 max-w-full mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-custom-teal">Engagement - Deployed Applicants</h1>
              <button
                onClick={() => setShowHistory(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-sm focus:outline-none border border-blue-700"
              >
                View Assessment History
              </button>
            </div>
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
                                {((user.firstName || '') + ' ' + (user.lastName || '')).split(" ").map((n: string) => n[0]).join("")}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                            <div className="text-xs text-gray-400">{user.contactNumber || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{user.positionApplied}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.dateApplied ? new Date(user.dateApplied).toLocaleDateString() : ''}</div>
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