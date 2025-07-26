import React from "react";
import type { User } from "../../../../api/applicant";

type ApplicantsTableProps = {
  users: User[];
  selectedUser: User | null;
  onUserClick: (user: User) => void;
};

const ApplicantsTable: React.FC<ApplicantsTableProps> = ({ users, selectedUser, onUserClick }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Application Date</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {users.map((user) => (
          <tr
            key={user.id}
            className={`hover:bg-indigo-50 transition cursor-pointer ${selectedUser?.id === user.id ? 'bg-indigo-50' : ''}`}
            onClick={() => onUserClick(user)}
          >
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-custom-teal flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user.firstName ? user.firstName.split(" ").map((n: string) => n[0]).join("") : ''}
                    </span>
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
              <div className="text-sm text-gray-900">{user.applicationDate ? new Date(user.applicationDate).toLocaleDateString() : ''}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">{user.status}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
              <button
                className="text-blue-600 hover:text-blue-900 rounded-full p-2 transition"
                title="View Details"
                onClick={e => { e.stopPropagation(); onUserClick(user); }}
              >
                <i className="fas fa-eye" />
              </button>
              <button
                className="text-green-600 hover:text-green-900 rounded-full p-2 transition"
                title="Screening"
                onClick={e => { e.stopPropagation(); }}
              >
                <i className="fas fa-clipboard-check" />
              </button>
              <button
                className="text-gray-400 hover:text-gray-700 rounded-full p-2 transition"
                title="More actions"
                onClick={e => e.stopPropagation()}
              >
                <i className="fas fa-ellipsis-h" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ApplicantsTable; 