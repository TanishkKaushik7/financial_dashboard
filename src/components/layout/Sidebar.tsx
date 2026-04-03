// This component defines the Sidebar of the dashboard.
// navigation links, mobile responsiveness, theme toggle, and user role switcher.
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ReceiptIndianRupee, Lightbulb,
  Wallet, Menu, X, Sun, Moon, Eye, ShieldCheck,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAppStore } from '../../store/useAppStore';

const NAV_ITEMS = [
  { name: 'Dashboard',    path: '/',             icon: LayoutDashboard    },
  { name: 'Transactions', path: '/transactions', icon: ReceiptIndianRupee },
  { name: 'Insights',     path: '/insights',     icon: Lightbulb          },
];

const NavContent = ({ onNavigate }: { onNavigate?: () => void }) => (
  <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
    {NAV_ITEMS.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.path === '/'}
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
          ${isActive
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-700 dark:hover:text-slate-200'
          }`
        }
      >
        <item.icon className="w-4 h-4 shrink-0" />
        <span className="truncate">{item.name}</span>
      </NavLink>
    ))}
  </nav>
);

const Brand = () => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 bg-slate-900 dark:bg-slate-700 rounded-lg flex items-center justify-center shrink-0">
      <Wallet className="w-4 h-4 text-white" />
    </div>
    <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-none">
      Zorvyn Finance
    </span>
  </div>
);


const MobileRoleSwitcher = () => {
  const { userRole, setRole } = useAppStore();

  return (
    <div className="px-3 pt-3 border-t border-slate-100 dark:border-slate-800">
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-2 ml-0.5">
        Role
      </p>
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
        {[
          { value: 'VIEWER' as const, label: 'Viewer', icon: Eye },
          { value: 'ADMIN'  as const, label: 'Admin',  icon: ShieldCheck },
        ].map(({ value, label, icon: Icon }) => {
          const isActive = userRole === value;
          return (
            <button
              key={value}
              onClick={() => setRole(value)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md
                text-xs font-semibold transition-all duration-150
                ${isActive
                  ? value === 'ADMIN'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }
              `}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};


const MobileThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="px-3 py-3">
      <button
        onClick={toggle}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="
          w-full flex items-center justify-between
          px-3 py-2.5 rounded-lg
          text-sm font-medium
          text-slate-500 dark:text-slate-400
          hover:bg-slate-50 dark:hover:bg-slate-800/60
          hover:text-slate-700 dark:hover:text-slate-200
          transition-colors duration-150
        "
      >
        <div className="flex items-center gap-3">
          {isDark
            ? <Sun  className="w-4 h-4 shrink-0" />
            : <Moon className="w-4 h-4 shrink-0" />
          }
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </div>

        <div className={`
          relative w-9 h-5 rounded-full transition-colors duration-300 shrink-0
          ${isDark ? 'bg-emerald-500' : 'bg-slate-200'}
        `}>
          <div className={`
            absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm
            transition-transform duration-300
            ${isDark ? 'translate-x-4' : 'translate-x-0.5'}
          `} />
        </div>
      </button>
    </div>
  );
};


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setIsOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      <aside className="hidden md:flex w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-col sticky top-0 shrink-0">
        <div className="px-5 py-5 border-b border-slate-100 dark:border-slate-800">
          <Brand />
        </div>
        <NavContent />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <Brand />
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation"
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="md:hidden h-14 shrink-0" />

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <div
        className={`
          md:hidden fixed top-0 left-0 z-50 h-full w-72 max-w-[85vw]
          bg-white dark:bg-slate-900 flex flex-col shadow-xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-modal="true"
        role="dialog"
        aria-label="Navigation menu"
      >
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <Brand />
          <button
            onClick={close}
            aria-label="Close navigation"
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <NavContent onNavigate={close} />

        <MobileRoleSwitcher />
        <MobileThemeToggle />
      </div>
    </>
  );
};

export default Sidebar;