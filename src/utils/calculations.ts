// src/utils/calculations.ts
import type { 
  Transaction, 
  FinancialSummary, 
  CategoryData, 
  TimeSeriesData, 
  FinanceInsight 
} from '../types';

/**
 * Calculates the top-level totals for the summary cards.
 */
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

/**
 * Groups expenses by category for the Pie/Doughnut chart.
 */
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

/**
 * Groups transactions by date for the Trend line/bar chart.
 * This sorts them chronologically.
 */
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

/**
 * Generates automated insights based on the transaction history.
 */
export const getInsights = (transactions: Transaction[]): FinanceInsight[] => {
  const insights: FinanceInsight[] = [];
  const { totalIncome, totalExpenses } = getFinancialSummary(transactions);

  // 1. Savings Rate Insight
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  insights.push({
    title: 'Savings Rate',
    description: `You are currently saving ${savingsRate.toFixed(1)}% of your total income.`,
    type: savingsRate > 20 ? 'positive' : 'neutral',
    value: `${savingsRate.toFixed(0)}%`,
  });

  // 2. Highest Spending Category
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

  // 3. Simple Alert
  if (totalExpenses > totalIncome) {
    insights.push({
      title: 'Spending Alert',
      description: 'Your total expenses have exceeded your income for this period.',
      type: 'negative',
    });
  }

  return insights;
};