// This file defines the global state management for the financial dashboard application using Zustand.
// It includes transaction data, user role, and filter states, along with actions to manipulate these states.
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
  transactions: Transaction[];
  userRole: UserRole;
  
  filters: {
    search: string;
    category: TransactionCategory | 'All';
    type: TransactionType | 'All';
  };

  setRole: (role: UserRole) => void;
  setSearch: (query: string) => void;
  setCategoryFilter: (category: TransactionCategory | 'All') => void;
  setTypeFilter: (type: TransactionType | 'All') => void;
  
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  editTransaction: (updatedTransaction: Transaction) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: initialTransactions,
      userRole: 'ADMIN', 
      filters: {
        search: '',
        category: 'All',
        type: 'All',
      },

      setRole: (role) => set({ userRole: role }),
      setSearch: (query) => 
        set((state) => ({ filters: { ...state.filters, search: query } })),
      setCategoryFilter: (category) => 
        set((state) => ({ filters: { ...state.filters, category } })),
      setTypeFilter: (type) => 
        set((state) => ({ filters: { ...state.filters, type } })),

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
      name: 'finance-storage', 
    }
  )
);