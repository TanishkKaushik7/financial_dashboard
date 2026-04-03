import React, { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { TransactionCategory, TransactionType } from '../../../types';
import { PlusCircle, X } from 'lucide-react';

const CATEGORIES: TransactionCategory[] = [
  'Salary', 'Freelance', 'Food & Drink', 'Rent', 'Transport',
  'Entertainment', 'Utilities', 'Shopping', 'Health', 'Other',
];

const SELECT_CLASS = `
  w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700
  bg-white dark:bg-slate-800
  px-3 text-sm font-medium text-slate-700 dark:text-slate-200
  focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none
  hover:border-slate-300 dark:hover:border-slate-600
  transition-colors cursor-pointer
`;

const LABEL_CLASS = 'block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-0.5';

const DEFAULT_FORM = {
  description: '',
  amount: '',
  category: 'Food & Drink' as TransactionCategory,
  type: 'expense' as TransactionType,
  date: new Date().toISOString().split('T')[0],
};

const TransactionForm = ({ onClose }: { onClose?: () => void }) => {
  const { addTransaction, userRole } = useAppStore();
  const [formData, setFormData] = useState(DEFAULT_FORM);

  const patch = (fields: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...fields }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.amount) return;

    addTransaction({
      id: Math.random().toString(36).substring(2, 11),
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: formData.date,
    });

    onClose?.();
  };

  if (userRole !== 'ADMIN') return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            Add Transaction
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Fill in the details below to record a new entry.
          </p>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 -mr-1"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">

        {/* Row 1: Description + Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Description"
            placeholder="e.g. Monthly Rent"
            value={formData.description}
            onChange={(e) => patch({ description: e.target.value })}
            required
          />
          <Input
            label="Amount (₹)"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) => patch({ amount: e.target.value })}
            required
          />
        </div>

        {/* Row 2: Type + Category + Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={LABEL_CLASS}>Type</label>
            <select
              className={SELECT_CLASS}
              value={formData.type}
              onChange={(e) => patch({ type: e.target.value as TransactionType })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className={LABEL_CLASS}>Category</label>
            <select
              className={SELECT_CLASS}
              value={formData.category}
              onChange={(e) => patch({ category: e.target.value as TransactionCategory })}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => patch({ date: e.target.value })}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
          {onClose && (
            <Button variant="secondary" onClick={onClose} type="button" className="sm:w-auto">
              Cancel
            </Button>
          )}
          <Button type="submit" className="flex-1 gap-2">
            <PlusCircle className="w-4 h-4 shrink-0" />
            Save Transaction
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;