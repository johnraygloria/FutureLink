import type { User } from "../../api/applicant";

export interface FilterCriteria {
  gender: string[];
  size: string[];
  location: string[];
  experience: string[];
  positionApplied: string[];
  referredBy: string[];
  age: {
    min?: number;
    max?: number;
  };
  status: string[];
}

export interface ActiveFilter {
  field: keyof FilterCriteria;
  label: string;
  value: string | number;
}

export const initialFilters: FilterCriteria = {
  gender: [],
  size: [],
  location: [],
  experience: [],
  positionApplied: [],
  referredBy: [],
  age: {},
  status: [],
};

// Status options: Only 3 allowed screening statuses
export const STATUS_OPTIONS = ['For Screening', 'Doc Screening', 'Physical Screening'];

// Extract unique values from current dataset
export const getUniqueValues = (users: User[], field: keyof User): string[] => {
  const values = new Set<string>();
  users.forEach(user => {
    const value = user[field];
    if (value && value !== '') {
      values.add(String(value));
    }
  });
  return Array.from(values).sort();
};

// Multi-field filtering function
export const applyFilters = (users: User[], filters: FilterCriteria): User[] => {
  return users.filter(user => {
    // Gender filter
    if (filters.gender.length > 0 && !filters.gender.includes(user.gender || '')) {
      return false;
    }

    // Size filter
    if (filters.size.length > 0 && !filters.size.includes(user.size || '')) {
      return false;
    }

    // Location filter
    if (filters.location.length > 0 && !filters.location.includes(user.location || '')) {
      return false;
    }

    // Experience filter
    if (filters.experience.length > 0 && !filters.experience.includes(user.experience || '')) {
      return false;
    }

    // Position filter
    if (filters.positionApplied.length > 0 && !filters.positionApplied.includes(user.positionApplied || '')) {
      return false;
    }

    // Referred By filter
    if (filters.referredBy.length > 0 && !filters.referredBy.includes(user.referredBy || '')) {
      return false;
    }

    // Age range filter
    if (filters.age.min !== undefined || filters.age.max !== undefined) {
      const age = parseInt(user.age || '0');
      if (filters.age.min !== undefined && age < filters.age.min) {
        return false;
      }
      if (filters.age.max !== undefined && age > filters.age.max) {
        return false;
      }
    }

    // Status filter (only 3 allowed screening statuses)
    if (filters.status.length > 0 && !filters.status.includes(user.status || '')) {
      return false;
    }

    return true; // Passed all filters
  });
};

// Convert filters to active filter chips
export const filtersToActiveFilters = (filters: FilterCriteria): ActiveFilter[] => {
  const active: ActiveFilter[] = [];

  // Gender
  filters.gender.forEach(val => active.push({ field: 'gender', label: `Gender: ${val}`, value: val }));

  // Size
  filters.size.forEach(val => active.push({ field: 'size', label: `Size: ${val}`, value: val }));

  // Location
  filters.location.forEach(val => active.push({ field: 'location', label: `Location: ${val}`, value: val }));

  // Experience
  filters.experience.forEach(val => active.push({ field: 'experience', label: `Experience: ${val}`, value: val }));

  // Position
  filters.positionApplied.forEach(val => active.push({ field: 'positionApplied', label: `Position: ${val}`, value: val }));

  // Referred By
  filters.referredBy.forEach(val => active.push({ field: 'referredBy', label: `Referred By: ${val}`, value: val }));

  // Age range
  if (filters.age.min !== undefined || filters.age.max !== undefined) {
    const minLabel = filters.age.min !== undefined ? filters.age.min.toString() : '';
    const maxLabel = filters.age.max !== undefined ? filters.age.max.toString() : '';
    const ageLabel = minLabel && maxLabel
      ? `Age: ${minLabel}-${maxLabel}`
      : minLabel
      ? `Age: ${minLabel}+`
      : `Age: up to ${maxLabel}`;
    active.push({ field: 'age', label: ageLabel, value: `${minLabel || ''}-${maxLabel || ''}` });
  }

  // Status
  filters.status.forEach(val => active.push({ field: 'status', label: `Status: ${val}`, value: val }));

  return active;
};

// Check if any filters are active
export const hasActiveFilters = (filters: FilterCriteria): boolean => {
  return (
    filters.gender.length > 0 ||
    filters.size.length > 0 ||
    filters.location.length > 0 ||
    filters.experience.length > 0 ||
    filters.positionApplied.length > 0 ||
    filters.referredBy.length > 0 ||
    filters.age.min !== undefined ||
    filters.age.max !== undefined ||
    filters.status.length > 0
  );
};
