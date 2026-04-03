// This component renders the Spending Breakdown chart on the dashboard.
import { useState, useRef, useEffect } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector,
} from 'recharts';
import { useAppStore } from '../../../store/useAppStore';
import { getCategoryData } from '../../../utils/calculations';
import { formatCurrency } from '../../../utils/formatters';
import { Card } from '../../../components/ui/Card';
import { useTheme } from '../../../context/ThemeContext';

const COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444',
  '#8b5cf6', '#06b6d4', '#ec4899', '#94a3b8',
];


const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div
      className="bg-white dark:bg-slate-800 px-4 py-3 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl min-w-35"
      style={{ animation: 'tooltipIn 0.15s ease-out forwards' }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: entry.payload.fill }}
        />
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate">
          {entry.name}
        </p>
      </div>
      <p className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
        {formatCurrency(entry.value)}
      </p>
    </div>
  );
};


const ActiveSlice = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx} cy={cy}
        innerRadius={outerRadius + 4}
        outerRadius={outerRadius + 10}
        startAngle={startAngle} endAngle={endAngle}
        fill={fill} opacity={0.2}
      />
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle} endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};


const AnimatedLegend = ({
  data, activeIndex, onHover, visible, isDark,
}: {
  data: any[];
  activeIndex: number | null;
  onHover: (i: number | null) => void;
  visible: boolean;
  isDark: boolean;
}) => (
  <ul className="flex flex-col gap-1.5 justify-center pl-3 pr-1">
    {data.map((entry, index) => {
      const isActive = activeIndex === index;
      const isDimmed = activeIndex !== null && !isActive;
      const dimmedText  = isDark ? '#334155' : '#94a3b8'; // slate-700 / slate-400
      const normalText  = isDark ? '#94a3b8' : '#475569'; // slate-400 / slate-600

      return (
        <li
          key={index}
          className="flex items-center gap-2 min-w-0 cursor-pointer rounded-lg px-2 py-1 transition-all duration-200"
          style={{
            opacity: visible ? (isDimmed ? 0.35 : 1) : 0,
            transform: visible ? 'translateX(0)' : 'translateX(8px)',
            transitionDelay: visible ? `${index * 50}ms` : '0ms',
            backgroundColor: isActive ? `${COLORS[index % COLORS.length]}14` : 'transparent',
          }}
          onMouseEnter={() => onHover(index)}
          onMouseLeave={() => onHover(null)}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0 transition-transform duration-200"
            style={{
              backgroundColor: COLORS[index % COLORS.length],
              transform: isActive ? 'scale(1.4)' : 'scale(1)',
            }}
          />
          <span
            className="text-xs truncate leading-tight transition-all duration-200"
            style={{
              color: isActive ? COLORS[index % COLORS.length] : (isDimmed ? dimmedText : normalText),
              fontWeight: isActive ? 600 : 400,
            }}
          >
            {entry.category}
          </span>
        </li>
      );
    })}
  </ul>
);


const TotalBar = ({
  activeIndex, data, total, visible, isDark,
}: {
  activeIndex: number | null;
  data: any[];
  total: number;
  visible: boolean;
  isDark: boolean;
}) => {
  const isActive   = activeIndex !== null;
  const label      = isActive ? data[activeIndex].category : 'Total spent';
  const value      = isActive ? data[activeIndex].value    : total;
  const color      = isActive
    ? COLORS[activeIndex % COLORS.length]
    : (isDark ? '#f1f5f9' : '#0f172a'); // slate-100 / slate-950

  return (
    <div
      className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        {isActive && (
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
        )}
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate">
          {label}
        </span>
      </div>
      <span
        className="text-sm font-bold tabular-nums shrink-0 transition-colors duration-200"
        style={{ color }}
      >
        {formatCurrency(value)}
      </span>
    </div>
  );
};


const SpendingBreakdownChart = () => {
  const { transactions } = useAppStore();
  const { theme } = useTheme();
  const data = getCategoryData(transactions);
  const isDark = theme === 'dark';

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visible, setVisible]         = useState(false);
  const containerRef                  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (data.length === 0) {
    return (
      <Card title="Spending Breakdown" subtitle="Expenses by category">
        <div className="h-70 flex items-center justify-center text-slate-400 dark:text-slate-600 text-sm">
          No expense data available to display.
        </div>
      </Card>
    );
  }

  return (
    <>
      <style>{`
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateY(4px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>

      <Card title="Spending Breakdown" subtitle="Where your money goes" className="flex flex-col">
        <div ref={containerRef} className="flex-1 w-full min-w-0 mt-4" style={{ height: 260 }}>
          <div className="flex h-full gap-2">

            {/* Pie */}
            <div className="flex-1 min-w-0">
              <ResponsiveContainer width="100%" height="100%" debounce={1}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%" cy="50%"
                    innerRadius="40%" outerRadius="64%"
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="category"
                    strokeWidth={0}
                    activeShape={ActiveSlice}
                    animationBegin={visible ? 0 : 99999}
                    animationDuration={900}
                    animationEasing="ease-out"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {data.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                        style={{ transition: 'opacity 0.2s ease' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-128px shrink-0 flex items-center">
              <AnimatedLegend
                data={data}
                activeIndex={activeIndex}
                onHover={setActiveIndex}
                visible={visible}
                isDark={isDark}
              />
            </div>
          </div>
        </div>

        <TotalBar
          activeIndex={activeIndex}
          data={data}
          total={total}
          visible={visible}
          isDark={isDark}
        />
      </Card>
    </>
  );
};

export default SpendingBreakdownChart;