import React, { useState } from 'react';
import ApplicantSidebar from '../applicants/ApplicantSidebar';
import type { User } from '../../../types/applicant';

const mockApplicants: User[] = [
  {
    id: 1,
    name: 'John Ray Gloria',
    status: 'For Screening',
    dateApplied: '2024-06-01',
    no: 'A001',
    position: 'Software Engineer',
    lastName: 'Gloria',
    firstName: 'John Ray',
    age: '28',
    location: 'Manila',
    contactNumber: '09171234567',
    positionApplied: 'Software Engineer',
    experience: '2 years at ABC Corp',
    referredBy: 'Jane Smith',
  },
  {
    id: 2,
    name: 'Ebe Rey John',
    status: 'For Final Interview/For Assessment',
    dateApplied: '2024-06-03',
    no: 'A002',
    position: 'UI Designer',
    lastName: 'Ebe',
    firstName: 'Rey John',
    age: '25',
    location: 'Quezon City',
    contactNumber: '09181234567',
    positionApplied: 'UI Designer',
    experience: '1 year at XYZ Studio',
    referredBy: 'Bob Lee',
  },
];

function RecruitmentDatabase() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-custom-teal">Recruitment Database</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-custom-teal/20">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-custom-teal/10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-custom-teal uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-custom-teal uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-custom-teal uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-custom-teal uppercase tracking-wider">Applied</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {mockApplicants.map((applicant) => (
              <tr
                key={applicant.id}
                className="hover:bg-custom-teal/5 cursor-pointer transition"
                onClick={() => setSelectedUser(applicant)}
              >
                <td className="px-6 py-4 whitespace-nowrap">{applicant.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{applicant.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{applicant.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">{applicant.dateApplied}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ApplicantSidebar
        selectedUser={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}

export default RecruitmentDatabase;