import { useState, useEffect, useMemo, useCallback } from 'react';
import * as XLSX from 'xlsx';
import Filters from './components/filter';
import ActionsBar from './components/action';
import ImportExcelModal from './components/ImportExcelModal';
import { useNavigation } from '../../../Global/NavigationContext';
import ApplicantTable from './components/applicanttab';
import type { GoogleSheetApplicant } from './hook/googlesheettab';
import FilterSidebar from '../../../components/Filters/FilterSidebar';
import FilterBar from '../../../components/Filters/FilterBar';
import PipelinePageShell from '../../../components/Pipeline/PipelinePageShell';
import PipelineModuleHeader from '../../../components/Pipeline/PipelineModuleHeader';
import PipelineStatCard from '../../../components/Pipeline/PipelineStatCard';
import {
  initialFilters,
  applyFilters,
  filtersToActiveFilters,
  hasActiveFilters as checkHasActiveFilters,
  type FilterCriteria,
  type ActiveFilter
} from '../../../components/Filters/filterUtils';
import type { User } from '../../../api/applicant';
import { useTableSort } from '../../../components/Tables/useTableSort';
import type { SortColumnMap } from '../../../components/Tables/tableSort';

// Only the non-string columns need config; every other header key falls back
// to reading the row's own key as a natural string.
const RECRUITMENT_SORT_COLUMNS: SortColumnMap<GoogleSheetApplicant> = {
  'DATE OF BIRTH': { accessor: (a) => a['DATE OF BIRTH'], type: 'date' },
  'DATE APPLIED': { accessor: (a) => a['DATE APPLIED'], type: 'date' },
  'AGE': { accessor: (a) => a['AGE'], type: 'number' },
};

const mapApplicantRow = (r: any): GoogleSheetApplicant => ({
  NO: r.applicant_no || '',
  "REFFERED BY": r.referred_by || '',
  "LAST NAME": r.last_name || '',
  "FIRST NAME": r.first_name || '',
  EXT: r.ext || '',
  MIDDLE: r.middle_name || '',
  GENDER: r.gender || '',
  SIZE: r.size || '',
  "DATE OF BIRTH": r.date_of_birth || '',
  "DATE APPLIED": r.date_applied || '',
  "FB NAME": r.fb_name || '',
  AGE: r.age || '',
  LOCATION: r.location || '',
  "CONTACT NUMBER": r.contact_number || '',
  EMAIL: r.email || '',
  "POSITION APPLIED FOR": r.position_applied_for || '',
  EXPERIENCE: r.experience || '',
  PRINCIPAL: Array.isArray(r.principals) ? r.principals.join(', ') : (Array.isArray(r.clients) ? r.clients.join(', ') : (r.principals || r.clients || '')),
  STATUS: r.status || '',
  "REQUIREMENTS STATUS": r.requirements_status || '',
  "FINAL INTERVIEW STATUS": r.final_interview_status || '',
  "MEDICAL STATUS": r.medical_status || '',
  "STATUS REMARKS": r.status_remarks || '',
  "APPLICANT REMARKS": r.applicant_remarks || '',
  // Keep the original fields for table display
  POSITION: r.position_applied_for || '',
} as GoogleSheetApplicant);

function RecruitmentDatabase() {
  const [applicants, setApplicants] = useState<GoogleSheetApplicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<GoogleSheetApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(new Set());
  const { setActiveSection, setCurrentApplicantNo } = useNavigation();

  // Advanced Filtering State
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCriteria>(initialFilters);

  // Bulk Excel import
  const [isImportOpen, setIsImportOpen] = useState(false);

  const loadApplicants = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    try {
      const res = await fetch('/api/applicants');
      if (!res.ok) throw new Error('Failed to fetch applicants');
      const rows = await res.json();
      const mapped: GoogleSheetApplicant[] = rows.map(mapApplicantRow);
      setApplicants(mapped);
      setFilteredApplicants(mapped);
      setError(null);
    } catch {
      setError('Server is not available. Please make sure the backend server is running.');
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, []);

  // Transform GoogleSheetApplicant to User type for filtering
  const mappedUsersForFiltering = useMemo(() => {
    return applicants.map(app => ({
      id: app["NO"],
      gender: app["GENDER"],
      size: app["SIZE"],
      location: app["LOCATION"],
      experience: app["EXPERIENCE"],
      positionApplied: app["POSITION APPLIED FOR"],
      referredBy: app["REFFERED BY"],
      age: app["AGE"],
      status: app["STATUS"],
      firstName: app["FIRST NAME"],
      lastName: app["LAST NAME"],
      dateApplied: app["DATE APPLIED"],
    } as User));
  }, [applicants]);

  useEffect(() => {
    loadApplicants();
  }, [loadApplicants]);

  useEffect(() => {
    let filtered = applicants;

    // 1. Basic Status Filter
    if (statusFilter !== '') {
      filtered = filtered.filter(applicant =>
        applicant["STATUS"] === statusFilter
      );
    }

    // 2. Search Filter
    if (searchTerm !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(applicant => {
        const firstName = String(applicant["FIRST NAME"] || '').toLowerCase();
        const lastName = String(applicant["LAST NAME"] || '').toLowerCase();
        const applicantNo = String(applicant["NO"] || '').toLowerCase();

        return firstName.includes(searchLower) ||
          lastName.includes(searchLower) ||
          applicantNo.includes(searchLower);
      });
    }

    // 3. Advanced Sidebar Filters
    if (checkHasActiveFilters(filters)) {
      // Use the mapped users to determine which IDs pass the advanced filters
      const allowedUsers = applyFilters(mappedUsersForFiltering, filters);
      const allowedIds = new Set(allowedUsers.map(u => u.id));

      filtered = filtered.filter(app => allowedIds.has(app["NO"]));
    }

    setFilteredApplicants(filtered);
  }, [statusFilter, searchTerm, applicants, filters, mappedUsersForFiltering]);

  // Sort downstream of filtering; sortedRows also drives the Excel export so
  // the file matches the on-screen order.
  const { sortedRows, sortState, toggleSort } = useTableSort(filteredApplicants, RECRUITMENT_SORT_COLUMNS);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredApplicants.map(applicant => applicant["NO"]));
      setSelectedApplicants(allIds);
    } else {
      setSelectedApplicants(new Set());
    }
  };

  const handleSelectApplicant = (applicantId: string, checked: boolean) => {
    const newSelected = new Set(selectedApplicants);
    if (checked) {
      newSelected.add(applicantId);
    } else {
      newSelected.delete(applicantId);
    }
    setSelectedApplicants(newSelected);
  };

  const handleAction = async (action: string) => {
    if (action === 'Export to Excel') {
      exportToExcel();
      return;
    }

    if (action === 'Import Excel') {
      setIsImportOpen(true);
      return;
    }

    if (selectedApplicants.size === 0) {
      alert('Please select at least one applicant');
      return;
    }

    const selectedIds = Array.from(selectedApplicants);
    // Map "stage" actions to a status value that each module accepts (see utils/*Utils.ts).
    const toStatusMap: Record<string, string> = {
      Screening: 'For Screening',
      Assessment: 'Initial Interview',
      Selection: 'For Medical',
      Engagement: 'On Boarding',
    };
    const targetStatus = toStatusMap[action];
    if (!targetStatus) {
      alert('Unknown action. Please try again.');
      return;
    }

    const historyEndpointByAction: Record<string, string> = {
      Screening: '/api/applicants/screening-history',
      Assessment: '/api/applicants/assessment-history',
      Selection: '/api/applicants/selection-history',
      Engagement: '/api/applicants/engagement-history',
    };
    const historyEndpoint = historyEndpointByAction[action] || '/api/applicants/screening-history';

    try {
      // Update status in backend for each selected applicant
      await Promise.all(selectedIds.map(async (no) => {
        await fetch('/api/applicants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ NO: no, STATUS: targetStatus })
        });
        // Log movement in history
        try {
          await fetch(historyEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              applicant_no: no,
              action: `Moved to ${action}`,
              status: targetStatus,
              notes: '',
            })
          });
        } catch { }
      }));

      // Set navigation to the appropriate section and open the first selected
      const firstNo = selectedIds[0];
      if (firstNo) setCurrentApplicantNo(firstNo);
      if (action === 'Screening') setActiveSection('screening' as any);
      else if (action === 'Assessment') setActiveSection('assessment' as any);
      else if (action === 'Selection') setActiveSection('selection' as any);
      else setActiveSection('engagement' as any);

      // Clear selection and refresh list
      setSelectedApplicants(new Set());
      setStatusFilter('');
      setSearchTerm('');
      await loadApplicants({ silent: true });
    } catch (e) {
      alert('Failed to update applicants. Please try again.');
    }
  };

  const exportToExcel = () => {
    // Define the column order as specified
    const columns = [
      'NO', 'REFFERED BY', 'LAST NAME', 'FIRST NAME', 'EXT', 'MIDDLE', 'GENDER', 'SIZE',
      'DATE OF BIRTH', 'DATE APPLIED', 'FB NAME', 'AGE', 'LOCATION', 'CONTACT NUMBER', 'EMAIL',
      'POSITION APPLIED FOR', 'EXPERIENCE', 'PRINCIPAL', 'STATUS', 'REQUIREMENTS STATUS',
      'FINAL INTERVIEW STATUS', 'MEDICAL STATUS', 'STATUS REMARKS', 'APPLICANT REMARKS'
    ];

    // Prepare data for export
    const exportData = sortedRows.map(applicant => {
      const row: Record<string, string> = {};
      columns.forEach(column => {
        row[column] = (applicant as any)[column] || '';
      });
      return row;
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = columns.map(col => ({ wch: Math.max(col.length, 15) }));
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Recruitment Database');

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `Recruitment_Database_${currentDate}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  };

  // State handlers for Advanced Filters
  const handleApplyFilters = (newFilters: FilterCriteria) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const activeFilters = filtersToActiveFilters(filters);
  const handleRemoveFilter = (activeFilter: ActiveFilter) => {
    const { field, value } = activeFilter;
    const newFilters = { ...filters };
    if (field === 'gender') newFilters.gender = newFilters.gender.filter(v => v !== value);
    else if (field === 'size') newFilters.size = newFilters.size.filter(v => v !== value);
    else if (field === 'location') newFilters.location = newFilters.location.filter(v => v !== value);
    else if (field === 'experience') newFilters.experience = newFilters.experience.filter(v => v !== value);
    else if (field === 'positionApplied') newFilters.positionApplied = newFilters.positionApplied.filter(v => v !== value);
    else if (field === 'referredBy') newFilters.referredBy = newFilters.referredBy.filter(v => v !== value);
    else if (field === 'status') newFilters.status = newFilters.status.filter(v => v !== value);
    else if (field === 'age') newFilters.age = {};

    setFilters(newFilters);
  };

  // Get all unique status options from the dataset for the sidebar
  const allStatusOptions = useMemo(() => Array.from(new Set(applicants.map(a => a.STATUS))).filter(Boolean).sort(), [applicants]);

  return (
    <PipelinePageShell fullHeight className="flex flex-col">
      <PipelineModuleHeader
        title="Recruitment Database"
        subtitle="Central repository of all applicants across every pipeline stage."
        count={applicants.length}
        filteredCount={filteredApplicants.length !== applicants.length ? filteredApplicants.length : undefined}
        icon="fa-database"
      />

      <div className="px-5 sm:px-6 py-4 border-b border-white/10 bg-[#0a0f16]/80 space-y-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 flex-1">
            <PipelineStatCard label="Total Records" value={applicants.length} icon="fa-users" accent="primary" />
            <PipelineStatCard label="Filtered View" value={filteredApplicants.length} icon="fa-filter" accent="info" />
            <PipelineStatCard label="Selected" value={selectedApplicants.size} icon="fa-check-square" accent="success" />
          </div>
          <button
            onClick={() => setIsFilterSidebarOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary/15 hover:bg-primary/25 text-primary-light rounded-xl transition-all text-sm font-semibold border border-primary/25 active:scale-95 shrink-0"
          >
            <i className="fas fa-sliders" />
            Advanced Filters
          </button>
        </div>

        <Filters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
        />

        {checkHasActiveFilters(filters) && (
          <FilterBar
            embedded
            activeFilters={activeFilters}
            onOpenFilters={() => setIsFilterSidebarOpen(true)}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearFilters}
          />
        )}

        <ActionsBar
          selectedCount={selectedApplicants.size}
          onAction={handleAction}
        />
      </div>

      <div className="flex-1 overflow-hidden relative">
        {error && (
          <div className="m-5 bg-danger/10 text-danger border border-danger/20 p-4 rounded-xl flex items-center gap-3">
            <i className="fas fa-exclamation-circle text-xl"></i>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
            <p className="text-text-secondary font-medium animate-pulse">Loading database records...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-danger/80">
            <i className="fas fa-server text-4xl mb-2"></i>
            <p className="font-medium">Failed to load data</p>
          </div>
        ) : (
          <ApplicantTable
            applicants={sortedRows}
            selectedApplicants={selectedApplicants}
            onSelectAll={handleSelectAll}
            onSelectApplicant={handleSelectApplicant}
            sortState={sortState}
            onToggleSort={toggleSort}
          />
        )}
      </div>

      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        users={mappedUsersForFiltering}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        statusOptions={allStatusOptions}
      />

      <ImportExcelModal
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImported={() => loadApplicants({ silent: true })}
      />
    </PipelinePageShell>
  );
}

export default RecruitmentDatabase;
