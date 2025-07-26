import React, { useState, useEffect } from "react";
import Sidebar from "./Global/Sidebar";
import Dashboard from "./pages/dashboard";
import Assessment from "./pages/assessment";
// import Applicants from "./pages/assessment";
import Selection from "./pages/selection";
import Engagement from "./pages/engagement";
import Screening from "./pages/screening";
import RecruitmentDatabase from "./pages/recruitment-database";

const SERVER_HEALTH_URL = "/api/applicants"; 

const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [serverDown, setServerDown] = useState(false);
  const [checkingServer, setCheckingServer] = useState(true);

  useEffect(() => {
    fetch(SERVER_HEALTH_URL)
      .then(res => {
        if (!res.ok) throw new Error('Server not healthy');
        setServerDown(false);
      })
      .catch(() => setServerDown(true))
      .finally(() => setCheckingServer(false));
  }, []);

  
  if (checkingServer) {
    return <div className="flex items-center justify-center h-screen text-xl">Checking server status...</div>;
  }

  if (serverDown) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50">
        <div className="text-3xl font-bold text-red-700 mb-4">Server is not available</div>
        <div className="text-lg text-red-600 mb-2">Please make sure the backend server is running.</div>
        <button className="mt-4 px-4 py-2 bg-red-700 text-white rounded" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'screening':
        return <Screening />;
      case 'assessment':
        return <Assessment />;
      case 'selection':
        return <Selection/>;
      case 'engagement':
        return <Engagement/>;
      case 'recruitment-database':
        return <RecruitmentDatabase/>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeSection === 'dashboard' && 'Dashboard'}
              {activeSection === 'applications' && 'Applicant Management'}
              {activeSection === 'assessment' && 'Assessment'}
              {activeSection === 'reports' && 'Reports'}
              {activeSection === 'documents' && 'Documents'}
              {activeSection === 'information-sheets' && 'Information Sheets'}
              {activeSection === 'recruitment-database' && 'Recruitment Database'}

            </h1>
          </div>
        </header>
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
