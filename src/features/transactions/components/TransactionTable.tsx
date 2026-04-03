import { useState } from 'react';
import {
  Trash2, Edit3, ArrowUpCircle, ArrowDownCircle, SearchX, Download,
} from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { formatCurrency, formatDate, getAmountColorClass } from '../../../utils/formatters';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import type { Transaction } from '../../../types';
import EditTransactionModal from './EditTransactionModal';
import DeleteTransactionModal from './DeleteTransactionModal';

const TH_CLASS = 'px-4 md:px-6 py-3.5 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest whitespace-nowrap';

// ─── CSV Export ───────────────────────────────────────────────────────────────

const exportToCSV = (transactions: Transaction[]) => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (INR)'];

  const rows = transactions.map((t) => [
    t.date,                                                          // raw YYYY-MM-DD — Excel parses this perfectly
    `"${t.description.replace(/"/g, '""')}"`,                       // escape inner quotes
    t.category,
    t.type.charAt(0).toUpperCase() + t.type.slice(1),
    t.type === 'income' ? t.amount.toFixed(2) : (-t.amount).toFixed(2),
  ]);

  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');

  // UTF-8 BOM (\uFEFF) tells Excel to read the file as UTF-8
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);

  const link      = document.createElement('a');
  link.href       = url;
  link.download   = `zoryn-transactions-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();

  URL.revokeObjectURL(url);
};
// ─── Component ────────────────────────────────────────────────────────────────

const TransactionTable = () => {
  const { transactions, userRole, filters } = useAppStore();
  const [editingItem,  setEditingItem]  = useState<Transaction | null>(null);
  const [deletingItem, setDeletingItem] = useState<Transaction | null>(null);

  const filtered = transactions.filter((t) => {
    const matchesSearch   = t.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === 'All' || t.category === filters.category;
    const matchesType     = filters.type === 'All' || t.type === filters.type;
    return matchesSearch && matchesCategory && matchesType;
  });

  const isAdmin       = userRole === 'ADMIN';
  const isFiltered    = filters.search !== '' || filters.category !== 'All' || filters.type !== 'All';

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
          <SearchX className="w-7 h-7 text-slate-300 dark:text-slate-600" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No transactions found</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Try adjusting your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

        {/* ── Table toolbar ── */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
            {isFiltered && (
              <span className="ml-1 text-slate-300 dark:text-slate-600">(filtered)</span>
            )}
          </p>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => exportToCSV(filtered)}
            className="gap-1.5 text-xs"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            Export CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                <th className={TH_CLASS}>Transaction</th>
                <th className={`${TH_CLASS} hidden sm:table-cell`}>Category</th>
                <th className={`${TH_CLASS} hidden md:table-cell`}>Date</th>
                <th className={`${TH_CLASS} text-right`}>Amount</th>
                {isAdmin && <th className={`${TH_CLASS} text-center`}>Actions</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group">

                  {/* Description */}
                  <td className="px-4 md:px-6 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-1.5 rounded-lg shrink-0 ${
                        t.type === 'income'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                      }`}>
                        {t.type === 'income'
                          ? <ArrowUpCircle className="w-4 h-4" />
                          : <ArrowDownCircle className="w-4 h-4" />
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {t.description}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 sm:hidden truncate">
                          {t.category} · {formatDate(t.date)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 md:px-6 py-3.5 hidden sm:table-cell">
                    <Badge variant="neutral">{t.category}</Badge>
                  </td>

                  {/* Date */}
                  <td className="px-4 md:px-6 py-3.5 hidden md:table-cell text-sm text-slate-400 dark:text-slate-500 whitespace-nowrap">
                    {formatDate(t.date)}
                  </td>

                  {/* Amount */}
                  <td className={`px-4 md:px-6 py-3.5 text-sm font-bold text-right tabular-nums whitespace-nowrap ${getAmountColorClass(t.type)}`}>
                    {t.type === 'income' ? '+' : '−'}&nbsp;{formatCurrency(t.amount)}
                  </td>

                  {/* Actions */}
                  {isAdmin && (
                    <td className="px-4 md:px-6 py-3.5">
                      <div className="flex items-center justify-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150">
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => setEditingItem(t)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => setDeletingItem(t)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingItem  && <EditTransactionModal  transaction={editingItem}  onClose={() => setEditingItem(null)} />}
      {deletingItem && <DeleteTransactionModal transaction={deletingItem} onClose={() => setDeletingItem(null)} />}
    </>
  );
};

export default TransactionTable;