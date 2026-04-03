//  This component defines the Header of the dashboard, which
//  includes the app title, user role switcher, theme toggle, and user profile section.
import { useAppStore } from '../../store/useAppStore';
import { useTheme } from '../../context/ThemeContext';
import { UserCircle, ShieldCheck, Eye, Sun, Moon } from 'lucide-react';

const ROLES = [
  {
    value: 'VIEWER' as const,
    label: 'Viewer',
    icon: Eye,
    active: 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white',
    inactive: 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
  },
  {
    value: 'ADMIN' as const,
    label: 'Admin',
    icon: ShieldCheck,
    active: 'bg-emerald-600 text-white shadow-sm',
    inactive: 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
  },
] as const;

const Header = () => {
  const { userRole, setRole } = useAppStore();
  const { theme, toggle } = useTheme();

  return (
    <header className="
      h-14 md:h-16 shrink-0 sticky top-0 z-10
      border-b border-slate-200 dark:border-slate-800
      bg-white/80 dark:bg-slate-900/80
      backdrop-blur-md
      px-4 sm:px-6 md:px-8
      flex items-center justify-between gap-4
      transition-colors duration-300
    ">

      <h2 className="text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden xs:block truncate">
        Financial Overview
      </h2>

      <div className="flex items-center gap-3 sm:gap-6 ml-auto">

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
          {ROLES.map(({ value, label, icon: Icon, active, inactive }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={`
                flex items-center gap-1.5 px-2.5 py-1.5 rounded-md
                text-xs font-semibold transition-all duration-150
                ${userRole === value ? active : inactive}
              `}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

        <button
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="
            p-2 rounded-lg shrink-0
            text-slate-400 hover:text-slate-700 hover:bg-slate-100
            dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800
            transition-all duration-200
          "
        >
          {theme === 'dark'
            ? <Sun  className="w-4 h-4" />
            : <Moon className="w-4 h-4" />
          }
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 shrink-0 hidden sm:block" />

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Tanishk</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
              {userRole === 'ADMIN' ? 'Full Access' : 'Read Only'}
            </p>
          </div>
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
            <UserCircle className="w-5 h-5" />
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;