import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Transaction, 
  UserRole, 
  TransactionCategory, 
  TransactionType 
} from '../types';
import { initialTransactions } from '../data/mockData';

interface AppState {
  // Data State
  transactions: Transaction[];
  userRole: UserRole;
  
  // Filter State
  filters: {
    search: string;
    category: TransactionCategory | 'All';
    type: TransactionType | 'All';
  };

  // Actions
  setRole: (role: UserRole) => void;
  setSearch: (query: string) => void;
  setCategoryFilter: (category: TransactionCategory | 'All') => void;
  setTypeFilter: (type: TransactionType | 'All') => void;
  
  // Transaction Actions (RBAC protected)
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  editTransaction: (updatedTransaction: Transaction) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial State
      transactions: initialTransactions,
      userRole: 'ADMIN', // Defaulting to Admin for easier development
      filters: {
        search: '',
        category: 'All',
        type: 'All',
      },

      // Filter Actions
      setRole: (role) => set({ userRole: role }),
      setSearch: (query) => 
        set((state) => ({ filters: { ...state.filters, search: query } })),
      setCategoryFilter: (category) => 
        set((state) => ({ filters: { ...state.filters, category } })),
      setTypeFilter: (type) => 
        set((state) => ({ filters: { ...state.filters, type } })),

      // Data Actions with basic RBAC checks
      addTransaction: (transaction) => set((state) => {
        if (state.userRole !== 'ADMIN') return state;
        return { transactions: [transaction, ...state.transactions] };
      }),

      deleteTransaction: (id) => set((state) => {
        if (state.userRole !== 'ADMIN') return state;
        return { 
          transactions: state.transactions.filter((t) => t.id !== id) 
        };
      }),

      editTransaction: (updatedTransaction) => set((state) => {
        if (state.userRole !== 'ADMIN') return state;
        return {
          transactions: state.transactions.map((t) => 
            t.id === updatedTransaction.id ? updatedTransaction : t
          ),
        };
      }),
    }),
    {
      name: 'finance-storage', // Key for LocalStorage persistence
    }
  )
);