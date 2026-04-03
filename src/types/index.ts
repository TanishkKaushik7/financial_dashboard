// src/types/index.ts

/** * Defines the possible roles in the system. 
 * 'ADMIN' can edit/add data, 'VIEWER' is read-only.
 */
export type UserRole = 'ADMIN' | 'VIEWER';

/**
 * Strict types for transaction classification.
 */
export type TransactionType = 'income' | 'expense';

/**
 * Common categories for a finance app. 
 * Using a union type ensures consistency across the UI.
 */
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

/**
 * The core Transaction data model.
 */
export interface Transaction {
  id: string;
  date: string; // ISO string format (e.g., "2026-04-01")
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  description: string;
}

/**
 * Structure for the Dashboard Summary Cards.
 */
export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

/**
 * Type for Time-based charts (e.g., Balance over time).
 */
export interface TimeSeriesData {
  date: string;
  income: number;
  expenses: number;
}

/**
 * Type for Categorical charts (e.g., Spending by Category).
 */
export interface CategoryData {
  category: TransactionCategory;
  value: number;
  fill?: string; // Optional for custom chart colors
}

/**
 * Helper for the Insight section observations.
 */
export interface FinanceInsight {
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  value?: string | number;
}