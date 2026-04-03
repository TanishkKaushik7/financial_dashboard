import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import TransactionTable from './components/TransactionTable';
import TransactionFilters from './components/TransactionFilters';
import TransactionForm from './components/TransactionForm';
import { Button } from '../../components/ui/Button';
import { Plus, ReceiptIndianRupee, X } from 'lucide-react';

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

const FormReveal = ({ show, children }: { show: boolean; children: React.ReactNode }) => (
  <div
    className="overflow-hidden transition-all duration-300 ease-in-out"
    style={{
      maxHeight: show ? '600px' : '0px',
      opacity: show ? 1 : 0,
      transform: show ? 'translateY(0)' : 'translateY(-8px)',
    }}
  >
    {children}
  </div>
);

const TransactionsPage: React.FC = () => {
  const { userRole } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const isAdmin = userRole === 'ADMIN';

  const toggleForm = () => setIsAdding((prev) => !prev);
  const closeForm = () => setIsAdding(false);

  const s0 = useDelay(0);
  const s1 = useDelay(120);
  const s2 = useDelay(240);

  return (
    <div className="space-y-6 px-1">

      {/* 1. Header */}
      <Reveal show={s0}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <ReceiptIndianRupee className="w-5 h-5 shrink-0 text-slate-400 dark:text-slate-500" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                Transactions
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Review and manage your financial history.
            </p>
          </div>

          {isAdmin && (
            <Button
              onClick={toggleForm}
              variant={isAdding ? 'secondary' : 'primary'}
              className="gap-2 shadow-sm self-start shrink-0"
            >
              <span
                className="flex items-center gap-2 transition-all duration-200"
                style={{ transform: isAdding ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
              <span className="transition-all duration-200">
                {isAdding ? 'Close' : 'Add Transaction'}
              </span>
            </Button>
          )}
        </div>
      </Reveal>

      {/* 2. Inline Form */}
      {isAdmin && (
        <FormReveal show={isAdding}>
          <div className="pb-2">
            <TransactionForm onClose={closeForm} />
          </div>
        </FormReveal>
      )}

      {/* 3. Filters */}
      <Reveal show={s1}>
        <TransactionFilters />
      </Reveal>

      {/* 4. Table */}
      <Reveal show={s2}>
        <TransactionTable />
      </Reveal>
    </div>
  );
};

export default TransactionsPage;