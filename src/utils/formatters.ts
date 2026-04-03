// src/utils/formatters.ts

/**
 * Formats a number as an Indian Rupee (INR) string.
 * Example: 100000 -> "₹1,00,000.00"
 */
export const formatCurrency = (
  amount: number, 
  currency: string = 'INR', 
  locale: string = 'en-IN' // Important for the 2,2,3 grouping (Lakhs/Crores)
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats an ISO date string (YYYY-MM-DD) into an Indian-friendly format.
 * Example: "2026-04-01" -> "01 Apr 2026"
 */
export const formatDate = (dateString: string, locale: string = 'en-IN'): string => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Formats a number as a percentage string.
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

/**
 * UI Helper: Returns a Tailwind color class based on transaction type.
 */
export const getAmountColorClass = (type: 'income' | 'expense'): string => {
  return type === 'income' ? 'text-emerald-600' : 'text-rose-600';
};