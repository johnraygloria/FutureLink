import { useState, useEffect, useMemo } from "react";
import type { User, ApplicationStatus } from "../../../../api/applicant";
import {
  initialFilters,
  applyFilters,
  filtersToActiveFilters,
  hasActiveFilters as checkHasActiveFilters,
} from "../../../../components/Filters/filterUtils";
import type { FilterCriteria, ActiveFilter } from "../../../../components/Filters/filterUtils";
import { fetchClients } from "../../../../api/client";

export function useAssessmentApplicants() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  // Filter state with localStorage persistence
  const [filters, setFilters] = useState<FilterCriteria>(() => {
    try {
      const saved = localStorage.getItem('assessmentFilters');
      return saved ? JSON.parse(saved) : initialFilters;
    } catch {
      return initialFilters;
    }
  });
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('assessmentFilters', JSON.stringify(filters));
  }, [filters]);

  const handleUserClick = (user: User) => setSelectedUser(user);
  const handleCloseSidebar = () => setSelectedUser(null);

  const handleStatusChange = (userId: number, newStatus: ApplicationStatus) => {
    setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, status: newStatus } : user));
  };

  const handleStatusChangeAndSync = async (userId: number, newStatus: ApplicationStatus) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    // Always fetch current clients from database to preserve them
    let clientIds: number[] = [];
    try {
      // First, try to get clients from user object
      const userClients = (user as any).clients || [];
      if (Array.isArray(userClients) && userClients.length > 0) {
        const allClients = await fetchClients();
        clientIds = allClients
          .filter(client => userClients.includes(client.name))
          .map(client => client.id);
      } else {
        // If user object doesn't have clients, fetch from database
        const response = await fetch(`/api/applicants?NO=${encodeURIComponent(user.no || '')}`);
        if (response.ok) {
          const applicants = await response.json();
          const applicant = applicants.find((a: any) => a.applicant_no === user.no);
          if (applicant && Array.isArray(applicant.clients) && applicant.clients.length > 0) {
            const allClients = await fetchClients();
            clientIds = allClients
              .filter(client => applicant.clients.includes(client.name))
              .map(client => client.id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch clients for status update:', error);
    }
    
    const payload: Record<string, any> = {
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
      STATUS: newStatus || '',
      REQUIREMENTS_STATUS: user.requirementsStatus || '',
      FINAL_INTERVIEW_STATUS: user.finalInterviewStatus || '',
      MEDICAL_STATUS: user.medicalStatus || '',
      STATUS_REMARKS: user.statusRemarks || '',
      APPLICANT_REMARKS: user.applicantRemarks || '',
    };
    
    // Always send CLIENT_IDS (even if empty) so backend knows to preserve clients
    // Backend will only update if CLIENT_IDS is explicitly provided
    payload.CLIENT_IDS = clientIds;
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

  const handleScreeningUpdate = () => {
    // Not used in assessment
  };

  const removeApplicant = (userId: number) => {
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(null);
    }
  };

  // Filter handling functions
  const handleApplyFilters = (newFilters: FilterCriteria) => {
    setFilters(newFilters);
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
    setSelectedUser(null);
  };

  // Calculate active filters
  const activeFilters = useMemo(() => filtersToActiveFilters(filters), [filters]);
  const hasFilters = checkHasActiveFilters(filters);

  // Combined filtering: first apply filters, then apply search
  const filteredUsers = useMemo(() => {
    let result = applyFilters(users, filters);

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
    handleUserClick,
    handleCloseSidebar,
    handleStatusChange,
    handleScreeningUpdate,
    handleStatusChangeAndSync,
    removeApplicant,
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
  };
}