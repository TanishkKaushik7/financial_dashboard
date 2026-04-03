import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { Loader2 } from 'lucide-react';

// 1. Lazy load the page components
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const TransactionsPage = lazy(() => import('./features/transactions/TransactionsPage'));
const InsightsPage = lazy(() => import('./features/insights/InsightsPage'));

// 2. A simple Loading Fallback component
const PageLoader = () => (
  <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-3">
    <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
    <p className="text-slate-500 text-sm font-medium animate-pulse">Loading workspace...</p>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* 3. Wrap Routes in Suspense */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            
            {/* Default Route: Dashboard */}
            <Route index element={<DashboardPage />} />
            
            {/* Transaction Management Route */}
            <Route path="transactions" element={<TransactionsPage />} />
            
            {/* Data Analysis / Insights Route */}
            <Route path="insights" element={<InsightsPage />} />
            
            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
            
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;