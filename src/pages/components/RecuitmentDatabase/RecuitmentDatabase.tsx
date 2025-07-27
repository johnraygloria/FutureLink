import { useState, useEffect } from 'react';
import Filters from './components/filter';
import ActionsBar from './components/action';
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

  useEffect(() => {
    setLoading(true);
    fetch('/api/applicants')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch applicants');
        return res.json();
      })
      .then((data) => {
        setApplicants(data);
        setFilteredApplicants(data);
        setLoading(false);
      })
      .catch((err) => {
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

  const handleAction = (action: string) => {
    if (selectedApplicants.size === 0) {
      alert('Please select at least one applicant');
      return;
    }

    const selectedIds = Array.from(selectedApplicants);
    console.log(`Performing ${action} on applicants:`, selectedIds);
    alert(`${action} action will be performed on ${selectedIds.length} selected applicant(s)`);
    setSelectedApplicants(new Set());
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