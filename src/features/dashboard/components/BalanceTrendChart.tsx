import { useState, useRef, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useAppStore } from '../../../store/useAppStore';
import { getTimeSeriesData } from '../../../utils/calculations';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Card } from '../../../components/ui/Card';
import { useTheme } from '../../../context/ThemeContext';

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-white dark:bg-slate-800 px-4 py-3 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl min-w-160px"
      style={{ animation: 'tooltipIn 0.15s ease-out forwards' }}
    >
      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
        {formatDate(label)}
      </p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center justify-between gap-6 text-xs mb-1 last:mb-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500 dark:text-slate-400 capitalize">{entry.name}</span>
          </div>
          <span className="text-slate-900 dark:text-white font-bold tabular-nums">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Animated Legend ──────────────────────────────────────────────────────────

const AnimatedLegend = ({ visible }: { visible: boolean }) => (
  <div
    className="flex items-center justify-end gap-4 pb-4 transition-all duration-500"
    style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-6px)',
    }}
  >
    {[
      { label: 'Income',   color: '#10b981' },
      { label: 'Expenses', color: '#f43f5e' },
    ].map(({ label, color }) => (
      <div key={label} className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      </div>
    ))}
  </div>
);

// ─── Custom Bar Shape ─────────────────────────────────────────────────────────

const GlowBar = (props: any) => {
  const { x, y, width, height, fill, isHovered } = props;
  if (!height || height <= 0) return null;
  return (
    <g>
      {isHovered && (
        <rect
          x={x - 3} y={y - 3}
          width={width + 6} height={height + 3}
          rx={6} fill={fill} opacity={0.15}
          style={{ filter: 'blur(6px)' }}
        />
      )}
      <rect
        x={x} y={y} width={width} height={height}
        rx={4} fill={fill}
        opacity={isHovered ? 1 : 0.85}
        style={{
          transition: 'opacity 0.2s ease, filter 0.2s ease',
          filter: isHovered ? 'brightness(1.1)' : 'none',
        }}
      />
    </g>
  );
};

// ─── Main Chart ───────────────────────────────────────────────────────────────

const BalanceTrendChart = () => {
  const { transactions } = useAppStore();
  const { theme } = useTheme();
  const data = getTimeSeriesData(transactions);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Theme-aware colors for recharts elements
  const isDark       = theme === 'dark';
  const gridColor    = isDark ? '#1e293b' : '#f1f5f9';
  const tickColor    = isDark ? '#475569' : '#94a3b8';
  const cursorColor  = isDark ? '#1e293b' : '#f8fafc';

  return (
    <>
      <style>{`
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateY(4px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>

      <Card title="Balance Trend" subtitle="Income vs Expenses over time" className="flex flex-col">
        <AnimatedLegend visible={visible} />

        <div ref={containerRef} className="flex-1 w-full min-h-0 min-w-0" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={1}>
            <BarChart
              data={data}
              margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
              barCategoryGap="30%"
              barGap={4}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: tickColor, fontSize: 11 }}
                tickFormatter={(v) => formatDate(v).split(' ')[0]}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: tickColor, fontSize: 11 }}
                tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                width={52}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorColor, rx: 4 }} />

              <Bar
                dataKey="income"
                name="Income"
                maxBarSize={36}
                radius={[4, 4, 0, 0]}
                animationBegin={visible ? 0 : 99999}
                animationDuration={800}
                animationEasing="ease-out"
                shape={(props: any) => (
                  <GlowBar {...props} fill="#10b981" isHovered={hoveredIndex === props.index} />
                )}
                onMouseEnter={(_: any, index: number) => setHoveredIndex(index)}
              >
                {data.map((_, index) => <Cell key={index} fill="#10b981" />)}
              </Bar>

              <Bar
                dataKey="expenses"
                name="Expenses"
                maxBarSize={36}
                radius={[4, 4, 0, 0]}
                animationBegin={visible ? 150 : 99999}
                animationDuration={800}
                animationEasing="ease-out"
                shape={(props: any) => (
                  <GlowBar {...props} fill="#f43f5e" isHovered={hoveredIndex === props.index} />
                )}
                onMouseEnter={(_: any, index: number) => setHoveredIndex(index)}
              >
                {data.map((_, index) => <Cell key={index} fill="#f43f5e" />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
};

export default BalanceTrendChart;