// This component provides filters for the transactions list.
// It includes a search bar, category dropdown, type dropdown, and a reset button to clear all filters.
import { Search, XCircle } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import type { TransactionCategory } from '../../../types';

const CATEGORIES: (TransactionCategory | 'All')[] = [
  'All', 'Salary', 'Freelance', 'Food & Drink', 'Rent',
  'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health', 'Other',
];

const SELECT_CLASS = `
  w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700
  bg-white dark:bg-slate-800
  px-3 text-sm font-medium text-slate-700 dark:text-slate-200
  focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none
  cursor-pointer hover:border-slate-300 dark:hover:border-slate-600
  transition-colors
`;

const TransactionFilters = () => {
  const { filters, setSearch, setCategoryFilter, setTypeFilter } = useAppStore();

  const handleReset = () => {
    setSearch('');
    setCategoryFilter('All');
    setTypeFilter('All');
  };

  const isFiltered =
    filters.search !== '' || filters.category !== 'All' || filters.type !== 'All';

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 md:gap-4">

        <div className="flex-1 min-w-0">
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-0.5">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 w-4 h-4 pointer-events-none" />
            <Input
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="w-full sm:w-44 shrink-0">
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-0.5">
            Category
          </label>
          <select
            className={SELECT_CLASS}
            value={filters.category}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-36 shrink-0">
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-0.5">
            Type
          </label>
          <select
            className={SELECT_CLASS}
            value={filters.type}
            onChange={(e) => setTypeFilter(e.target.value as any)}
          >
            <option value="All">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* 4. Reset */}
        <div className="shrink-0 self-end">
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={!isFiltered}
            className={`
              h-10 gap-1.5 text-sm font-semibold transition-all
              ${isFiltered
                ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950'
                : 'text-slate-300 dark:text-slate-700 cursor-not-allowed pointer-events-none'
              }
            `}
          >
            <XCircle className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        </div>

      </div>
    </div>
  );
};

export default TransactionFilters;