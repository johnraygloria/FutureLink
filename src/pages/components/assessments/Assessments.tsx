import { useState } from "react";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";

interface Applicant {
  id: number;
  name: string;
  sex: string;
  birthday: string;
  dateApplied: string;
  phone: string;
  position: string;
}

const initialApplicants: Applicant[] = [
  { id: 1, name: "Jane Doe", sex: "Female", birthday: "1995-04-12", dateApplied: "2024-06-05", phone: "09171231234", position: "Accountant" },
  { id: 2, name: "Mark Smith", sex: "Male", birthday: "1992-09-30", dateApplied: "2024-06-06", phone: "09179871234", position: "Engineer" },
];

const assessmentItems = [
  { key: "resume", label: "Resume Submitted" },
  { key: "interview", label: "Initial Interview" },
  { key: "exam", label: "Assessment Exam" },
  { key: "finalInterview", label: "Final Interview" },
  { key: "offer", label: "Job Offer" },
];

export default function ApplicantComponent() {
  const [applicants] = useState<Applicant[]>(initialApplicants);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [applicantAssessment, setApplicantAssessment] = useState<Record<number, Record<string, boolean>>>({});
  const [search, setSearch] = useState("");

  const openSidebar = (app: Applicant) => {
    setSelectedApplicant(app);
    setSidebarOpen(true);
  };
  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedApplicant(null);
  };

  const getProgress = (app: Applicant) => {
    const assessments = applicantAssessment[app.id] || {};
    const completedCount = assessmentItems.filter((item) => assessments[item.key]).length;
    const totalCount = assessmentItems.length;
    const progressPercentage = (completedCount / totalCount) * 100;
    return { completedCount, totalCount, progressPercentage };
  };

  return (
    <div className="flex w-full">
      <div className="flex-1 max-w-full mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div className="flex space-x-2">
              <button className="px-4 py-2 rounded-lg bg-custom-teal/10 text-black font-semibold shadow-sm focus:outline-none border border-custom-teal/80">
                Applicants <span className="ml-1 bg-indigo-100 text-custom-teal rounded px-2 py-0.5 text-xs font-bold">{applicants.length}</span>
              </button>
              <button
                className="px-4 py-2 cursor-pointer rounded-lg bg-custom-teal text-white font-semibold shadow-sm focus:outline-none border border-custom-teal ml-2"
                onClick={() => alert('Input Data (placeholder)')}
              >
                Input Data
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-green-800 cursor-pointer text-white font-semibold shadow-sm focus:outline-none border border-green-700 ml-2"
                onClick={() => window.open('https://docs.google.com/spreadsheets/d/1Iwz2TJ6We1FtIL4BhEnDW_qlt5Q7f2aAIX2fn2SDqUQ/edit?gid=0#gid=0', '_blank')}
              >
                Open Google Sheet
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <i className="fas fa-search" />
              </span>
              <input
                type="text"
                placeholder="Search applicant"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50"
              />
            </div>
          </div>
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {applicants.filter(app =>
                    app.name.toLowerCase().includes(search.toLowerCase()) ||
                    app.position.toLowerCase().includes(search.toLowerCase())
                  ).map((app) => {
                    const { completedCount, totalCount, progressPercentage } = getProgress(app);
                    return (
                      <tr
                        key={app.id}
                        className={`hover:bg-indigo-50 transition cursor-pointer`}
                        onClick={() => openSidebar(app)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-custom-teal flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {app.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">{app.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">{app.position}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-custom-teal h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">
                              {completedCount}/{totalCount}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ApplicantSidebar
        selectedUser={selectedApplicant}
        onClose={closeSidebar}
      />
    </div>
  );
}