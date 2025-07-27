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
  status: string;
}

interface ApplicationHistory {
  id: number;
  applicantId: number;
  date: string;
  stage: 'Resume Review' | 'Initial Interview' | 'Technical Assessment' | 'Final Interview' | 'Reference Check' | 'Offer Decision';
  status: 'Completed' | 'In Progress' | 'Scheduled' | 'Cancelled';
  evaluator: string;
  notes: string;
  score?: number;
  nextAction?: string;
}

const initialApplicants: Applicant[] = [
  { id: 1, name: "Jane Doe", sex: "Female", birthday: "1995-04-12", dateApplied: "2024-06-05", phone: "09171231234", position: "Accountant", status: "In Progress" },
  { id: 2, name: "Mark Smith", sex: "Male", birthday: "1992-09-30", dateApplied: "2024-06-06", phone: "09179871234", position: "Engineer", status: "Scheduled" },
];

const initialApplicationHistory: ApplicationHistory[] = [
  {
    id: 1,
    applicantId: 1,
    date: "2024-06-05",
    stage: "Resume Review",
    status: "Completed",
    evaluator: "HR Manager",
    notes: "Resume meets all requirements. Strong background in accounting.",
    score: 85,
    nextAction: "Schedule initial interview"
  },
  {
    id: 2,
    applicantId: 1,
    date: "2024-06-08",
    stage: "Initial Interview",
    status: "Completed",
    evaluator: "Department Head",
    notes: "Excellent communication skills. Shows strong technical knowledge.",
    score: 90,
    nextAction: "Proceed to technical assessment"
  },
  {
    id: 3,
    applicantId: 1,
    date: "2024-06-12",
    stage: "Technical Assessment",
    status: "Completed",
    evaluator: "Technical Lead",
    notes: "Passed all technical tests with flying colors.",
    score: 95,
    nextAction: "Schedule final interview"
  },
  {
    id: 4,
    applicantId: 2,
    date: "2024-06-06",
    stage: "Resume Review",
    status: "Completed",
    evaluator: "HR Manager",
    notes: "Good engineering background. Some concerns about experience level.",
    score: 75,
    nextAction: "Schedule initial interview"
  },
  {
    id: 5,
    applicantId: 2,
    date: "2024-06-10",
    stage: "Initial Interview",
    status: "Scheduled",
    evaluator: "Department Head",
    notes: "Interview scheduled for next week.",
    nextAction: "Conduct initial interview"
  }
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
  const [applicationHistory, setApplicationHistory] = useState<ApplicationHistory[]>(initialApplicationHistory);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedApplicantHistory, setSelectedApplicantHistory] = useState<number | null>(null);

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

  const getApplicantHistory = (applicantId: number) => {
    return applicationHistory.filter(history => history.applicantId === applicantId);
  };

  const getLatestStage = (applicantId: number) => {
    const history = getApplicantHistory(applicantId);
    if (history.length === 0) return "Not Started";
    const latest = history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    return latest.stage;
  };

  const getAverageScore = (applicantId: number) => {
    const history = getApplicantHistory(applicantId);
    const scoredHistory = history.filter(h => h.score !== undefined);
    if (scoredHistory.length === 0) return 0;
    const total = scoredHistory.reduce((sum, h) => sum + (h.score || 0), 0);
    return Math.round(total / scoredHistory.length);
  };

  if (showHistory) {
    return (
      <div className="flex w-full">
        <div className="flex-1 max-w-full mx-auto py-10 px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b bg-white">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowHistory(false)}
                  className="px-4 py-2 rounded-lg bg-gray-600 text-white font-semibold shadow-sm focus:outline-none border border-gray-700"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Applicants
                </button>
                <h1 className="text-2xl font-bold text-custom-teal">Assessment History</h1>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Application Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {applicationHistory.map((history) => {
                      const applicant = applicants.find(a => a.id === history.applicantId);
                      return (
                        <tr key={history.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{applicant?.name || 'Unknown'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{applicant?.position || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{applicant?.dateApplied || history.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              history.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              history.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              history.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {history.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                            <button
                              className="text-blue-600 hover:text-blue-900 rounded-full p-2 transition"
                              title="View Details"
                            >
                              <i className="fas fa-eye" />
                            </button>
                            <button
                              className="text-gray-400 hover:text-gray-700 rounded-full p-2 transition"
                              title="More actions"
                            >
                              <i className="fas fa-ellipsis-h" />
                            </button>
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
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <div className="flex-1 max-w-full mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div className="flex items-center space-x-4">
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
              <button
                onClick={() => setShowHistory(true)}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow-sm focus:outline-none border border-purple-700"
              >
                View Assessment History
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Stage</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Average Score</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {applicants.filter(app =>
                    app.name.toLowerCase().includes(search.toLowerCase()) ||
                    app.position.toLowerCase().includes(search.toLowerCase())
                  ).map((app) => {
                    const { completedCount, totalCount, progressPercentage } = getProgress(app);
                    const currentStage = getLatestStage(app.id);
                    const averageScore = getAverageScore(app.id);
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
                          <div className="text-sm text-gray-900">{currentStage}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{averageScore > 0 ? `${averageScore}%` : 'N/A'}</div>
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