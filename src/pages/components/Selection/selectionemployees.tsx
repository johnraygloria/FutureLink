import { useEffect, useState } from "react";
// import { IconArrowLeft, IconDatabase } from "@tabler/icons-react";
import ApplicantSidebar from "../../../Global/ApplicantSidebar";
import type { User } from "../../../api/applicant";
import { useNavigation } from "../../../Global/NavigationContext";

interface SelectionHistory {
  id: number;
  employeeId: number;
  date: string;
  stage: 'Medical Referral' | 'Trade Test' | 'Medical Clearance' | 'Orientation' | 'SBMA Processing' | 'Gate Pass Issued';
  status: 'Completed' | 'In Progress' | 'Scheduled' | 'Failed' | 'Pending';
  facilitator: string;
  notes: string;
  documents?: string[];
  nextDeadline?: string;
}


const initialSelectionHistory: SelectionHistory[] = [
  {
    id: 1,
    employeeId: 1,
    date: "2024-06-15",
    stage: "Medical Referral",
    status: "Completed",
    facilitator: "HR Coordinator",
    notes: "Medical referral slip issued. Employee scheduled for medical examination.",
    documents: ["Medical Referral Slip"],
    nextDeadline: "2024-06-22"
  },
  {
    id: 2,
    employeeId: 1,
    date: "2024-06-20",
    stage: "Trade Test",
    status: "Completed",
    facilitator: "Technical Supervisor",
    notes: "Welding skills assessment passed with excellent results. Employee demonstrates advanced techniques.",
    documents: ["Trade Test Results", "Skills Assessment Report"],
    nextDeadline: "2024-06-25"
  },
  {
    id: 3,
    employeeId: 1,
    date: "2024-06-22",
    stage: "Medical Clearance",
    status: "Completed",
    facilitator: "Medical Officer",
    notes: "All medical tests passed. Employee cleared for work assignment.",
    documents: ["Medical Certificate", "Health Declaration"],
    nextDeadline: "2024-06-28"
  },
  {
    id: 4,
    employeeId: 1,
    date: "2024-06-25",
    stage: "Orientation",
    status: "Scheduled",
    facilitator: "Training Coordinator",
    notes: "Orientation scheduled for next week. Safety protocols and company policies will be covered.",
    documents: ["Orientation Schedule"],
    nextDeadline: "2024-07-02"
  },
  {
    id: 5,
    employeeId: 2,
    date: "2024-06-18",
    stage: "Medical Referral",
    status: "Completed",
    facilitator: "HR Coordinator",
    notes: "Medical referral issued. Employee completed initial screening.",
    documents: ["Medical Referral Slip"],
    nextDeadline: "2024-06-25"
  },
  {
    id: 6,
    employeeId: 2,
    date: "2024-06-23",
    stage: "Trade Test",
    status: "In Progress",
    facilitator: "Technical Supervisor",
    notes: "Electrical skills assessment in progress. Employee showing good technical knowledge.",
    documents: ["Trade Test Schedule"],
    nextDeadline: "2024-06-30"
  }
];



export default function SelectionEmployees() {
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [selectionHistory, setSelectionHistory] = useState<SelectionHistory[]>(initialSelectionHistory);
  const [showHistory, setShowHistory] = useState(false);
  const { currentApplicantNo } = useNavigation();

  const openSidebar = (emp: User) => {
    setSelectedEmployee(emp);
  };
  const closeSidebar = () => {
    setSelectedEmployee(null);
  };

  const removeEmployee = (employeeId: number) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      // Add to history
      const newHistoryEntry: SelectionHistory = {
        id: Date.now(),
        employeeId: employee.id,
        date: new Date().toISOString().split('T')[0],
        stage: 'Medical Referral',
        status: 'Completed',
        facilitator: 'System',
        notes: `Moved from Selection to Engagement stage`,
        nextDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      setSelectionHistory(prev => [newHistoryEntry, ...prev]);
      
      // Remove from employees list
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      
      // Close sidebar if this employee was selected
      if (selectedEmployee && selectedEmployee.id === employeeId) {
        setSelectedEmployee(null);
      }
    }
  };



  // Fetch selection-stage applicants from API
  useEffect(() => {
    fetch('/api/applicants')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch applicants');
        return res.json();
      })
      .then((rows) => {
        // Filter to statuses relevant to Selection (pre-engagement)
        const allowed = new Set([
          'For Completion',
          'For Medical',
          'For SBMA Gate Pass',
        ]);
        const mapped: User[] = rows
          .filter((r: any) => allowed.has(r.status || ''))
          .map((r: any) => ({
            id: r.id,
            no: r.applicant_no || '',
            referredBy: r.referred_by || '',
            lastName: r.last_name || '',
            firstName: r.first_name || '',
            ext: r.ext || '',
            middle: r.middle_name || '',
            gender: r.gender || '',
            size: r.size || '',
            dateOfBirth: r.date_of_birth || '',
            dateApplied: r.date_applied || '',
            facebook: r.fb_name || '',
            age: r.age || '',
            location: r.location || '',
            contactNumber: r.contact_number || '',
            positionApplied: r.position_applied_for || '',
            experience: r.experience || '',
            datian: r.datian || '',
            hokei: r.hokei || '',
            pobc: r.pobc || '',
            jinboway: r.jinboway || '',
            surprise: r.surprise || '',
            thaleste: r.thaleste || '',
            aolly: r.aolly || '',
            enjoy: r.enjoy || '',
            status: r.status || '',
            requirementsStatus: r.requirements_status || '',
            finalInterviewStatus: r.final_interview_status || '',
            medicalStatus: r.medical_status || '',
            statusRemarks: r.status_remarks || '',
            applicantRemarks: r.applicant_remarks || '',
            recentPicture: Boolean(r.recent_picture),
            psaBirthCertificate: Boolean(r.psa_birth_certificate),
            schoolCredentials: Boolean(r.school_credentials),
            nbiClearance: Boolean(r.nbi_clearance),
            policeClearance: Boolean(r.police_clearance),
            barangayClearance: Boolean(r.barangay_clearance),
            sss: Boolean(r.sss),
            pagibig: Boolean(r.pagibig),
            cedula: Boolean(r.cedula),
            vaccinationStatus: Boolean(r.vaccination_status),
            resume: Boolean(r.resume),
            coe: Boolean(r.coe),
            philhealth: Boolean(r.philhealth),
            tinNumber: Boolean(r.tin_number),
          }));
        setEmployees(mapped);
      })
      .catch(() => setEmployees([]));
  }, []);

  // Auto-open the proceeded applicant if coming from Assessment
  useEffect(() => {
    if (!currentApplicantNo || employees.length === 0) return;
    const proceededEmployee = employees.find(emp => emp.no === currentApplicantNo);
    if (proceededEmployee) {
      setSelectedEmployee(proceededEmployee);
    }
  }, [currentApplicantNo, employees]);

  // Selection History Page
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
                  Back to Selection
                </button>
                <h1 className="text-2xl font-bold text-custom-teal">Selection History</h1>
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
                    {selectionHistory.map((history) => {
                      const employee = employees.find(e => e.id === history.employeeId);
                      return (
                        <tr key={history.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{employee ? `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || employee.facebook || 'Unknown' : 'Unknown'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee?.positionApplied || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee?.dateApplied || history.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              history.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              history.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              history.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                              history.status === 'Failed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
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

  // Main Selection Page
  return (
    <div className="flex w-full">
      <div className="flex-1 max-w-full mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button className="px-4 py-2 rounded-lg bg-custom-teal/10 text-black font-semibold shadow-sm focus:outline-none border border-custom-teal/80">
                Selection <span className="ml-1 bg-indigo-100 text-custom-teal rounded px-2 py-0.5 text-xs font-bold">{employees.length}</span>
              </button>
              
              </div>
              <button
                onClick={() => setShowHistory(true)}
                className="px-4 py-2 rounded-lg bg-orange-600 text-white font-semibold shadow-sm focus:outline-none border border-orange-700"
              >
                View Selection History
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <i className="fas fa-search" />
              </span>
              <input
                type="text"
                placeholder="Search employee"
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {employees.filter(emp =>
                    (`${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase()).includes(search.toLowerCase()) ||
                    (emp.positionApplied?.toLowerCase() || '').includes(search.toLowerCase())
                  ).map((emp) => {
                    return (
                      <tr
                        key={emp.id}
                        className={`hover:bg-indigo-50 transition cursor-pointer`}
                        onClick={() => openSidebar(emp)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-custom-teal flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {`${emp.firstName || ''} ${emp.lastName || ''}`.trim().split(' ').map((n) => n[0]).join('').toUpperCase() || '?'}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">{`${emp.firstName || ''} ${emp.lastName || ''}`.trim() || emp.facebook || 'Unknown'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">{emp.positionApplied}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{emp.dateApplied}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            emp.status === 'For Completion' ? 'bg-green-100 text-green-800' :
                            emp.status === 'For Medical' ? 'bg-blue-100 text-blue-800' :
                            emp.status === 'For SBMA Gate Pass' ? 'bg-yellow-100 text-yellow-800' :
                            emp.status === 'For Deployment' ? 'bg-purple-100 text-purple-800' :
                            emp.status === 'Deployed' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {emp.status}
                          </span>
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
        selectedUser={selectedEmployee}
        onClose={closeSidebar}
        onRemoveApplicant={removeEmployee}
      />
    </div>
  );
}