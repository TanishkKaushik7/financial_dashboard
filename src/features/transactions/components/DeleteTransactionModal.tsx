import React from 'react';
import ReactDOM from 'react-dom';
import { useAppStore } from '../../../store/useAppStore';
import type { Transaction } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { AlertCircle, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

interface DeleteModalProps {
  transaction: Transaction;
  onClose: () => void;
}

const DeleteTransactionModal: React.FC<DeleteModalProps> = ({ transaction, onClose }) => {
  const { deleteTransaction } = useAppStore();

  const handleConfirm = () => {
    deleteTransaction(transaction.id);
    onClose();
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="
        bg-white dark:bg-slate-900
        w-full sm:max-w-sm
        rounded-t-2xl sm:rounded-2xl
        shadow-2xl
        border border-slate-200 dark:border-slate-800
        overflow-hidden
        animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-300
      ">

        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        <div className="px-6 pt-4 pb-6 sm:pt-6 text-center">

          <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Delete Transaction?
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Are you sure you want to remove{' '}
            <span className="font-bold text-slate-700 dark:text-slate-200">
              "{transaction.description}"
            </span>{' '}
            for{' '}
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {formatCurrency(transaction.amount)}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="flex flex-col gap-2">
            <Button
              variant="danger"
              className="w-full gap-2"
              onClick={handleConfirm}
            >
              <Trash2 className="w-4 h-4 shrink-0" />
              Yes, Delete Permanently
            </Button>
            <Button
              variant="ghost"
              className="w-full text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteTransactionModal;