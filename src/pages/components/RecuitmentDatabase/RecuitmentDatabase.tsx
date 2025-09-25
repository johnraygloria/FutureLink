import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Filters from './components/filter';
import ActionsBar from './components/action';
import { useNavigation } from '../../../Global/NavigationContext';
import ApplicantTable from './components/applicanttab';
import type { GoogleSheetApplicant } from './hook/googlesheettab';

function RecruitmentDatabase() {
  const [applicants, setApplicants] = useState<GoogleSheetApplicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<GoogleSheetApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(new Set());
  const { setActiveSection, setCurrentApplicantNo } = useNavigation();

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
          DATIAN: r.datian || '',
          HOKEI: r.hokei || '',
          POBC: r.pobc || '',
          JINBOWAY: r.jinboway || '',
          SURPRISE: r.surprise || '',
          THALESTE: r.thaleste || '',
          AOLLY: r.aolly || '',
          ENJOY: r.enjoy || '',
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

    if (statusFilter !== '') {
      filtered = filtered.filter(applicant => 
        applicant["STATUS"] === statusFilter
      );
    }

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

    setFilteredApplicants(filtered);
  }, [statusFilter, searchTerm, applicants]);

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
        } catch {}
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
          DATIAN: r.datian || '',
          HOKEI: r.hokei || '',
          POBC: r.pobc || '',
          JINBOWAY: r.jinboway || '',
          SURPRISE: r.surprise || '',
          THALESTE: r.thaleste || '',
          AOLLY: r.aolly || '',
          ENJOY: r.enjoy || '',
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
      'POSITION APPLIED FOR', 'EXPERIENCE', 'DATIAN', 'HOKEI', 'POBC', 'JINBOWAY',
      'SURPRISE', 'THALESTE', 'AOLLY', 'ENJOY', 'STATUS', 'REQUIREMENTS STATUS',
      'FINAL INTERVIEW STATUS', 'MEDICAL STATUS', 'STATUS REMARKS', 'APPLICANT REMARKS'
    ];

    // Prepare data for export
    const exportData = filteredApplicants.map(applicant => {
      const row: any = {};
      columns.forEach(column => {
        row[column] = applicant[column] || '';
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

  return (
    <div className="p-9">
      <h1 className="text-2xl font-bold mb-6 text-custom-teal">Recruitment Database</h1>
      
      <Filters 
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
      />

      {(searchTerm || statusFilter) && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Showing {filteredApplicants.length} of {applicants.length} applicants
            {searchTerm && ` matching "${searchTerm}"`}
            {statusFilter && ` with status "${statusFilter}"`}
          </p>
        </div>
      )}

      <ActionsBar 
        selectedCount={selectedApplicants.size}
        onAction={handleAction}
      />

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading applicants...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <ApplicantTable
          applicants={filteredApplicants}
          selectedApplicants={selectedApplicants}
          onSelectAll={handleSelectAll}
          onSelectApplicant={handleSelectApplicant}
        />
      )}
    </div>
  );
}

export default RecruitmentDatabase;