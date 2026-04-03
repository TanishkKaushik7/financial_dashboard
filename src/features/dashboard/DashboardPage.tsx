import React, { useEffect, useState } from 'react';
import SummaryCards from './components/SummaryCards';
import BalanceTrendChart from './components/BalanceTrendChart';
import SpendingBreakdownChart from './components/SpendingBreakdownChart';
import { useAppStore } from '../../store/useAppStore';
import { Badge } from '../../components/ui/Badge';
import { LayoutDashboard, Calendar, Sparkles } from 'lucide-react';

const useDelay = (ms: number) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return ready;
};

const Reveal = ({ children, show, className = '' }: {
  children: React.ReactNode; show: boolean; className?: string;
}) => (
  <div className={`transition-all duration-700 ease-out ${
    show ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-4 blur-sm'
  } ${className}`}>
    {children}
  </div>
);

const DashboardPage: React.FC = () => {
  const { userRole } = useAppStore();
  const currentDate = new Date().toLocaleDateString('en-IN', {
    month: 'long', year: 'numeric',
  });

  const s0 = useDelay(0);
  const s1 = useDelay(120);
  const s2 = useDelay(260);
  const s3 = useDelay(400);

  return (
    <div className="space-y-6 md:space-y-8 px-1">

      {/* 1. Header */}
      <Reveal show={s0}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <LayoutDashboard className="w-5 h-5 shrink-0 text-slate-400 dark:text-slate-500" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                Dashboard Overview
              </h1>
              <Badge variant={userRole === 'ADMIN' ? 'success' : 'info'}>
                {userRole} Mode
              </Badge>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Welcome back, Tanishk. Here's what's happening with your money.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm self-start shrink-0">
            <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
              {currentDate}
            </span>
          </div>
        </div>
      </Reveal>

      {/* 2. Summary Cards */}
      <Reveal show={s1}>
        <SummaryCards />
      </Reveal>

      {/* 3. Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
        <Reveal show={s2} className="min-w-0">
          <BalanceTrendChart />
        </Reveal>
        <Reveal show={s3} className="min-w-0">
          <SpendingBreakdownChart />
        </Reveal>
      </div>

      {/* 4. Footer CTA — already dark bg, no changes needed */}
      <Reveal show={s3}>
        <div className="relative bg-slate-900 dark:bg-slate-800 rounded-2xl px-6 py-5 md:px-8 md:py-6 text-white overflow-hidden">
          <div className="pointer-events-none absolute -right-6 -top-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -left-4 -bottom-4 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <h4 className="text-base md:text-lg font-bold leading-snug">
                  Ready to optimize your spending?
                </h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Check the{' '}
                <span className="text-emerald-400 font-semibold underline underline-offset-4 decoration-emerald-400/50">
                  Insights
                </span>{' '}
                tab for AI-powered suggestions based on your history.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
};

export default DashboardPage;