import { useState } from "react";
import { IconArrowLeft, IconDatabase } from "@tabler/icons-react";

// Define Employee type
interface Employee {
  id: number;
  name: string;
  position: string;
}

const initialEmployees: Employee[] = [
  { id: 1, name: "Juan Dela Cruz", position: "Welder" },
  { id: 2, name: "Maria Santos", position: "Electrician" },
  { id: 3, name: "Pedro Reyes", position: "Plumber" },
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

  // Dummy Google Sheets status state
  const [isConnected] = useState(true);
  const [loading] = useState(false);
  const [error] = useState(false);
  const [lastSyncTime] = useState<string | null>(null);

  // Open sidebar for employee
  const openSidebar = (emp: Employee) => {
    setSelectedEmployee(emp);
    setSidebarOpen(true);
  };
  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedEmployee(null);
  };

  // Checkbox logic
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

  // Progress calculation
  const getProgress = (emp: Employee) => {
    const selections = employeeSelection[emp.id] || {};
    const completedCount = selectionItems.filter((item) => selections[item.key]).length;
    const totalCount = selectionItems.length;
    const progressPercentage = (completedCount / totalCount) * 100;
    return { completedCount, totalCount, progressPercentage };
  };

  // Dummy handlers for GoogleSheetsStatus
  const handleRetry = () => {};
  const handleManualSync = () => {};

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Selection Employees</h1>
      </div>

      {/* Google Sheets Status */}
      <div className="mb-6">
        <GoogleSheetsStatus
          isConnected={isConnected}
          loading={loading}
          error={error}
          lastSyncTime={lastSyncTime}
          onRetry={handleRetry}
          onManualSync={handleManualSync}
        />
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Position</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => {
            const { completedCount, totalCount, progressPercentage } = getProgress(emp);
            return (
              <tr
                key={emp.id}
                className="cursor-pointer hover:bg-custom-teal/10 transition"
                onClick={() => openSidebar(emp)}
              >
                <td className="py-2 px-4 border-b">{emp.name}</td>
                <td className="py-2 px-4 border-b">{emp.position}</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-custom-teal h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {completedCount}/{totalCount}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 bg-opacity-20 backdrop-blur-[1px] transition-opacity duration-300 z-30 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeSidebar}
      />
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-2xl z-40 flex flex-col transform transition-transform duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ maxWidth: '48vw' }}
      >
        <div className="bg-white border-l border-gray-200 shadow-2xl flex flex-col h-full relative">
          <div className="absolute left-0 top-0 h-full w-2 bg-custom-teal rounded-l-xl" />
          <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0 relative z-10">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={closeSidebar}
                  className="flex items-center gap-2 text-custom-teal hover:bg-custom-teal/10 hover:text-white rounded-lg px-3 py-2 transition-all duration-200"
                  title="Close sidebar"
                >
                  <IconArrowLeft size={20} />
                </button>
                <div className="h-6 w-px bg-gray-300" />
                <div className="flex items-center gap-3">
                  {selectedEmployee && (
                    <div className="h-12 w-12 rounded-full border-4 border-custom-teal bg-custom-teal flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">{selectedEmployee.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}</span>
                    </div>
                  )}
                  <div>
                    <h1 className="text-xl text-custom-teal font-bold leading-tight">{selectedEmployee?.name}</h1>
                    <p className=" text-sm font-medium">{selectedEmployee?.position}</p>
                  </div>
                </div>
              </div>
              {isConnected && (
                <div className="flex items-center gap-2 text-green-600">
                  <IconDatabase size={16} />
                  <span className="text-sm">Auto-sync enabled</span>
                </div>
              )}
            </div>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6 space-y-6">
              {selectedEmployee && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-custom-teal/20 shadow-sm">
                    <h2 className="text-base font-semibold text-custom-teal mb-3">Selection</h2>
                    <div className="space-y-3">
                      {selectionItems.map((item) => (
                        <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={getChecked(item.key)}
                            onChange={e => handleCheckboxChange(item.key, e.target.checked)}
                            className="rounded border-gray-300 text-custom-teal focus:ring-custom-teal"
                          />
                          <span className="text-sm">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}