import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useAppStore } from '../../../store/useAppStore';
import type { Transaction, TransactionCategory, TransactionType } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { X, Save } from 'lucide-react';

interface EditModalProps {
  transaction: Transaction;
  onClose: () => void;
}

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

const EditTransactionModal: React.FC<EditModalProps> = ({ transaction, onClose }) => {
  const { editTransaction } = useAppStore();
  const [formData, setFormData] = useState<Transaction>({ ...transaction });

  const patch = (fields: Partial<Transaction>) =>
    setFormData((prev) => ({ ...prev, ...fields }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editTransaction(formData);
    onClose();
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="
        bg-white dark:bg-slate-900
        w-full sm:max-w-lg
        rounded-t-2xl sm:rounded-2xl
        shadow-2xl
        border border-slate-200 dark:border-slate-800
        overflow-hidden
        animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-300
      ">

        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
              Edit Transaction
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Update the details below and save.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          <Input
            label="Description"
            placeholder="e.g. Monthly Rent"
            value={formData.description}
            onChange={(e) => patch({ description: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount (₹)"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => patch({ amount: Number(e.target.value) })}
              required
            />
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => patch({ date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" className="flex-1 gap-2" type="submit">
              <Save className="w-4 h-4 shrink-0" />
              Save Changes
            </Button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditTransactionModal;