import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getInsights } from '../../utils/calculations';
import InsightCard from './components/InsightCard';
import { Lightbulb, Sparkles, TrendingUp, Zap } from 'lucide-react';

const useDelay = (ms: number) => {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
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

const InsightsPage: React.FC = () => {
  const { transactions } = useAppStore();
  const insights = getInsights(transactions);

  const s0 = useDelay(0);
  const s1 = useDelay(120);
  const s2 = useDelay(240);

  return (
    <div className="space-y-6 md:space-y-8 px-1">

      {/* 1. Hero Header — already dark bg, minimal changes */}
      <Reveal show={s0}>
        <div className="relative overflow-hidden bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 md:p-8 text-white">
          <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-emerald-500/20 rounded-lg shrink-0">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  AI Financial Advisor
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">Smart Insights</h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                We've analyzed your recent transactions to identify patterns,
                potential savings, and health indicators for your finances.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <div className="text-center px-5 py-3 border border-slate-700 dark:border-slate-600 rounded-xl bg-slate-800/50 dark:bg-slate-700/50">
                <p className="text-2xl font-bold text-white tabular-nums">{insights.length}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5">Active Tips</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* 2. Insights Grid */}
      <Reveal show={s1}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))
          ) : (
            <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 gap-3">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <Zap className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <div className="text-center">
                <h3 className="text-slate-900 dark:text-white font-bold text-sm mb-1">
                  Waiting for more data
                </h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm">
                  Add more transactions to unlock personalized insights.
                </p>
              </div>
            </div>
          )}
        </div>
      </Reveal>

      {/* 3. Education Cards */}
      <Reveal show={s2}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          {[
            {
              icon: TrendingUp,
              iconBg: 'bg-blue-50 dark:bg-blue-950',
              iconColor: 'text-blue-600 dark:text-blue-400',
              title: 'Set a Savings Goal',
              body: 'Users who set monthly targets are 40% more likely to stick to their budget. Try setting a goal for next month!',
            },
            {
              icon: Lightbulb,
              iconBg: 'bg-purple-50 dark:bg-purple-950',
              iconColor: 'text-purple-600 dark:text-purple-400',
              title: 'Tax Season Tip',
              body: 'Tag your "Freelance" and "Office" expenses correctly to make your tax filing process seamless.',
            },
          ].map(({ icon: Icon, iconBg, iconColor, title, body }) => (
            <div key={title} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <div className={`p-2.5 rounded-xl shrink-0 ${iconBg}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
};

export default InsightsPage;