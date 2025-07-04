import {
  IconHome2,
  IconUsersGroup,
  IconChevronLeft,
  IconChevronRight,
  IconFileText,
  IconDatabase,
} from '@tabler/icons-react';

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
  onSectionChange 
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: IconHome2,
      description: 'Overview and analytics'
    },
    {
      id: 'applications',
      name: 'Applications',
      icon: IconUsersGroup,
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
      id: 'recruitment-database',
      name: 'Recruitment Database',
      icon: IconDatabase,
      description: 'Recruitment database records'
    }
  ];

  return (
    <div
      className={
        `bg-white shadow-lg transition-all duration-300 ease-in-out ` +
        (isCollapsed ? 'w-16' : 'w-64')
      }
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-800">FutureLink</h2>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <IconChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <IconChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-custom-teal/10 bg-opacity-100 text-custom-teal border-r-2 border-custom-teal'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className={`w-5 h-5 ${
                    isActive ? 'text-custom-teal' : 'text-gray-600'
                  }`} />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.name}</span>
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