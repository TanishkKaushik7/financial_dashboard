import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  headerAction,
}) => {
  return (
    <div
      className={`
        bg-white dark:bg-slate-900
        rounded-2xl
        border border-slate-200/80 dark:border-slate-800
        shadow-sm hover:shadow-md dark:shadow-slate-950/50 dark:hover:shadow-slate-950/70
        transition-shadow duration-300
        overflow-hidden
        ${className}
      `}
    >
      {(title || subtitle || headerAction) && (
        <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {title && (
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-snug">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="shrink-0">{headerAction}</div>
          )}
        </div>
      )}

      {(title || subtitle || headerAction) && (
        <div className="h-px bg-linear-to-r from-slate-100 dark:from-slate-800 via-slate-200/60 dark:via-slate-700/40 to-transparent mx-5" />
      )}

      <div className="p-5">{children}</div>
    </div>
  );
};