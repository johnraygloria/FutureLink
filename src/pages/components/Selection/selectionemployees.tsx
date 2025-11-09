import { useEffect, useState } from "react";
// import { IconArrowLeft, IconDatabase } from "@tabler/icons-react";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";
import type { User } from "../../../api/applicant";
import { useNavigation } from "../../../Global/NavigationContext";
import { formatAppliedDate, getUserInitials, isSelectionStatus, mapSelectionApplicantRow } from "./utils/selectionUtils";
import SelectionHistoryTable from "./components/SelectionHistoryTable";

interface SelectionHistory {
  id: number;
  employeeId: number;
  date: string;
  stage: 'Medical Referral' | 'Trade Test' | 'Medical Clearance' | 'Orientation' | 'SBMA Processing' | 'Gate Pass Issued';
  status: 'Completed' | 'In Progress' | 'Scheduled' | 'Failed' | 'Pending';
  facilitator: string;
  notes: string;
  documents?: string[];
  nextDeadline?: string;
}


export default function SelectionEmployees() {
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [selectionHistory, setSelectionHistory] = useState<SelectionHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentApplicantNo } = useNavigation();

  const openSidebar = (emp: User) => {
    setSelectedEmployee(emp);
  };
  const closeSidebar = () => {
    setSelectedEmployee(null);
  };

  const removeEmployee = (employeeId: number) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      // Add to history
      const newHistoryEntry: SelectionHistory = {
        id: Date.now(),
        employeeId: employee.id,
        date: new Date().toISOString().split('T')[0],
        stage: 'Medical Referral',
        status: 'Completed',
        facilitator: 'System',
        notes: `Moved from Selection to Engagement stage`,
        nextDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      setSelectionHistory(prev => [newHistoryEntry, ...prev]);
      
      // Remove from employees list
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      
      // Close sidebar if this employee was selected
      if (selectedEmployee && selectedEmployee.id === employeeId) {
        setSelectedEmployee(null);
      }
    }
  };



  // Fetch selection-stage applicants from API
  useEffect(() => {
    setIsLoading(true);
    fetch('/api/applicants')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch applicants');
        return res.json();
      })
      .then((rows) => {
        const mapped: User[] = rows
          .filter((r: any) => isSelectionStatus(r.status))
          .map(mapSelectionApplicantRow);
        setEmployees(mapped);
      })
      .catch(() => setEmployees([]))
      .finally(() => setIsLoading(false));
  }, []);

  // Live update on applicant status changes across sections
  useEffect(() => {
    function onUpdated(e: any) {
      const detail = e?.detail || {};
      const { no, status } = detail;
      if (!no) return;
      setEmployees(prev => {
        const idx = prev.findIndex(u => u.no === no);
        const allowed = isSelectionStatus(status);
        if (idx === -1) return prev;
        const updated = [...prev];
        if (!allowed) {
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

  // Auto-open the proceeded applicant if coming from Assessment
  useEffect(() => {
    if (!currentApplicantNo || employees.length === 0) return;
    const proceededEmployee = employees.find(emp => emp.no === currentApplicantNo);
    if (proceededEmployee) {
      setSelectedEmployee(proceededEmployee);
    }
  }, [currentApplicantNo, employees]);

  // Selection History Page
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
                  Back to Selection
                </button>
                <h1 className="text-2xl font-bold text-custom-teal">Selection History</h1>
              </div>
            </div>

            <div className="p-6">
              <SelectionHistoryTable
                rows={selectionHistory as any}
                getEmployeeInfo={(employeeId) => {
                  const employee = employees.find(e => e.id === employeeId);
                  return {
                    name: employee ? (`${employee.firstName || ''} ${employee.lastName || ''}`.trim() || employee.facebook || 'Unknown') : 'Unknown',
                    position: employee?.positionApplied || '-',
                    dateApplied: employee?.dateApplied || '',
                  };
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Selection Page
  return (
    <div className="flex w-full">
      <div className="flex-1 max-w-full mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col gap-4 p-6 border-b bg-white sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Selection</h1>
              <span aria-label="selection-count" className="inline-flex items-center rounded-full bg-custom-teal/10 text-custom-teal px-2.5 py-0.5 text-xs font-medium border border-custom-teal/30">
                {employees.length}
              </span>
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
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
                      </tr>
                    ))
                  )}

                  {!isLoading && employees
                    .filter(emp =>
                      (`${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase()).includes(search.toLowerCase()) ||
                      (emp.positionApplied?.toLowerCase() || '').includes(search.toLowerCase())
                    ).map((emp) => (
                      <tr
                        key={emp.id}
                        className={`odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition cursor-pointer`}
                        onClick={() => openSidebar(emp)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-custom-teal/10 border border-custom-teal/30 flex items-center justify-center">
                                <span className="text-custom-teal font-semibold">{getUserInitials(emp)}</span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">{`${emp.firstName || ''} ${emp.lastName || ''}`.trim() || emp.facebook || 'Unknown'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">{emp.positionApplied}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatAppliedDate(emp.dateApplied)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            emp.status === 'For Completion' ? 'bg-green-100 text-green-800' :
                            emp.status === 'For Medical' ? 'bg-blue-100 text-blue-800' :
                            emp.status === 'For SBMA Gate Pass' ? 'bg-yellow-100 text-yellow-800' :
                            emp.status === 'For Deployment' ? 'bg-purple-100 text-purple-800' :
                            emp.status === 'Deployed' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                  {!isLoading && employees.filter(emp =>
                    (`${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase()).includes(search.toLowerCase()) ||
                    (emp.positionApplied?.toLowerCase() || '').includes(search.toLowerCase())
                  ).length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <i className="fas fa-user-slash text-gray-400" />
                        </div>
                        <p className="text-sm">No matching applicants found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ApplicantSidebar
        selectedUser={selectedEmployee}
        onClose={closeSidebar}
        onRemoveApplicant={removeEmployee}
      />
    </div>
  );
}