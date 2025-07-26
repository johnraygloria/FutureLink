import { useState, useEffect } from 'react';

function RecruitmentDatabase() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/applicants')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch applicants');
        return res.json();
      })
      .then((data) => {
        setApplicants(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Server is not available. Please make sure the backend server is running.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-9">
      <h1 className="text-2xl font-bold mb-6 text-custom-teal">Recruitment Database</h1>
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
        <div className="absolute w-4/5">
          <div className="overflow-x-auto">
            <div className="bg-white rounded-xl shadow border border-custom-teal/20 min-w-max">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-custom-teal/10">
                  <tr>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">NO</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">REFFERED BY</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">LAST NAME</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">FIRST NAME</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">EXT</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">MIDDLE</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">GENDER</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">SIZE</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">DATE OF BIRTH</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">DATE APPLIED</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">FB NAME</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">AGE</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">LOCATION</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">CONTACT NUMBER</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">POSITION APPLIED FOR</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">EXPERIENCE</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">DATIAN</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">HOKEI</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">POBC</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">JINBOWAY</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">SURPRISE</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">THALESTE</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">AOLLY</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">ENJOY</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">STATUS</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">REQUIREMENTS STATUS</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">FINAL INTERVIEW STATUS</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">MEDICAL STATUS</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">STATUS REMARKS</th>
                    <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">APPLICANT REMARKS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {applicants.map((applicant, idx) => (
                    <tr key={applicant["NO"] || idx} className="hover:bg-custom-teal/5 cursor-pointer transition">
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["NO"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["REFFERED BY"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["LAST NAME"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["FIRST NAME"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["EXT"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["MIDDLE"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["GENDER"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["SIZE"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["DATE OF BIRTH"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["DATE APPLIED"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["FB NAME"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["AGE"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["LOCATION"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["CONTACT NUMBER"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["POSITION APPLIED FOR"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["EXPERIENCE"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["DATIAN "]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["HOKEI "]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["POBC "]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["JINBOWAY "]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["SURPRISE "]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["THALESTE"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["AOLLY "]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["ENJOY "]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["STATUS"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["REQUIREMENTS STATUS"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["FINAL INTERVIEW STATUS"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["MEDICAL STATUS"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["STATUS REMARKS"]}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{applicant["APPLICANT REMARKS"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecruitmentDatabase;