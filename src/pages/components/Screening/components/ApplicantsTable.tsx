import React from "react";
import type { User } from "../../../../api/applicant";
import { formatAppliedDate, getUserInitials } from "../utils/screeningUtils";

type ApplicantsTableProps = {
  users: User[];
  selectedUser: User | null;
  onUserClick: (user: User) => void;
  isLoading?: boolean;
};

// moved utilities to ../utils/screeningUtils

const ApplicantsTable: React.FC<ApplicantsTableProps> = ({ users, selectedUser, onUserClick, isLoading }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50 sticky top-0 z-10">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Date</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {isLoading && (
          Array.from({ length: 6 }).map((_, idx) => (
            <tr key={`skeleton-${idx}`} className="animate-pulse">
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/5" /></td>
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-2/5" /></td>
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/4" /></td>
              <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-24" /></td>
            </tr>
          ))
        )}
        {!isLoading && users.length === 0 && (
          <tr>
            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
              <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <i className="fas fa-user-slash text-gray-400" />
              </div>
              <p className="text-sm">No applicants found</p>
            </td>
          </tr>
        )}
        {!isLoading && users.map((user) => (
          <tr
            key={user.id}
            className={`odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition cursor-pointer ${selectedUser?.id === user.id ? 'bg-gray-100' : ''}`}
            onClick={() => onUserClick(user)}
          >
            <td className="px-6 py-4 whitespace-nowrap">
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
              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">{user.status}</span>
            </td>
            
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ApplicantsTable; 