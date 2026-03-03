import { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import Filters from './components/filter';
import ActionsBar from './components/action';
import { useNavigation } from '../../../Global/NavigationContext';
import ApplicantTable from './components/applicanttab';
import type { GoogleSheetApplicant } from './hook/googlesheettab';
import FilterSidebar from '../../../components/Filters/FilterSidebar';
import FilterBar from '../../../components/Filters/FilterBar';
import {
  initialFilters,
  applyFilters,
  filtersToActiveFilters,
  hasActiveFilters as checkHasActiveFilters,
  type FilterCriteria,
  type ActiveFilter
} from '../../../components/Filters/filterUtils';
import type { User } from '../../../api/applicant';

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
    setLoading(true);
    fetch('/api/applicants')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch applicants');
        return res.json();
      })
      .then((rows) => {
        // Map MySQL rows to include all required fields for Excel export
        const mapped: GoogleSheetApplicant[] = rows.map((r: any) => ({
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
          "POSITION APPLIED FOR": r.position_applied_for || '',
          EXPERIENCE: r.experience || '',
          CLIENTS: Array.isArray(r.clients) ? r.clients.join(', ') : (r.clients || ''),
          STATUS: r.status || '',
          "REQUIREMENTS STATUS": r.requirements_status || '',
          "FINAL INTERVIEW STATUS": r.final_interview_status || '',
          "MEDICAL STATUS": r.medical_status || '',
          "STATUS REMARKS": r.status_remarks || '',
          "APPLICANT REMARKS": r.applicant_remarks || '',
          // Keep the original fields for table display
          POSITION: r.position_applied_for || '',
        }));
        setApplicants(mapped);
        setFilteredApplicants(mapped);
        setLoading(false);
      })
      .catch(() => {
        setError('Server is not available. Please make sure the backend server is running.');
        setLoading(false);
      });
  }, []);

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

    if (selectedApplicants.size === 0) {
      alert('Please select at least one applicant');
      return;
    }

    const selectedIds = Array.from(selectedApplicants);
    const toStatusMap: Record<string, string> = {
      'Screening': 'For Screening',
      'Assessment': 'For Final Interview/For Assessment',
      'Final Interview': 'For Final Interview/For Assessment',
      'Medical': 'For Medical',
      'SBMA Gate Pass': 'For SBMA Gate Pass',
      'Deployment': 'For Deployment',
    };
    const targetStatus = toStatusMap[action];

    try {
      // Update status in backend for each selected applicant
      await Promise.all(selectedIds.map(async (no) => {
        await fetch('/api/applicants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ NO: no, STATUS: targetStatus })
        });
        // Log movement in history where relevant
        try {
          await fetch('/api/applicants/screening-history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              applicant_no: no,
              action: action === 'Screening' ? 'Returned to Screening' : `Proceeded to ${action}`,
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
      else if (action === 'Assessment' || action === 'Final Interview') setActiveSection('assessment' as any);
      else setActiveSection('engagement' as any);

      // Clear selection and refresh list
      setSelectedApplicants(new Set());
      setStatusFilter('');
      setSearchTerm('');
      // refetch to reflect changes
      const res = await fetch('/api/applicants');
      if (res.ok) {
        const rows = await res.json();
        const mapped: GoogleSheetApplicant[] = rows.map((r: any) => ({
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
          "POSITION APPLIED FOR": r.position_applied_for || '',
          EXPERIENCE: r.experience || '',
          CLIENTS: Array.isArray(r.clients) ? r.clients.join(', ') : (r.clients || ''),
          STATUS: r.status || '',
          "REQUIREMENTS STATUS": r.requirements_status || '',
          "FINAL INTERVIEW STATUS": r.final_interview_status || '',
          "MEDICAL STATUS": r.medical_status || '',
          "STATUS REMARKS": r.status_remarks || '',
          "APPLICANT REMARKS": r.applicant_remarks || '',
          POSITION: r.position_applied_for || '',
        }));
        setApplicants(mapped);
        setFilteredApplicants(mapped);
      }
    } catch (e) {
      alert('Failed to update applicants. Please try again.');
    }
  };

  const exportToExcel = () => {
    // Define the column order as specified
    const columns = [
      'NO', 'REFFERED BY', 'LAST NAME', 'FIRST NAME', 'EXT', 'MIDDLE', 'GENDER', 'SIZE',
      'DATE OF BIRTH', 'DATE APPLIED', 'FB NAME', 'AGE', 'LOCATION', 'CONTACT NUMBER',
      'POSITION APPLIED FOR', 'EXPERIENCE', 'CLIENTS', 'STATUS', 'REQUIREMENTS STATUS',
      'FINAL INTERVIEW STATUS', 'MEDICAL STATUS', 'STATUS REMARKS', 'APPLICANT REMARKS'
    ];

    // Prepare data for export
    const exportData = filteredApplicants.map(applicant => {
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
    <div className="flex w-full relative overflow-hidden h-[calc(100vh-2rem)]">
      <div className="flex-1 max-w-full mx-auto py-6 px-4 md:px-8 h-full">
        <div className="glass-card max-w-full h-full rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 backdrop-blur-xl relative z-10 transition-all hover:border-white/20 flex flex-col">

          {/* Header Section */}
          <div className="px-8 py-6 border-b border-white/10 bg-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white tracking-wide">Recruitment Database</h1>
              <button
                onClick={() => setIsFilterSidebarOpen(true)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all text-sm font-semibold shadow-sm border border-white/10 flex items-center gap-2 backdrop-blur-sm active:scale-95"
              >
                <i className="fas fa-filter"></i>
                Advanced Filters
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <Filters
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onSearchChange={setSearchTerm}
                onStatusFilterChange={setStatusFilter}
              />

              {/* Advanced Active Filters */}
              {checkHasActiveFilters(filters) && (
                <FilterBar
                  activeFilters={activeFilters}
                  onOpenFilters={() => setIsFilterSidebarOpen(true)}
                  onRemoveFilter={handleRemoveFilter}
                  onClearAll={handleClearFilters}
                />
              )}
            </div>

            {(searchTerm || statusFilter || checkHasActiveFilters(filters)) && (
              <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm flex justify-between items-center flex-wrap gap-2">
                <p className="text-sm text-text-secondary">
                  Showing <span className="text-white font-bold">{filteredApplicants.length}</span> of <span className="text-white font-bold">{applicants.length}</span> applicants
                </p>
                {(searchTerm || statusFilter) && (
                  <span className="text-xs text-text-secondary/70 italic hidden sm:inline">
                    (Including quick filters)
                  </span>
                )}
              </div>
            )}

            <div className="mt-6">
              <ActionsBar
                selectedCount={selectedApplicants.size}
                onAction={handleAction}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 overflow-hidden relative">
            {error && (
              <div className="m-6 bg-danger/10 text-danger border border-danger/20 p-4 rounded-xl flex items-center gap-3">
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
              <div className="h-full overflow-hidden">
                <ApplicantTable
                  applicants={filteredApplicants}
                  selectedApplicants={selectedApplicants}
                  onSelectAll={handleSelectAll}
                  onSelectApplicant={handleSelectApplicant}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        users={mappedUsersForFiltering}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        statusOptions={allStatusOptions}
      />
    </div>
  );
}

export default RecruitmentDatabase;