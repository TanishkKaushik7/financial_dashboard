//  Defines the possible roles in the system. 
// 'ADMIN' can edit/add data, 'VIEWER' is read-only.
 // Defines the types used across the financial dashboard application like transactions, user roles, and insights.
export type UserRole = 'ADMIN' | 'VIEWER';

export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'Salary' 
  | 'Freelance' 
  | 'Food & Drink' 
  | 'Rent' 
  | 'Transport' 
  | 'Entertainment' 
  | 'Utilities' 
  | 'Shopping' 
  | 'Health'
  | 'Other';

export interface Transaction {
  id: string;
  date: string; 
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  description: string;
}


export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface TimeSeriesData {
  date: string;
  income: number;
  expenses: number;
}

export interface CategoryData {
  category: TransactionCategory;
  value: number;
  fill?: string; 
}

export interface FinanceInsight {
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  value?: string | number;
}