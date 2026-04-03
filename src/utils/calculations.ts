// This file contains utility functions for financial calculations and data transformations.
//  Calculating transactions, preparing data for charts, and generating insights based on financial data.
import type { 
  Transaction, 
  FinancialSummary, 
  CategoryData, 
  TimeSeriesData, 
  FinanceInsight 
} from '../types';

export const getFinancialSummary = (transactions: Transaction[]): FinancialSummary => {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpenses,
    totalBalance: totalIncome - totalExpenses,
  };
};

export const getCategoryData = (transactions: Transaction[]): CategoryData[] => {
  const expenseMap: Record<string, number> = {};

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
    });

  return Object.entries(expenseMap).map(([category, value]) => ({
    category: category as any,
    value,
  }));
};
export const getMonthlyTrendData = (transactions: Transaction[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const income   = Array(12).fill(0);
  const expenses = Array(12).fill(0);

  transactions.forEach((t) => {
    const month = new Date(t.date).getMonth();
    if (t.type === 'income') {
      income[month] += t.amount;
    } else {
      expenses[month] += t.amount;
    }
  });

  return { months, income, expenses };
};
export const getTimeSeriesData = (transactions: Transaction[]): TimeSeriesData[] => {
  const dailyMap: Record<string, { income: number; expenses: number }> = {};

  transactions.forEach((t) => {
    if (!dailyMap[t.date]) {
      dailyMap[t.date] = { income: 0, expenses: 0 };
    }
    if (t.type === 'income') {
      dailyMap[t.date].income += t.amount;
    } else {
      dailyMap[t.date].expenses += t.amount;
    }
  });

  return Object.entries(dailyMap)
    .map(([date, data]) => ({
      date,
      ...data,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getInsights = (transactions: Transaction[]): FinanceInsight[] => {
  const insights: FinanceInsight[] = [];
  const { totalIncome, totalExpenses } = getFinancialSummary(transactions);

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  insights.push({
    title: 'Savings Rate',
    description: `You are currently saving ${savingsRate.toFixed(1)}% of your total income.`,
    type: savingsRate > 20 ? 'positive' : 'neutral',
    value: `${savingsRate.toFixed(0)}%`,
  });

  const categoryData = getCategoryData(transactions);
  if (categoryData.length > 0) {
    const topCategory = categoryData.reduce((prev, current) => 
      prev.value > current.value ? prev : current
    );
    insights.push({
      title: 'Top Spending',
      description: `Your highest expenditure is on ${topCategory.category}.`,
      type: 'negative',
      value: topCategory.category,
    });
  }

  if (totalExpenses > totalIncome) {
    insights.push({
      title: 'Spending Alert',
      description: 'Your total expenses have exceeded your income for this period.',
      type: 'negative',
    });
  }

  return insights;
};