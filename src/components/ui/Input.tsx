import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-0.5">
          {label}
        </label>
      )}
      <input
        className={`
          w-full flex h-10 rounded-lg px-3 py-2 text-sm
          border border-slate-200 dark:border-slate-700
          bg-white dark:bg-slate-800
          text-slate-900 dark:text-slate-100
          placeholder:text-slate-400 dark:placeholder:text-slate-600
          focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600
          focus:ring-offset-1 dark:focus:ring-offset-slate-900
          disabled:cursor-not-allowed disabled:opacity-50
          transition-colors
          ${className}
        `}
        {...props}
      />
    </div>
  );
};