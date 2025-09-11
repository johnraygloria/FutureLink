import React, { useState, useEffect } from "react";
import Sidebar from "./Global/Sidebar";
import Dashboard from "./pages/dashboard";
import Assessment from "./pages/assessment";
// import Applicants from "./pages/assessment";
import Selection from "./pages/selection";
import Engagement from "./pages/engagement";
import Screening from "./pages/screening";
import Employeerelations from "./pages/employee_relations";
import RecruitmentDatabase from "./pages/recruitment-database";
import LoadingScreen from "./components/LoadingScreen";
import { NavigationProvider } from "./Global/NavigationContext";

const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen isLoading={isLoading} />;
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
      case 'employee_relations':
        return <Employeerelations/>;
      case 'recruitment-database':
        return <RecruitmentDatabase/>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <NavigationProvider activeSection={activeSection as any} setActiveSection={setActiveSection as any}>
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
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
    </NavigationProvider>
  );
};

export default App;
