import { useState } from "react";
// import { IconArrowLeft, IconDatabase } from "@tabler/icons-react";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";
import type { Employee } from "../../../api/employee";

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

const initialEmployees: Employee[] = [
  { id: 1, name: "John Ray Gloria", sex: "Male", birthday: "1990-01-15", dateApplied: "2024-06-01", phone: "09171234567", position: "Welder", status: "In Progress" },
  { id: 2, name: "Rey John Ebe", sex: "Male", birthday: "1988-05-22", dateApplied: "2024-06-03", phone: "09179876543", position: "Electrician", status: "Scheduled" },
];

const initialSelectionHistory: SelectionHistory[] = [
  {
    id: 1,
    employeeId: 1,
    date: "2024-06-15",
    stage: "Medical Referral",
    status: "Completed",
    facilitator: "HR Coordinator",
    notes: "Medical referral slip issued. Employee scheduled for medical examination.",
    documents: ["Medical Referral Slip"],
    nextDeadline: "2024-06-22"
  },
  {
    id: 2,
    employeeId: 1,
    date: "2024-06-20",
    stage: "Trade Test",
    status: "Completed",
    facilitator: "Technical Supervisor",
    notes: "Welding skills assessment passed with excellent results. Employee demonstrates advanced techniques.",
    documents: ["Trade Test Results", "Skills Assessment Report"],
    nextDeadline: "2024-06-25"
  },
  {
    id: 3,
    employeeId: 1,
    date: "2024-06-22",
    stage: "Medical Clearance",
    status: "Completed",
    facilitator: "Medical Officer",
    notes: "All medical tests passed. Employee cleared for work assignment.",
    documents: ["Medical Certificate", "Health Declaration"],
    nextDeadline: "2024-06-28"
  },
  {
    id: 4,
    employeeId: 1,
    date: "2024-06-25",
    stage: "Orientation",
    status: "Scheduled",
    facilitator: "Training Coordinator",
    notes: "Orientation scheduled for next week. Safety protocols and company policies will be covered.",
    documents: ["Orientation Schedule"],
    nextDeadline: "2024-07-02"
  },
  {
    id: 5,
    employeeId: 2,
    date: "2024-06-18",
    stage: "Medical Referral",
    status: "Completed",
    facilitator: "HR Coordinator",
    notes: "Medical referral issued. Employee completed initial screening.",
    documents: ["Medical Referral Slip"],
    nextDeadline: "2024-06-25"
  },
  {
    id: 6,
    employeeId: 2,
    date: "2024-06-23",
    stage: "Trade Test",
    status: "In Progress",
    facilitator: "Technical Supervisor",
    notes: "Electrical skills assessment in progress. Employee showing good technical knowledge.",
    documents: ["Trade Test Schedule"],
    nextDeadline: "2024-06-30"
  }
];

const selectionItems = [
  { key: "medical", label: "pre-employment medical (get medical referral slip)" },
  { key: "tradeTest", label: "trade test for seer then pre-employment medical (get medical referral slip)" },
  { key: "waitText", label: "wait for our text/call" },
  { key: "orientation", label: "Orientation" },
  { key: "sbma", label: "SBMA ID & GATE PASS" },
];

const GoogleSheetsStatus = ({ isConnected, loading, error, lastSyncTime, onRetry, onManualSync }: any) => (
  <div className="p-2 border rounded bg-gray-50 text-xs">
    <span>Status: {isConnected ? "Connected" : "Disconnected"}</span>
    {loading && <span className="ml-2">Loading...</span>}
    {error && <span className="ml-2 text-red-500">Error!</span>}
    {lastSyncTime && <span className="ml-2">Last Sync: {lastSyncTime}</span>}
    <button className="ml-2 px-2 py-1 bg-custom-teal text-white rounded" onClick={onRetry}>Retry</button>
    <button className="ml-2 px-2 py-1 bg-custom-teal text-white rounded" onClick={onManualSync}>Manual Sync</button>
  </div>
);

export default function SelectionEmployees() {
  const [employees] = useState<Employee[]>(initialEmployees);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeSelection, setEmployeeSelection] = useState<Record<number, Record<string, boolean>>>({});
  const [search, setSearch] = useState("");
  const [selectionHistory, setSelectionHistory] = useState<SelectionHistory[]>(initialSelectionHistory);
  const [showHistory, setShowHistory] = useState(false);

  const [isConnected] = useState(true);
  const [loading] = useState(false);
  const [error] = useState(false);
  const [lastSyncTime] = useState<string | null>(null);

  const openSidebar = (emp: Employee) => {
    setSelectedEmployee(emp);
    setSidebarOpen(true);
  };
  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedEmployee(null);
  };

  const getChecked = (key: string) => {
    if (!selectedEmployee) return false;
    return employeeSelection[selectedEmployee.id]?.[key] || false;
  };
  const handleCheckboxChange = (key: string, checked: boolean) => {
    if (!selectedEmployee) return;
    setEmployeeSelection((prev) => ({
      ...prev,
      [selectedEmployee.id]: {
        ...prev[selectedEmployee.id],
        [key]: checked,
      },
    }));
  };

  const getProgress = (emp: Employee) => {
    const selections = employeeSelection[emp.id] || {};
    const completedCount = selectionItems.filter((item) => selections[item.key]).length;
    const totalCount = selectionItems.length;
    const progressPercentage = (completedCount / totalCount) * 100;
    return { completedCount, totalCount, progressPercentage };
  };

  const getEmployeeHistory = (employeeId: number) => {
    return selectionHistory.filter(history => history.employeeId === employeeId);
  };

  const getLatestStage = (employeeId: number) => {
    const history = getEmployeeHistory(employeeId);
    if (history.length === 0) return "Not Started";
    const latest = history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    return latest.stage;
  };

  const getCompletedStages = (employeeId: number) => {
    const history = getEmployeeHistory(employeeId);
    return history.filter(h => h.status === 'Completed').length;
  };

  const getTotalStages = () => {
    return 6; // Total number of selection stages
  };

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
                    {selectionHistory.map((history) => {
                      const employee = employees.find(e => e.id === history.employeeId);
                      return (
                        <tr key={history.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{employee?.name || 'Unknown'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee?.position || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee?.dateApplied || history.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              history.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              history.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              history.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                              history.status === 'Failed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {history.status}
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
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
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button className="px-4 py-2 rounded-lg bg-custom-teal/10 text-black font-semibold shadow-sm focus:outline-none border border-custom-teal/80">
                Selection <span className="ml-1 bg-indigo-100 text-custom-teal rounded px-2 py-0.5 text-xs font-bold">{employees.length}</span>
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-green-800 cursor-pointer text-white font-semibold shadow-sm focus:outline-none border border-green-700 ml-2"
                onClick={() => window.open('https://docs.google.com/spreadsheets/d/1Iwz2TJ6We1FtIL4BhEnDW_qlt5Q7f2aAIX2fn2SDqUQ/edit?gid=0#gid=0', '_blank')}
              >
                Open Google Sheet
                </button>
              </div>
              <button
                onClick={() => setShowHistory(true)}
                className="px-4 py-2 rounded-lg bg-orange-600 text-white font-semibold shadow-sm focus:outline-none border border-orange-700"
              >
                View Selection History
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <i className="fas fa-search" />
              </span>
              <input
                type="text"
                placeholder="Search employee"
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Stage</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed Stages</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {employees.filter(emp =>
                    emp.name.toLowerCase().includes(search.toLowerCase()) ||
                    emp.position.toLowerCase().includes(search.toLowerCase())
                  ).map((emp) => {
                    const { completedCount, totalCount, progressPercentage } = getProgress(emp);
                    const currentStage = getLatestStage(emp.id);
                    const completedStages = getCompletedStages(emp.id);
                    const totalStages = getTotalStages();
                    return (
                      <tr
                        key={emp.id}
                        className={`hover:bg-indigo-50 transition cursor-pointer`}
                        onClick={() => openSidebar(emp)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-custom-teal flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {emp.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">{emp.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">{emp.position}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{currentStage}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{completedStages}/{totalStages}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-custom-teal h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">
                              {completedCount}/{totalCount}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ApplicantSidebar
        selectedUser={selectedEmployee}
        onClose={closeSidebar}
      />
    </div>
  );
}