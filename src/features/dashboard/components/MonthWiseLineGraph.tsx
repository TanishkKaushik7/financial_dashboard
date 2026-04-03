import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useTheme } from '../../../context/ThemeContext';
import { useAppStore } from '../../../store/useAppStore';
import { getMonthlyTrendData } from '../../../utils/calculations';
import { Card } from '../../../components/ui/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

const MonthWiseLineGraph: React.FC = () => {
  const { transactions } = useAppStore();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { months, income, expenses } = getMonthlyTrendData(transactions);

  const gridColor   = isDark ? '#1e293b' : '#f1f5f9';
  const tickColor   = isDark ? '#475569' : '#94a3b8';
  const legendColor = isDark ? '#94a3b8' : '#475569';

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: income,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.1)',
        pointBackgroundColor: '#10b981',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expenses',
        data: expenses,
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244,63,94,0.1)',
        pointBackgroundColor: '#f43f5e',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: legendColor,
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 6,
          useBorderRadius: true,
          padding: 16,
          font: { size: 12 },
        },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        titleColor:      isDark ? '#94a3b8' : '#64748b',
        bodyColor:       isDark ? '#f1f5f9' : '#0f172a',
        borderColor:     isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx: any) =>
            ` ${ctx.dataset.label}: ₹${ctx.parsed.y.toLocaleString('en-IN')}`,
        },
      },
    },
    scales: {
      x: {
        grid:   { color: gridColor },
        ticks:  { color: tickColor, font: { size: 11 } },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        grid:   { color: gridColor },
        ticks: {
          color: tickColor,
          font: { size: 11 },
          callback: (v: any) =>
            `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`,
        },
        border: { display: false },
      },
    },
  };

  return (
    <Card title="Monthly Trend" subtitle="Income vs Expenses across the year">
      <div style={{ height: 300 }}>
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default MonthWiseLineGraph;