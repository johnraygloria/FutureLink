import { useState, useEffect, useMemo } from "react";
import type { User, ApplicationStatus, ScreeningStatus } from "../../../../api/applicant";
import { initialFormState } from '../InputApplicantModal';
import {
  initialFilters,
  applyFilters,
  filtersToActiveFilters,
  hasActiveFilters as checkHasActiveFilters,
} from "../../../../components/Filters/filterUtils";
import type { FilterCriteria, ActiveFilter } from "../../../../components/Filters/filterUtils";

// Google Sheets no longer used

export function useApplicants() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter state with localStorage persistence
  const [filters, setFilters] = useState<FilterCriteria>(() => {
    try {
      const saved = localStorage.getItem('screeningFilters');
      return saved ? JSON.parse(saved) : initialFilters;
    } catch {
      return initialFilters;
    }
  });
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('screeningFilters', JSON.stringify(filters));
  }, [filters]);

  const handleUserClick = (user: User) => setSelectedUser(user);
  const handleCloseSidebar = () => setSelectedUser(null);

  const handleStatusChange = (userId: number, newStatus: ApplicationStatus) => {
    setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, status: newStatus } : user));
  };

  const handleScreeningUpdate = (userId: number, key: keyof User, status: ScreeningStatus) => {
    setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, [key]: status } : user));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, [key]: status } : null);
    }
  };

  const handleAddApplicant = async (data: typeof initialFormState) => {
    const payload: Record<string, string> = {
      NO: data.no || '',
      REFFERED_BY: data.referredBy || '',
      LAST_NAME: data.lastName || '',
      FIRST_NAME: data.firstName || '',
      EXT: data.ext || '',
      MIDDLE: data.middle || '',
      GENDER: data.gender || '',
      SIZE: data.size || '',
      DATE_OF_BIRTH: data.dateOfBirth || '',
      DATE_APPLIED: data.dateApplied || '',
      FB_NAME: data.facebook || '',
      AGE: data.age || '',
      LOCATION: data.location || '',
      CONTACT_NUMBER: data.contactNumber || '',
      POSITION_APPLIED_FOR: data.positionApplied || '',
      EXPERIENCE: data.experience || '',
      DATIAN: data.datian || '',
      HOKEI: data.hokei || '',
      POBC: data.pobc || '',
      JINBOWAY: data.jinboway || '',
      SURPRISE: data.surprise || '',
      THALESTE: data.thaleste || '',
      AOLLY: data.aolly || '',
      ENJOY: data.enjoy || '',
      STATUS: data.status || 'For Screening',
      REQUIREMENTS_STATUS: data.requirementsStatus || '',
      FINAL_INTERVIEW_STATUS: data.finalInterviewStatus || '',
      MEDICAL_STATUS: data.medicalStatus || '',
      STATUS_REMARKS: data.statusRemarks || '',
      APPLICANT_REMARKS: data.applicantRemarks || '',
      RECENT_PICTURE: data.recentPicture ? '1' : '0',
      PSA_BIRTH_CERTIFICATE: data.psaBirthCertificate ? '1' : '0',
      SCHOOL_CREDENTIALS: data.schoolCredentials ? '1' : '0',
      NBI_CLEARANCE: data.nbiClearance ? '1' : '0',
      POLICE_CLEARANCE: data.policeClearance ? '1' : '0',
      BARANGAY_CLEARANCE: data.barangayClearance ? '1' : '0',
      SSS: data.sss ? '1' : '0',
      PAGIBIG: data.pagibig ? '1' : '0',
      CEDULA: data.cedula ? '1' : '0',
      VACCINATION_STATUS: data.vaccinationStatus ? '1' : '0',
      RESUME: data.resume ? '1' : '0',
      COE: data.coe ? '1' : '0',
      PHILHEALTH: data.philhealth ? '1' : '0',
      TIN_NUMBER: data.tinNumber ? '1' : '0',
    };
    try {
      await fetch('/api/applicants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const newApplicant: User = {
        id: Date.now(),
        status: 'For Screening',
        contactNumber: data.contactNumber || '',
        experience: data.experience || '',
        referredBy: data.referredBy,
        lastName: data.lastName,
        firstName: data.firstName,
        ext: data.ext,
        middle: data.middle,
        gender: data.gender,
        size: data.size,
        dateOfBirth: data.dateOfBirth,
        dateApplied: data.dateApplied,
        age: data.age,
        location: data.location,
        no: data.no,
        facebook: data.facebook || '',
        positionApplied: data.positionApplied || '',
        // Document checklist (reflect immediately in sidebar/table without reload)
        recentPicture: data.recentPicture,
        psaBirthCertificate: data.psaBirthCertificate,
        schoolCredentials: data.schoolCredentials,
        nbiClearance: data.nbiClearance,
        policeClearance: data.policeClearance,
        barangayClearance: data.barangayClearance,
        sss: data.sss,
        pagibig: data.pagibig,
        cedula: data.cedula,
        vaccinationStatus: data.vaccinationStatus,
        resume: data.resume,
        coe: data.coe,
        philhealth: data.philhealth,
        tinNumber: data.tinNumber,
        datian: data.datian || '',
        hokei: data.hokei || '',
        pobc: data.pobc || '',
        jinboway: data.jinboway || '',
        surprise: data.surprise || '',
        thaleste: data.thaleste || '',
        aolly: data.aolly || '',
        enjoy: data.enjoy || '',
        requirementsStatus: data.requirementsStatus || '',
        finalInterviewStatus: data.finalInterviewStatus || '',
        medicalStatus: data.medicalStatus || '',
        statusRemarks: data.statusRemarks || '',
        applicantRemarks: data.applicantRemarks || '',
      };
      setUsers(prev => [...prev, newApplicant]);
    } catch (error) {
      alert("Failed to add applicant.");
    }
  };

  const handleStatusChangeAndSync = async (userId: number, newStatus: ApplicationStatus) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const payload: Record<string, string> = {
      NO: user.no || '',
      REFFERED_BY: user.referredBy || '',
      LAST_NAME: user.lastName || '',
      FIRST_NAME: user.firstName || '',
      EXT: user.ext || '',
      MIDDLE: user.middle || '',
      GENDER: user.gender || '',
      SIZE: user.size || '',
      DATE_OF_BIRTH: user.dateOfBirth || '',
      DATE_APPLIED: user.dateApplied || '',
      FB_NAME: user.facebook || '',
      AGE: user.age || '',
      LOCATION: user.location || '',
      CONTACT_NUMBER: user.contactNumber || '',
      POSITION_APPLIED_FOR: user.positionApplied || '',
      EXPERIENCE: user.experience || '',
      DATIAN: user.datian || '',
      HOKEI: user.hokei || '',
      POBC: user.pobc || '',
      JINBOWAY: user.jinboway || '',
      SURPRISE: user.surprise || '',
      THALESTE: user.thaleste || '',
      AOLLY: user.aolly || '',
      ENJOY: user.enjoy || '',
      STATUS: newStatus || '',
      REQUIREMENTS_STATUS: user.requirementsStatus || '',
      FINAL_INTERVIEW_STATUS: user.finalInterviewStatus || '',
      MEDICAL_STATUS: user.medicalStatus || '',
      STATUS_REMARKS: user.statusRemarks || '',
      APPLICANT_REMARKS: user.applicantRemarks || '',
    };
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    await fetch('/api/applicants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    try {
      window.dispatchEvent(new CustomEvent('applicant-updated', { detail: { no: user.no, status: newStatus } }));
    } catch {}
  };

  const removeApplicant = (userId: number) => {
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(null);
    }
  };

  const checkApplicantExists = async (no: string, lastName: string, firstName: string) => {
    const url = `/api/applicants?NO=${encodeURIComponent(no)}&LAST_NAME=${encodeURIComponent(lastName)}&FIRST_NAME=${encodeURIComponent(firstName)}`;
    const response = await fetch(url);
    if (!response.ok) return false;
    const data = await response.json();
    return data !== null;
  };

  // Filter handling functions
  const handleApplyFilters = (newFilters: FilterCriteria) => {
    setFilters(newFilters);
    // Close applicant sidebar when filter sidebar opens
    setSelectedUser(null);
  };

  const handleRemoveFilter = (filter: ActiveFilter) => {
    const newFilters = { ...filters };

    if (filter.field === 'age') {
      newFilters.age = {};
    } else if (Array.isArray(newFilters[filter.field])) {
      newFilters[filter.field] = (newFilters[filter.field] as string[]).filter(
        val => val !== filter.value
      );
    }

    setFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    setFilters(initialFilters);
  };

  const handleOpenFilterSidebar = () => {
    setIsFilterSidebarOpen(true);
    // Close applicant sidebar when opening filter sidebar
    setSelectedUser(null);
  };

  // Calculate active filters
  const activeFilters = useMemo(() => filtersToActiveFilters(filters), [filters]);
  const hasFilters = checkHasActiveFilters(filters);

  // Combined filtering: first apply filters, then apply search
  const filteredUsers = useMemo(() => {
    // First apply multi-field filters
    let result = applyFilters(users, filters);

    // Then apply search
    if (search) {
      result = result.filter((user) =>
        (`${user.firstName || ''} ${user.lastName || ''}`.toLowerCase()).includes(search.toLowerCase()) ||
        (user.positionApplied?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (user.contactNumber?.toLowerCase() || '').includes(search.toLowerCase())
      );
    }

    return result;
  }, [users, filters, search]);

  return {
    selectedUser,
    setSelectedUser,
    search,
    setSearch,
    users,
    setUsers,
    isModalOpen,
    setIsModalOpen,
    handleUserClick,
    handleCloseSidebar,
    handleStatusChange,
    handleScreeningUpdate,
    handleAddApplicant,
    handleStatusChangeAndSync,
    removeApplicant,
    checkApplicantExists,
    filteredUsers,
    // Filter-related exports
    filters,
    activeFilters,
    hasFilters,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    handleApplyFilters,
    handleRemoveFilter,
    handleClearAllFilters,
    handleOpenFilterSidebar,
  };
} 