import {
  IconHome2,
  IconUsersGroup,
  IconChevronLeft,
  IconChevronRight,
  IconFileText,
  IconDatabase,
  IconClipboardList,
  IconLogout,
} from '@tabler/icons-react';
import FutureLinkLogo from '../assets/logo-default.png'

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  activeSection,
  onSectionChange,
  onLogout,
}) => {
  let allowedSectionId: string | undefined;
  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.hr_department === 'Admin') {
        allowedSectionId = undefined;
      } else switch (parsed?.role) {
        case 0: allowedSectionId = undefined; break; // Admin sees all
        case 1: allowedSectionId = 'screening'; break;
        case 2: allowedSectionId = 'assessment'; break;
        case 3: allowedSectionId = 'selection'; break;
        case 4: allowedSectionId = 'engagement'; break;
        case 5: allowedSectionId = 'employee_relations'; break;
        default: allowedSectionId = undefined;
      }
    }
  } catch { }
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

  const visibleItems = allowedSectionId
    ? menuItems.filter((m) => m.id === allowedSectionId)
    : menuItems;

  return (
    <div
      className={
        `glass-card z-30 border-r-0 border-white/5 rounded-r-3xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] transform h-[95vh] my-auto ml-4 ` +
        (isCollapsed ? 'w-24' : 'w-72')
      }
    >
      <div className="flex items-center justify-between p-6">
        {!isCollapsed && (
          <div className="flex items-center space-x-2 animate-fadeIn pl-2">
            <img src={FutureLinkLogo} alt="FutureLink Logo" className="w-full h-12 object-contain filter drop-shadow-lg" />
          </div>
        )}
        <button
          onClick={onToggle}
          className={`p-2 rounded-xl hover:bg-white/10 text-text-secondary hover:text-white transition-all duration-300 ${isCollapsed ? 'mx-auto' : ''}`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <IconChevronRight className="w-5 h-5" stroke={2.5} />
          ) : (
            <IconChevronLeft className="w-5 h-5" stroke={2.5} />
          )}
        </button>
      </div>

      <div className="px-6 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>

      <nav className="p-4 flex-1 overflow-y-auto custom-scrollbar">
        <ul className="space-y-3">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`group relative w-full flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 overflow-hidden ${isActive
                    ? 'bg-gradient-to-r from-primary/20 to-primary/5 shadow-lg shadow-primary/5 border border-primary/20'
                    : 'hover:bg-white/5 border border-transparent hover:border-white/5'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.name : undefined}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_2px_rgba(0,128,129,0.5)]"></div>
                  )}

                  <Icon className={`w-6 h-6 z-10 transition-colors duration-300 ${isActive ? 'text-primary-light drop-shadow-md' : 'text-text-secondary group-hover:text-white'
                    }`} stroke={isActive ? 2 : 1.5} />

                  {!isCollapsed && (
                    <span className={`ml-4 font-medium tracking-wide z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-text-secondary group-hover:text-white'
                      }`}>
                      {item.name}
                    </span>
                  )}

                  {/* Hover effect glow */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 pb-8">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 backdrop-blur-md">
          {isCollapsed ? (
            <div className="flex items-center justify-center">
              <button
                onClick={onLogout}
                className="p-2.5 rounded-xl text-danger hover:bg-danger/20 transition-all duration-300"
                title="Log out"
              >
                <IconLogout className="w-5 h-5" stroke={2} />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 text-sm font-medium text-danger/90 hover:text-danger hover:bg-danger/10 py-3 rounded-xl transition-all duration-300 group"
              title="Log out"
            >
              <IconLogout className="w-5 h-5 transition-transform group-hover:-translate-x-1" stroke={2} />
              <span>Log out session</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;