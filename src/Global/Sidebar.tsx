import {
  IconHome2,
  IconUsersGroup,
  IconChevronLeft,
  IconChevronRight,
  IconFileText,
  IconDatabase,
  IconClipboardList,
  IconLogout,
  IconHeartHandshake,
  IconUserCog,
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
      icon: IconHeartHandshake,
      description: 'engagement process and results'
    },
    {
      id: 'employee_relations',
      name: 'Employee Relations',
      icon: IconUserCog,
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
        `relative z-30 mt-4 mb-4 ml-4 flex h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-r-[2rem] border border-l-0 border-white/10 bg-[#151b28]/95 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ` +
        (isCollapsed ? 'w-24' : 'w-72')
      }
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/70 to-transparent" />
      <div className="pointer-events-none absolute -right-24 top-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

      <div className={`flex items-center ${isCollapsed ? 'justify-center px-4' : 'justify-between px-5'} pt-5 pb-4`}>
        {!isCollapsed && (
          <div className="animate-fadeIn rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 shadow-inner shadow-white/5">
            <img src={FutureLinkLogo} alt="FutureLink Logo" className="h-10 w-36 object-contain drop-shadow-lg" />
          </div>
        )}
        <button
          onClick={onToggle}
          className={`grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-text-secondary shadow-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-white active:scale-95 ${isCollapsed ? 'mx-auto' : ''}`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <IconChevronRight className="w-5 h-5" stroke={2.5} />
          ) : (
            <IconChevronLeft className="w-5 h-5" stroke={2.5} />
          )}
        </button>
      </div>

      <div className="px-5 py-3">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        {!isCollapsed && (
          <div className="px-3 pb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/30">
            Workspace
          </div>
        )}
        <ul className="space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`group relative flex w-full items-center overflow-hidden rounded-2xl border px-3.5 py-3 transition-all duration-300 ${isActive
                    ? 'border-primary/35 bg-gradient-to-r from-primary/25 via-primary/12 to-white/[0.03] text-white shadow-[0_14px_34px_rgba(0,128,129,0.18)]'
                    : 'border-transparent text-text-secondary hover:border-white/10 hover:bg-white/[0.05] hover:text-white'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.name : undefined}
                >
                  {isActive && (
                    <>
                      <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-primary-light shadow-[0_0_18px_rgba(0,166,167,0.8)]"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
                    </>
                  )}

                  <span className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-all duration-300 ${isActive
                    ? 'border-primary/30 bg-primary/15 text-primary-light'
                    : 'border-white/10 bg-white/[0.03] text-text-secondary group-hover:border-white/15 group-hover:text-white'
                    }`}>
                    <Icon className="h-5 w-5" stroke={isActive ? 2.2 : 1.7} />
                  </span>

                  {!isCollapsed && (
                    <span className="relative z-10 ml-3 min-w-0 text-left">
                      <span className={`block truncate text-sm font-semibold tracking-wide transition-colors duration-300 ${isActive ? 'text-white' : 'text-text-secondary group-hover:text-white'
                        }`}>
                        {item.name}
                      </span>
                      <span className={`mt-0.5 block truncate text-[11px] font-medium ${isActive ? 'text-primary-light/80' : 'text-white/30 group-hover:text-white/45'}`}>
                        {item.description}
                      </span>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto p-4 pb-6">
        <div className={`rounded-2xl border border-white/10 bg-white/[0.04] shadow-inner shadow-white/5 ${isCollapsed ? 'p-2' : 'p-3'}`}>
          {isCollapsed ? (
            <div className="flex items-center justify-center">
              <button
                onClick={onLogout}
                className="grid h-10 w-10 place-items-center rounded-xl text-danger hover:bg-danger/15 transition-all duration-300 active:scale-95"
                title="Log out"
              >
                <IconLogout className="w-5 h-5" stroke={2} />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogout}
              className="group flex w-full items-center justify-between gap-3 rounded-xl border border-danger/10 bg-danger/[0.06] px-3 py-3 text-sm font-semibold text-danger/90 transition-all duration-300 hover:border-danger/25 hover:bg-danger/10 hover:text-danger active:scale-[0.99]"
              title="Log out"
            >
              <span className="flex items-center gap-3">
                <IconLogout className="w-5 h-5 transition-transform group-hover:translate-x-0.5" stroke={2} />
                <span>Log out session</span>
              </span>
              <IconChevronRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-0.5" stroke={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
