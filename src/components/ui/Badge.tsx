import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'neutral' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral' }) => {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    error: "bg-rose-50 text-rose-700 border-rose-100",
    neutral: "bg-slate-50 text-slate-700 border-slate-100",
    info: "bg-blue-50 text-blue-700 border-blue-100"
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}`}>
      {children}
    </span>
  );
};