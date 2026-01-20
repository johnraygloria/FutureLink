import { useEffect, useState } from "react";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";
import type { User } from "../../../api/applicant";
import { useNavigation } from "../../../Global/NavigationContext";
import { isSelectionStatus, mapSelectionApplicantRow } from "./utils/selectionUtils";
import SelectionHistoryTable from "./components/SelectionHistoryTable";
import { useSelectionApplicants } from "./hooks/useSelectionApplicants";
import FilterBar from "../../../components/Filters/FilterBar";
import FilterSidebar from "../../../components/Filters/FilterSidebar";
import SelectionToolbar from "./components/SelectionToolbar";
import SelectionTable from "./components/SelectionTable";
import ProcessTimer from "../../../components/ProcessTimer";

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
  const {
    selectedUser: selectedEmployee,
    setSelectedUser: setSelectedEmployee,
    search,
    setSearch,
    users: employees,
    setUsers: setEmployees,
    handleUserClick: openSidebar,
    handleCloseSidebar: closeSidebar,
    handleStatusChangeAndSync,
    removeApplicant: removeEmployee,
    filteredUsers,
    filters,
    activeFilters,
    hasFilters,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    handleApplyFilters,
    handleRemoveFilter,
    handleClearAllFilters,
    handleOpenFilterSidebar,
  } = useSelectionApplicants();
  const [selectionHistory, setSelectionHistory] = useState<SelectionHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentApplicantNo } = useNavigation();

  const handleRemoveEmployee = (employeeId: number) => {
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
      removeEmployee(employeeId);
    }
  };

  // Fetch selection-stage applicants from API
  const refreshData = () => {
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
  };

  useEffect(() => {
    refreshData();

    const onUpdated = (e: any) => {
      const detail = e?.detail || {};
      const { no, status } = detail;
      if (!no) return;
      
      setEmployees(prev => {
        const idx = prev.findIndex(u => u.no === no);
        const allowed = isSelectionStatus(status);
        
        if (idx === -1) {
          // If applicant is new to this section and status matches, refetch data to get full details including clients
          if (allowed) {
            fetch('/api/applicants')
              .then(res => res.json())
              .then((rows: any[]) => {
                const mapped: User[] = rows
                  .filter((r: any) => r.applicant_no === no && isSelectionStatus(r.status))
                  .map(mapSelectionApplicantRow);
                if (mapped.length > 0) {
                  setEmployees(prevEmps => {
                    const exists = prevEmps.find(e => e.no === no);
                    if (!exists) {
                      return [...prevEmps, ...mapped];
                    }
                    return prevEmps;
                  });
                }
              })
              .catch(console.error);
          }
          return prev;
        }
        
        // Preserve all existing fields including clients when updating status
        const updated = [...prev];
        updated[idx] = { ...updated[idx], status } as any;
        return updated;
      });
    };
    
    window.addEventListener('applicant-updated', onUpdated);
    
    return () => {
      window.removeEventListener('applicant-updated', onUpdated);
    };
  }, []);

  // Auto-open the proceeded applicant if coming from Assessment
  useEffect(() => {
    if (!currentApplicantNo || employees.length === 0) return;
    const proceededEmployee = employees.find(emp => emp.no === currentApplicantNo);
    if (proceededEmployee) {
      setSelectedEmployee(proceededEmployee);
    }
  }, [currentApplicantNo, employees, setSelectedEmployee]);

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
        <div className="bg-white max-w-[77vw] rounded-2xl shadow-lg overflow-hidden">
          {/* Timer and Filter Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <ProcessTimer 
              processName="Selection" 
              duration={7}
              onTimerComplete={refreshData}
            />
            <FilterBar
              activeFilters={activeFilters}
              onOpenFilters={handleOpenFilterSidebar}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
          </div>

          {/* Toolbar */}
          <SelectionToolbar
            search={search}
            setSearch={setSearch}
            usersCount={employees.length}
            showHistory={showHistory}
            setShowHistory={setShowHistory}
          />

          {/* Table */}
          <div className="p-0">
            <SelectionTable
              users={filteredUsers}
              selectedUser={selectedEmployee}
              onUserClick={openSidebar}
              isLoading={isLoading}
              hasActiveFilters={hasFilters}
            />
          </div>
        </div>
      </div>

      <ApplicantSidebar
        selectedUser={selectedEmployee}
        onClose={closeSidebar}
        onStatusChange={handleStatusChangeAndSync}
        onRemoveApplicant={handleRemoveEmployee}
      />

      {/* Filter Sidebar Modal */}
      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        users={employees}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearAllFilters}
      />
    </div>
  );
}