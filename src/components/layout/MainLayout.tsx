// This file defines the main layout of the application, including the sidebar, header, and footer. 
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
            <Outlet />
          </div>
        </main>

        <footer className="shrink-0 px-6 md:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
            &copy; 2026 Zoryn Finance Dashboard
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;