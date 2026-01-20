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
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50 sticky top-0 z-10">
        <tr>
          <th scope="col" className="sticky left-0 z-20 bg-gray-50 px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Name</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Position</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Applied Date</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
          {ADDITIONAL_ENGAGEMENT_COLUMNS.map((columnKey) => (
            <th key={columnKey} scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              {columnKey}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {isLoading && (
          Array.from({ length: 6 }).map((_, idx) => (
            <tr key={`skeleton-${idx}`} className="animate-pulse">
              <td className="sticky left-0 z-20 bg-white px-6 py-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"><div className="h-4 bg-gray-200 rounded w-3/5" /></td>
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-2/5" /></td>
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/4" /></td>
              <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-24" /></td>
              {ADDITIONAL_ENGAGEMENT_COLUMNS.map((_, colIdx) => (
                <td key={colIdx} className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
              ))}
            </tr>
          ))
        )}
        {!isLoading && users.length === 0 && (
          <tr>
            <td colSpan={22} className="px-6 py-12 text-center text-gray-500">
              <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <i className={`fas ${hasActiveFilters ? 'fa-filter' : 'fa-user-slash'} text-gray-400`} />
              </div>
              <p className="text-sm font-semibold mb-1">
                {hasActiveFilters ? 'No applicants match your filters' : 'No applicants found'}
              </p>
              {hasActiveFilters && (
                <p className="text-xs text-gray-400">Try adjusting your filter criteria</p>
              )}
            </td>
          </tr>
        )}
        {!isLoading && users.map((user) => {
          const displayData = mapUserToDisplayFormat(user);
          return (
            <tr
              key={user.id}
              className={`odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition cursor-pointer ${selectedUser?.id === user.id ? 'bg-gray-100' : ''}`}
              onClick={() => onUserClick(user)}
            >
              <td className="sticky left-0 z-20 bg-inherit px-6 py-4 whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-custom-teal/10 border border-custom-teal/30 flex items-center justify-center">
                      <span className="text-custom-teal font-semibold">{getUserInitials(user)}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 font-medium">{user.positionApplied}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatAppliedDate(user.dateApplied)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  user.status === 'For Medical' ? 'bg-blue-100 text-blue-800' :
                  user.status === 'For SBMA Gate Pass' ? 'bg-yellow-100 text-yellow-800' :
                  user.status === 'For Deployment' ? 'bg-purple-100 text-purple-800' :
                  user.status === 'Deployed' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-gray-100 text-gray-800'
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
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-custom-teal/10 text-custom-teal border border-custom-teal/20"
                          >
                            {client}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-900">{displayData[columnKey]}</div>
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