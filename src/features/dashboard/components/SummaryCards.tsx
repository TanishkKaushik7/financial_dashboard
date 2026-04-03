// This component renders the summary cards at the top of the dashboard, showing total balance, income, and expenses.
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { getFinancialSummary } from '../../../utils/calculations';
import { formatCurrency } from '../../../utils/formatters';
import { Card } from '../../../components/ui/Card';

const SummaryCards = () => {
  const { transactions } = useAppStore();
  const { totalBalance, totalIncome, totalExpenses } = getFinancialSummary(transactions);

  const stats = [
    {
      title: 'Total Balance',
      amount: totalBalance,
      icon: Wallet,
      color: 'text-slate-600 dark:text-slate-300',
      bgColor: 'bg-slate-100 dark:bg-slate-800',
      description: 'Current available funds',
      trend: null,
    },
    {
      title: 'Total Income',
      amount: totalIncome,
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
      description: 'Total earnings this period',
      trend: { icon: ArrowUpRight, label: 'Live tracking active' },
    },
    {
      title: 'Total Expenses',
      amount: totalExpenses,
      icon: TrendingDown,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950',
      description: 'Total spending this period',
      trend: { icon: ArrowDownRight, label: 'Live tracking active' },
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-w-0"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5 truncate">
                {stat.title}
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums truncate">
                {formatCurrency(stat.amount)}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 leading-snug">
                {stat.description}
              </p>
            </div>

            <div className={`p-2.5 rounded-xl shrink-0 ${stat.bgColor} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>

          {stat.trend && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
              <stat.trend.icon className={`w-3.5 h-3.5 shrink-0 ${stat.color}`} />
              <span className={`text-xs font-semibold ${stat.color}`}>
                {stat.trend.label}
              </span>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;