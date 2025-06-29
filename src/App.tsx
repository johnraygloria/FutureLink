// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from "react";
import Sidebar from "./Global/Sidebar";
import Dashboard from "./pages/dashboard";
import Applicants from "./pages/applicants";
import Selection from "./pages/selection";
import Engagement from "./pages/engagement";

const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'applications':
        return <Applicants />;
        case 'selection':
          return <Selection/>;
      case 'engagement':
        return <Engagement/>;
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
