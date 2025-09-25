import {
  IconHome2,
  IconUsersGroup,
  IconChevronLeft,
  IconChevronRight,
  IconFileText,
  IconDatabase,
  IconClipboardList,
} from '@tabler/icons-react';
import FutureLinkLogo from '../assets/logo-default.png'

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  onToggle, 
  activeSection, 
  onSectionChange,
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: IconHome2,
      description: 'Overview and analytics'
    },
    {
      id: 'screening',
      name: 'Screening',
      icon: IconUsersGroup,
      description: 'Screening process overview'
    },
    {
      id: 'assessment',
      name: 'Assessment',
      icon: IconClipboardList,
      description: 'Manage applicants'
    },
    {
      id: 'selection',
      name: 'Selection',
      icon: IconFileText,
      description: 'Selection process and results'
    },
    {
      id: 'engagement',
      name: 'Engagement',
      icon: IconFileText,
      description: 'engagement process and results'
    },
    {
      id: 'employee_relations',
      name: 'Employee Relations',
      icon: IconFileText,
      description: 'employee management'
    },
    {
      id: 'recruitment-database',
      name: 'Recruitment Database',
      icon: IconDatabase,
      description: 'Recruitment database records'
    }
  ];

  return (
    <div
      className={
        `bg-white/90 backdrop-blur-sm border-r border-gray-200/70 rounded-r-2xl shadow-md transition-all duration-300 ease-in-out ` +
        (isCollapsed ? 'w-16' : 'w-64')
      }
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200/70">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <img src={FutureLinkLogo} alt="FutureLink Logo" className="w-40 h-16 object-contain" />
            {/* <h2 className="text-lg font-semibold text-gray-800">FutureLink</h2> */}
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <IconChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <IconChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      <nav className="p-3">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`group relative w-full flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-custom-teal bg-custom-teal/10 ring-1 ring-custom-teal/20'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full transition-all ${isActive ? 'bg-custom-teal opacity-100' : 'opacity-0 group-hover:opacity-30 bg-gray-300'}`} />
                  <Icon className={`w-5 h-5 ${
                    isActive ? 'text-custom-teal' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium tracking-wide">{item.name}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {!isCollapsed && (
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <p>FutureLink v1.0</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 