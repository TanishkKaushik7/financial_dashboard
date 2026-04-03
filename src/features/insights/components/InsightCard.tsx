import React from 'react';
import { AlertCircle, CheckCircle2, Lightbulb, ArrowRight } from 'lucide-react';
import type { FinanceInsight } from '../../../types';
import { Card } from '../../../components/ui/Card';

interface InsightCardProps {
  insight: FinanceInsight;
}

const TYPE_CONFIG = {
  positive: {
    icon: CheckCircle2,
    color:       'text-emerald-600 dark:text-emerald-400',
    bgColor:     'bg-emerald-50 dark:bg-emerald-950',
    borderColor: 'border-emerald-200 dark:border-emerald-900',
  },
  negative: {
    icon: AlertCircle,
    color:       'text-rose-600 dark:text-rose-400',
    bgColor:     'bg-rose-50 dark:bg-rose-950',
    borderColor: 'border-rose-200 dark:border-rose-900',
  },
  neutral: {
    icon: Lightbulb,
    color:       'text-amber-600 dark:text-amber-400',
    bgColor:     'bg-amber-50 dark:bg-amber-950',
    borderColor: 'border-amber-200 dark:border-amber-900',
  },
} as const;

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const config = TYPE_CONFIG[insight.type ?? 'neutral'];
  const Icon = config.icon;

  return (
    <Card
      className={`
        border-l-4 ${config.borderColor}
        hover:translate-x-1 transition-transform duration-200
      `}
    >
      <div className="flex items-start gap-3 sm:gap-4">

        {/* Icon badge */}
        <div className={`p-2.5 rounded-xl shrink-0 ${config.bgColor} ${config.color}`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* Title row */}
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1 mb-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
              {insight.title}
            </h4>
            {insight.value && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${config.bgColor} ${config.color}`}>
                {insight.value}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
            {insight.description}
          </p>

          {/* Action */}
          <button
            className={`
              inline-flex items-center gap-1 text-xs font-semibold
              ${config.color} opacity-70 hover:opacity-100
              transition-opacity duration-150 group
            `}
          >
            View Analysis
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-150" />
          </button>

        </div>
      </div>
    </Card>
  );
};

export default InsightCard;