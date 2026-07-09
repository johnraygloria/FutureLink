import { useEffect, useState } from "react";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";
import type { User } from "../../../api/applicant";
import { useNavigation } from "../../../Global/NavigationContext";
import { isSelectionStatus, mapSelectionApplicantRow } from "./utils/selectionUtils";
import SelectionHistoryTable from "./components/SelectionHistoryTable";
import { useSelectionApplicants } from "./hooks/useSelectionApplicants";
import FilterBar from "../../../components/Filters/FilterBar";
import FilterSidebar from "../../../components/Filters/FilterSidebar";
import SelectionTable from "./components/SelectionTable";
import ProcessTimer from "../../../components/ProcessTimer";
import PipelinePageShell from "../../../components/Pipeline/PipelinePageShell";
import PipelineModuleHeader from "../../../components/Pipeline/PipelineModuleHeader";
import PipelineActionBar from "../../../components/Pipeline/PipelineActionBar";
import PipelineControlStrip from "../../../components/Pipeline/PipelineControlStrip";
import PipelineHistoryShell from "../../../components/Pipeline/PipelineHistoryShell";

interface SelectionHistory {
  id: number;
  employeeId: number;
  date: string;
  stage: 'Medical Referral' | 'Trade Test' | 'Biometrics' | 'Medical Clearance' | 'Orientation' | 'SBMA Processing' | 'Gate Pass Issued';
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
  const { currentApplicantNo, setCurrentApplicantNo } = useNavigation();

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
  const refreshData = (silent = false) => {
    if (!silent) setIsLoading(true);
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
      .finally(() => {
        if (!silent) setIsLoading(false);
      });
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
          // If applicant is new to this section and status matches, fetch just
          // that one applicant (server-side ?NO= filter) to get full details.
          if (allowed) {
            fetch(`/api/applicants?NO=${encodeURIComponent(no)}`)
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
        if (!allowed) {
          return prev.filter(u => u.no !== no);
        }
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...detail } as any;
        return updated;
      });

      // Also update selectedEmployee if it's the one that was updated
      setSelectedEmployee(prev => {
        if (prev && prev.no === no) {
          return { ...prev, ...detail };
        }
        return prev;
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
      setCurrentApplicantNo(undefined);
    }
  }, [currentApplicantNo, employees, setSelectedEmployee, setCurrentApplicantNo]);

  // Keep selectedEmployee in sync when employees list is refreshed in the background
  useEffect(() => {
    if (selectedEmployee) {
      const updated = employees.find(e => e.no === selectedEmployee.no);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedEmployee)) {
        setSelectedEmployee(updated);
      }
    }
  }, [employees, selectedEmployee?.no]);

  // Selection History Page
  if (showHistory) {
    return (
      <PipelineHistoryShell
        title="Selection History"
        backLabel="Back to Selection"
        onBack={() => setShowHistory(false)}
      >
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
      </PipelineHistoryShell>
    );
  }

  return (
    <>
      <PipelinePageShell>
        <PipelineModuleHeader
          title="Selection"
          subtitle="Manage medical clearance, biometrics, and deployment preparation."
          count={employees.length}
          filteredCount={hasFilters ? filteredUsers.length : undefined}
          icon="fa-list-check"
        />

        <PipelineControlStrip
          timer={
            <ProcessTimer
              processName="Selection"
              duration={5}
              onTimerComplete={() => refreshData(true)}
            />
          }
          filters={
            <FilterBar
              embedded
              activeFilters={activeFilters}
              onOpenFilters={handleOpenFilterSidebar}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
          }
        />

        <PipelineActionBar
          search={search}
          setSearch={setSearch}
          onViewHistory={() => setShowHistory(true)}
        />

        <SelectionTable
          users={filteredUsers}
          selectedUser={selectedEmployee}
          onUserClick={openSidebar}
          isLoading={isLoading}
          hasActiveFilters={hasFilters}
        />
      </PipelinePageShell>

      <ApplicantSidebar
        selectedUser={selectedEmployee}
        onClose={closeSidebar}
        onStatusChange={handleStatusChangeAndSync}
        onRemoveApplicant={handleRemoveEmployee}
      />

      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        users={employees}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearAllFilters}
      />
    </>
  );
}
