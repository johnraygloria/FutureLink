import { useState, useEffect, useRef } from 'react';

export const useScreeningDropdown = () => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setExpandedItem(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusClick = (itemKey: string) => {
    setExpandedItem(expandedItem === itemKey ? null : itemKey);
  };

  const closeDropdown = () => {
    setExpandedItem(null);
  };

  return {
    expandedItem,
    dropdownRef,
    handleStatusClick,
    closeDropdown
  };
}; 