import React from "react";
import type { User } from "../../../../api/applicant";
import { formatAppliedDate, getUserInitials, ADDITIONAL_ENGAGEMENT_COLUMNS, mapUserToDisplayFormat } from "../utils/engagementUtils";

type EngagementTableProps = {
  users: User[];
  selectedUser: User | null;
  onUserClick: (user: User) => void;
  isLoading?: boolean;
  hasActiveFilters?: boolean;
};

const EngagementTable: React.FC<EngagementTableProps> = ({ users, selectedUser, onUserClick, isLoading, hasActiveFilters = false }) => (
  <div className="overflow-x-auto custom-scrollbar pb-4">
    <table className="min-w-full border-separate border-spacing-0">
      <thead className="bg-white/5 backdrop-blur-md sticky top-0 z-20">
        <tr>
          <th scope="col" className="sticky left-0 z-30 bg-slate-900/95 backdrop-blur-xl px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-white/10 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.5)]">Name</th>
          <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider whitespace-nowrap border-b border-white/10">Position</th>
          <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider whitespace-nowrap border-b border-white/10">Applied Date</th>
          <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider whitespace-nowrap border-b border-white/10">Status</th>
          {ADDITIONAL_ENGAGEMENT_COLUMNS.map((columnKey) => (
            <th key={columnKey} scope="col" className="px-4 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider whitespace-nowrap border-b border-white/10">
              {columnKey}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {isLoading && (
          Array.from({ length: 6 }).map((_, idx) => (
            <tr key={`skeleton-${idx}`} className="animate-pulse">
              <td className="sticky left-0 z-20 bg-slate-900/50 px-6 py-4 border-r border-white/5"><div className="h-4 bg-white/10 rounded w-3/5" /></td>
              <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-2/5" /></td>
              <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-1/4" /></td>
              <td className="px-6 py-4"><div className="h-6 bg-white/10 rounded w-24" /></td>
              {ADDITIONAL_ENGAGEMENT_COLUMNS.map((_, colIdx) => (
                <td key={colIdx} className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-20" /></td>
              ))}
            </tr>
          ))
        )}
        {!isLoading && users.length === 0 && (
          <tr>
            <td colSpan={22} className="px-6 py-20 text-center text-text-secondary">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <i className={`fas ${hasActiveFilters ? 'fa-filter' : 'fa-user-slash'} text-white/20 text-2xl`} />
              </div>
              <p className="text-base font-medium text-white mb-1">
                {hasActiveFilters ? 'No applicants match your filters' : 'No applicants found'}
              </p>
              {hasActiveFilters && (
                <p className="text-sm text-text-secondary/60">Try adjusting your filter criteria</p>
              )}
            </td>
          </tr>
        )}
        {!isLoading && users.map((user) => {
          const displayData = mapUserToDisplayFormat(user);
          const isSelected = selectedUser?.id === user.id;
          return (
            <tr
              key={user.id}
              className={`group transition-all duration-200 cursor-pointer hover:bg-white/5 ${isSelected ? 'bg-primary/10 hover:bg-primary/15' : 'bg-transparent'}`}
              onClick={() => onUserClick(user)}
            >
              <td className={`sticky left-0 z-20 px-6 py-4 whitespace-nowrap border-r border-white/5 transition-colors duration-200 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.5)] ${isSelected ? 'bg-slate-900' : 'bg-background group-hover:bg-slate-800'}`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 relative">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg ring-2 ring-white/10 group-hover:ring-primary/50 transition-all">
                      <span className="text-white font-bold text-xs">{getUserInitials(user)}</span>
                    </div>
                    {isSelected && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full ring-2 ring-background"></div>}
                  </div>
                  <div className="ml-4">
                    <div className={`text-sm font-semibold transition-colors ${isSelected ? 'text-primary-light' : 'text-white group-hover:text-primary-light'}`}>
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-text-secondary group-hover:text-white transition-colors">{user.positionApplied}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-text-secondary">{formatAppliedDate(user.dateApplied)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${user.status === 'For Medical' ? 'bg-primary/10 text-primary-light border-primary/20' :
                    user.status === 'For SBMA Gate Pass' ? 'bg-warning/10 text-warning border-warning/20' :
                      user.status === 'For Deployment' ? 'bg-primary/20 text-primary border-primary/30' :
                        user.status === 'Deployed' ? 'bg-success/10 text-success border-success/20' :
                          'bg-white/5 text-text-secondary border-white/10'
                  }`}>
                  {user.status}
                </span>
              </td>
              {ADDITIONAL_ENGAGEMENT_COLUMNS.map((columnKey) => (
                <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
                  {columnKey === "CLIENTS" ? (
                    <div className="flex flex-wrap gap-1">
                      {displayData[columnKey] ? (
                        displayData[columnKey].split(', ').map((client: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-text-secondary border border-white/10 group-hover:border-white/20 transition-colors"
                          >
                            {client}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-white/20">-</span>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-text-secondary">{displayData[columnKey]}</div>
                  )}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default EngagementTable;