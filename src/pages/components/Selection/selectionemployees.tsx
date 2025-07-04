import { useState } from "react";
import { IconArrowLeft, IconDatabase } from "@tabler/icons-react";
import ApplicantSidebar from "../applicants/ApplicantSidebar";

// Define Employee type
interface Employee {
  id: number;
  name: string;
  sex: string;
  birthday: string;
  dateApplied: string;
  phone: string;
  position: string;
}

const initialEmployees: Employee[] = [
  { id: 1, name: "John Ray Gloria", sex: "Male", birthday: "1990-01-15", dateApplied: "2024-06-01", phone: "09171234567", position: "Welder" },
  { id: 2, name: "Rey John Ebe", sex: "Male", birthday: "1988-05-22", dateApplied: "2024-06-03", phone: "09179876543", position: "Electrician" },
];

const selectionItems = [
  { key: "medical", label: "pre-employment medical (get medical referral slip)" },
  { key: "tradeTest", label: "trade test for seer then pre-employment medical (get medical referral slip)" },
  { key: "waitText", label: "wait for our text/call" },
  { key: "orientation", label: "Orientation" },
  { key: "sbma", label: "SBMA ID & GATE PASS" },
];

// Dummy GoogleSheetsStatus component for placeholder
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

  const handleRetry = () => {};
  const handleManualSync = () => {};

  return (
    <div className="flex w-full">
      <div className="flex-1 max-w-full mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div className="flex space-x-2">
              <button className="px-4 py-2 rounded-lg bg-custom-teal/10 text-black font-semibold shadow-sm focus:outline-none border border-custom-teal/80">
                Selection <span className="ml-1 bg-indigo-100 text-custom-teal rounded px-2 py-0.5 text-xs font-bold">{employees.length}</span>
              </button>
              <button
                className="px-4 py-2 cursor-pointer rounded-lg bg-custom-teal text-white font-semibold shadow-sm focus:outline-none border border-custom-teal ml-2"
                onClick={() => alert('Input Data (placeholder)')}
              >
                Input Data
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-green-800 cursor-pointer text-white font-semibold shadow-sm focus:outline-none border border-green-700 ml-2"
                onClick={() => window.open('https://docs.google.com/spreadsheets/d/1Iwz2TJ6We1FtIL4BhEnDW_qlt5Q7f2aAIX2fn2SDqUQ/edit?gid=0#gid=0', '_blank')}
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {employees.filter(emp =>
                    emp.name.toLowerCase().includes(search.toLowerCase()) ||
                    emp.position.toLowerCase().includes(search.toLowerCase())
                  ).map((emp) => {
                    const { completedCount, totalCount, progressPercentage } = getProgress(emp);
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