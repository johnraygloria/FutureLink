import React, { useState, useEffect } from "react";
import Sidebar from "./Global/Sidebar";
import Dashboard from "./pages/dashboard";
import Assessment from "./pages/assessment";
import Selection from "./pages/selection";
import Engagement from "./pages/engagement";
import Screening from "./pages/screening";
import Employeerelations from "./pages/employee_relations";
import RecruitmentDatabase from "./pages/recruitment-database";
import LoadingScreen from "./components/LoadingScreen";
import { NavigationProvider } from "./Global/NavigationContext";
import Login from "./pages/auth/Login";

const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function mapRoleToSection(role?: number, hrDepartment?: string) {
    if (hrDepartment === 'Admin') return 'dashboard';
    switch (role) {
      case 0: return 'dashboard';
      case 1: return 'screening';
      case 2: return 'assessment';
      case 3: return 'selection';
      case 4: return 'engagement';
      case 5: return 'employee_relations';
      default: return 'dashboard';
    }
  }

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        setIsAuthenticated(true);
        const parsed = JSON.parse(userStr);
        const last = localStorage.getItem('lastSection');
        const initialSection = last || mapRoleToSection(parsed?.role, parsed?.hr_department);
        if (initialSection) setActiveSection(initialSection);
      }
    } catch {}

    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeSection) {
      try { localStorage.setItem('lastSection', activeSection); } catch {}
    }
  }, [isAuthenticated, activeSection]);

  if (isLoading) {
    return <LoadingScreen isLoading={isLoading} />;
  }

  if (!isAuthenticated) {
    return <Login onSignIn={() => {
      setIsAuthenticated(true);
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          const section = mapRoleToSection(parsed?.role, parsed?.hr_department);
          setActiveSection(section);
          try { localStorage.setItem('lastSection', section); } catch {}
        }
      } catch {}
    }} />;
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
          onLogout={() => {
            try {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('lastSection');
            } catch {}
            setIsAuthenticated(false);
            setActiveSection('dashboard');
          }}
        />
        
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </NavigationProvider>
  );
};

export default App;
