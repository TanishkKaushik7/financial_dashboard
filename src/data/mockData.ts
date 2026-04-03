import {type Transaction } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const getDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

export const initialTransactions: Transaction[] = [
  // --- INCOMES ---
  {
    id: 't1',
    date: getDate(0), // Today
    amount: 500000,
    category: 'Salary',
    type: 'income',
    description: 'Monthly Salary - Tech Corp',
  },
  {
    id: 't2',
    date: getDate(5),
    amount: 120000,
    category: 'Freelance',
    type: 'income',
    description: 'UI Design Project - Client X',
  },
  {
    id: 't3',
    date: getDate(12),
    amount: 45000,
    category: 'Freelance',
    type: 'income',
    description: 'Logo Consultation',
  },

  // --- EXPENSES ---
  {
    id: 't4',
    date: getDate(1),
    amount: 150000,
    category: 'Rent',
    type: 'expense',
    description: 'April Apartment Rent',
  },
  {
    id: 't5',
    date: getDate(2),
    amount: 8500.50,
    category: 'Food & Drink',
    type: 'expense',
    description: 'Weekly Groceries - Whole Foods',
  },
  {
    id: 't6',
    date: getDate(3),
    amount: 42000.00,
    category: 'Transport',
    type: 'expense',
    description: 'Gas Station Refill',
  },
  {
    id: 't7',
    date: getDate(4),
    amount: 1500.99,
    category: 'Entertainment',
    type: 'expense',
    description: 'Netflix Subscription',
  },
  {
    id: 't8',
    date: getDate(6),
    amount: 9200.00,
    category: 'Utilities',
    type: 'expense',
    description: 'Electricity Bill',
  },
  {
    id: 't9',
    date: getDate(7),
    amount: 2100.00,
    category: 'Shopping',
    type: 'expense',
    description: 'New Running Shoes',
  },
  {
    id: 't10',
    date: getDate(8),
    amount: 60000.00,
    category: 'Health',
    type: 'expense',
    description: 'Monthly Gym Membership',
  },
  {
    id: 't11',
    date: getDate(10),
    amount: 350.20,
    category: 'Food & Drink',
    type: 'expense',
    description: 'Friday Night Pizza',
  },
  {
    id: 't12',
    date: getDate(15),
    amount: 2500.00,
    category: 'Transport',
    type: 'expense',
    description: 'Uber Ride - Downtown',
  },
  {
    id: 't13',
    date: getDate(20),
    amount: 95000.00,
    category: 'Other',
    type: 'expense',
    description: 'Annual Software License',
  },
  {
    id: 't14',
    date: getDate(22),
    amount: 120.50,
    category: 'Food & Drink',
    type: 'expense',
    description: 'Morning Coffee & Bagel',
  },
  {
    id: 't15',
    date: getDate(25),
    amount: 15000.00,
    category: 'Shopping',
    type: 'expense',
    description: 'Mechanical Keyboard Upgrade',
  }
];