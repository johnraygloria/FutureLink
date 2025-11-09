import React, { useState, useEffect } from "react";
import type { User, ApplicationStatus } from "../../../api/applicant";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";
import { useNavigation } from "../../../Global/NavigationContext";
import { formatAppliedDate, getUserInitials, isEngagementStatus, mapEngagementApplicantRow } from "./utils/engagementUtils";
import EngagementHistoryTable from "./components/EngagementHistoryTable";

interface AssessmentHistory {
  id: number;
  date: string;
  type: 'Performance Review' | 'Skills Assessment' | 'Behavioral Review' | 'Project Evaluation';
  score: number;
  evaluator: string;
  comments: string;
  status: 'Passed' | 'Failed' | 'Needs Improvement';
}

// sample data removed

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
  const [users, setUsers] = useState<User[]>([]);
  const [assessmentHistory] = useState<AssessmentHistory[]>(initialAssessmentHistory);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentApplicantNo } = useNavigation();

  // Fetch engagement-stage applicants from API
  useEffect(() => {
    setIsLoading(true);
    fetch('/api/applicants')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch applicants');
        return res.json();
      })
      .then((rows) => {
        const mapped: User[] = rows
          .filter((r: any) => isEngagementStatus(r.status))
          .map(mapEngagementApplicantRow);
        setUsers(mapped);
      })
      .catch(() => setUsers([]))
      .finally(() => setIsLoading(false));
  }, []);

  // Live update: reflect status changes without reload
  useEffect(() => {
    function onUpdated(e: any) {
      const detail = e?.detail || {};
      const { no, status } = detail;
      if (!no) return;
      setUsers(prev => {
        const idx = prev.findIndex(u => u.no === no);
        const allowed = isEngagementStatus(status);
        if (idx === -1) return prev;
        const updated = [...prev];
        if (!allowed && status === 'Deployed') {
          updated.splice(idx, 1);
          return updated;
        }
        updated[idx] = { ...updated[idx], status } as any;
        return updated;
      });
    }
    window.addEventListener('applicant-updated', onUpdated);
    return () => window.removeEventListener('applicant-updated', onUpdated);
  }, []);

  // Auto-open the proceeded applicant if coming from Selection
  useEffect(() => {
    if (!currentApplicantNo || users.length === 0) return;
    const proceededUser = users.find(user => user.no === currentApplicantNo);
    if (proceededUser) {
      setSelectedUser(proceededUser);
    }
  }, [currentApplicantNo, users]);

  // derived values kept minimal

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

  const removeUser = (userId: number) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(null);
    }
  };

  // helper actions trimmed

  const filteredUsers = users.filter((user) =>
    ((user.firstName || '') + ' ' + (user.lastName || '')).toLowerCase().includes(search.toLowerCase()) ||
    (user.positionApplied?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (user.contactNumber?.toLowerCase() || '').includes(search.toLowerCase())
  );

  // stats helpers trimmed

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
              <EngagementHistoryTable rows={assessmentHistory as any} />
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
          <div className="flex flex-col gap-4 p-6 border-b bg-white sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Engagement</h1>
              <span className="inline-flex items-center rounded-full bg-custom-teal/10 text-custom-teal px-2.5 py-0.5 text-xs font-medium border border-custom-teal/30">{users.length}</span>
              <button
                onClick={() => setShowHistory(true)}
                className="ml-2 px-3 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium shadow-sm focus:outline-none hover:bg-gray-800"
              >
                View History
              </button>
            </div>
            <div className="relative w-full sm:w-auto">
              <span className="pointer-events-none absolute left-3 top-2.5 text-gray-400">
                <i className="fas fa-search" />
              </span>
              <input
                type="text"
                placeholder="Search by name or position"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full sm:w-72 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-teal/30 bg-gray-50"
                aria-label="Search applicants"
              />
            </div>
          </div>

          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Application Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {isLoading && (
                    Array.from({ length: 6 }).map((_, idx) => (
                      <tr key={`skeleton-${idx}`} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/5" /></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-2/5" /></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/4" /></td>
                        <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-24" /></td>
                        <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-16" /></td>
                      </tr>
                    ))
                  )}
                  {!isLoading && filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <i className="fas fa-user-slash text-gray-400" />
                        </div>
                        <p className="text-sm">No applicants found</p>
                      </td>
                    </tr>
                  )}
                  {!isLoading && filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={`odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition cursor-pointer ${selectedUser?.id === user.id ? 'bg-gray-100' : ''}`}
                      onClick={() => handleUserClick(user)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-custom-teal/10 border border-custom-teal/30 flex items-center justify-center">
                              <span className="text-custom-teal font-semibold">{getUserInitials(user)}</span>
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
                        <div className="text-sm text-gray-900">{formatAppliedDate(user.dateApplied)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'For Medical' ? 'bg-blue-100 text-blue-800' :
                          user.status === 'For SBMA Gate Pass' ? 'bg-yellow-100 text-yellow-800' :
                          user.status === 'For Deployment' ? 'bg-purple-100 text-purple-800' :
                          user.status === 'Deployed' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status}
                        </span>
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
        onRemoveApplicant={removeUser}
      />
    </div>
  );
};

export default EngagementHR;