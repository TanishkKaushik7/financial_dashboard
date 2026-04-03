// Formats a number as an Indian Rupee (INR) string.
// Formats a date string into a more readable format. 
export const formatCurrency = (
  amount: number, 
  currency: string = 'INR', 
  locale: string = 'en-IN' 
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string, locale: string = 'en-IN'): string => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

export const getAmountColorClass = (type: 'income' | 'expense'): string => {
  return type === 'income' ? 'text-emerald-600' : 'text-rose-600';
};