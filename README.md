# Zorvyn Finance Dashboard

A personal finance dashboard built with React, TypeScript, and Tailwind CSS. It provides an overview of income and expenses, transaction management, and AI-generated spending insights — with full dark mode support and a responsive layout for both desktop and mobile.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecure](#architecture)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Design Decisions](#design-decisions)

---

## Overview

Zoryn is a client-side financial dashboard that runs entirely in the browser with no backend. All data is seeded from a mock dataset and managed in-memory via Zustand. The application supports two roles — Admin and Viewer — with role-based access controlling which actions are available in the UI.

---

## Features

### Dashboard
- Summary cards showing total balance, total income, and total expenses
- Balance trend chart displaying income versus expenses over time (bar chart)
- Spending breakdown chart by category (donut chart)
- Monthly trend line chart showing income versus expenses across all 12 months
- Staggered entrance animations on page load

### Transactions
- Full transaction table with search, category, and type filters
- Add, edit, and delete transactions (Admin only)
- Inline add-transaction form with smooth slide-down animation
- CSV export of the current filtered view, compatible with Excel and Google Sheets
- Action buttons always visible on mobile, hover-revealed on desktop

### Insights
- Automatically generated financial insights based on transaction data
- Cards categorised as positive, negative, or neutral with colour-coded indicators
- Educational tips section below the insight grid

### Dark Mode
- System preference detection on first load
- Manual toggle via the header button on desktop
- Manual toggle via the navigation drawer on mobile
- Preference persisted to localStorage across sessions
- Smooth 200ms transitions on all colour changes

### Role Switching
- Viewer mode: read-only access, no add/edit/delete controls
- Admin mode: full access to create, edit, and delete transactions
- Role switcher available in both the header (desktop) and the navigation drawer (mobile)

### Responsive Layout
- Persistent sidebar on desktop (md and above)
- Slide-in navigation drawer on mobile with backdrop dismiss
- Modals render as bottom sheets on mobile, centered dialogs on desktop
- Touch-friendly controls throughout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 with TypeScript |
| Styling | Tailwind CSS v4 |
| State management | Zustand |
| Routing | React Router v6 |
| Charts | Recharts |
| Charts | Recharts, Chart.js |
| Icons | Lucide React |
| Build tool | Vite |
| Deployment | Vercel |

---

## Project Structure

```
src/
  components/
    layout/
      Header.tsx          # Top bar with role switcher and dark mode toggle
      Sidebar.tsx         # Desktop sidebar and mobile drawer
      MainLayout.tsx      # Root layout wrapping all pages
    ui/
      Badge.tsx           # Category and status badges
      Button.tsx          # Shared button with variant support
      Card.tsx            # Shared card container
      Input.tsx           # Shared text input
  context/
    ThemeContext.tsx       # Dark mode state, system preference, localStorage persistence
  data/
    mockData.ts           # Seed transactions
  features/
    dashboard/
      DashboardPage.tsx
      components/
        SummaryCards.tsx
        BalanceTrendChart.tsx
        SpendingBreakdownChart.tsx
        MonthWiseLineGraph.tsx 
    transactions/
      TransactionsPage.tsx
      components/
        TransactionTable.tsx
        TransactionFilters.tsx
        TransactionForm.tsx
        EditTransactionModal.tsx
        DeleteTransactionModal.tsx
    insights/
      InsightsPage.tsx
      components/
        InsightCard.tsx
  store/
    useAppStore.ts        # Zustand store: transactions, filters, user role
  types/
    index.ts              # Shared TypeScript types
  utils/
    calculations.ts       # Financial summaries, chart data, insight generation
    formatters.ts         # Currency, date, and percentage formatters
```

---
## Architecture

One of the core structural decisions in this project is keeping data logic completely separate from the components that render it. This makes debugging straightforward — if a number is wrong, the problem is in `utils/`, not in a component. If something looks wrong, the problem is in the component, not in the data.

**Data layer (`src/utils/`)**

All calculations live in `calculations.ts` as plain functions that take transactions as input and return derived data as output. They have no knowledge of React, no side effects, and no imports from components or the store. `getFinancialSummary` produces the three summary numbers. `getTimeSeriesData` groups transactions by month for the bar chart. `getCategoryData` groups expenses by category for the donut chart. `getInsights` analyses patterns and returns insight objects. Because these are pure functions, they can be tested in isolation by simply calling them with a transaction array and checking the output.

`formatters.ts` follows the same principle. Every formatting function — currency, date, percentage, colour class — is a pure function with no dependencies. They are imported wherever output needs to be displayed, keeping formatting logic out of components entirely.

**State layer (`src/store/useAppStore.ts`)**

The Zustand store is the single source of truth for application data. It holds raw transactions, the current role, and filter state. It exposes actions for mutations. Components never mutate state directly — they call a store action and re-render reactively. This means the full state of the application at any point can be inspected in one place, and any mutation has one defined entry point.

**UI layer (`src/features/`, `src/components/`)**

Components are responsible only for rendering and user interaction. A page component reads from the store, passes data to utility functions to get derived values, and passes those values down to display components as props. Display components like `SummaryCards`, `InsightCard`, and `TransactionTable` do not perform calculations themselves — they receive ready-to-display data and focus purely on layout, styling, and animation.

**Practical benefit**

If the total balance is showing an incorrect value, you check `getFinancialSummary` in isolation — the component is not involved. If a chart is rendering the right data but with wrong colours in dark mode, you check the component's theme logic — the utility function is not involved. The boundary between "what is computed" and "how it is displayed" is always clear.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/TanishkKaushik7/financial_dashboard.git
cd financial_dashboard
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

The output will be in the `dist/` directory. Preview it locally with:

```bash
npm run preview
```

---

## Usage

### Switching Roles

Use the Viewer / Admin toggle in the top-right header on desktop, or open the navigation drawer on mobile. In Viewer mode, transaction controls (add, edit, delete) are hidden. In Admin mode, all controls are available.

### Adding a Transaction

Switch to Admin mode, then click "Add Transaction" on the Transactions page. Fill in the description, amount, type, category, and date, then click "Save Transaction". The form slides in inline below the header.

### Filtering Transactions

Use the search box to filter by description, the category dropdown to filter by category, and the type dropdown to filter by income or expense. The transaction count in the table toolbar updates to reflect the current filter.

### Exporting to CSV

Click "Export CSV" in the transaction table toolbar. The export reflects the current filtered view, not all transactions. The file is named with today's date and is compatible with Excel and Google Sheets.

### Dark Mode

Click the moon icon in the header (desktop) or open the navigation drawer and use the toggle at the bottom (mobile). The preference is saved and will persist on your next visit.

---

## Design Decisions

### Client-side only

There is no backend or database. All state lives in Zustand and resets on page refresh. This keeps the project self-contained and instantly deployable without any environment configuration.

### Role-based UI without authentication

Rather than implementing a login flow, role switching is exposed directly in the UI. This is intentional for the assignment — it lets reviewers explore both modes without credentials.

### Tailwind v4 dark mode

Tailwind v4 removed the `darkMode` config key. Dark mode is enabled via `@custom-variant dark (&:where(.dark, .dark *))` in `index.css`, and the `dark` class is applied to the `<html>` element by `ThemeContext`.

### Recharts and dark mode

Recharts renders SVG elements with inline styles, which Tailwind utility classes cannot override. Theme-aware colours for grid lines, axis ticks, and tooltip backgrounds are derived from the `useTheme` hook and passed as JavaScript values directly to chart props.

### Chart.js and the monthly trend chart

The monthly trend line chart uses Chart.js via react-chartjs-2 rather than Recharts. Chart.js was chosen here because its line chart with area fill and smooth bezier curves (`tension: 0.4`) produces a cleaner visual for year-over-year trend data than Recharts' equivalent. The same dark mode approach applies — Chart.js renders to a `<canvas>` element so Tailwind classes cannot reach its internals. Theme-aware colours for grid lines, axis ticks, legend labels, and tooltip backgrounds are derived from `useTheme` and passed as JavaScript values directly into the `options` object.

The monthly data itself is derived from real transactions via `getMonthlyTrendData` in `calculations.ts`, which groups transactions by the month of their date and sums income and expenses into two 12-element arrays. This means the chart reacts automatically when transactions are added or edited in Admin mode — no manual data wiring needed.

### Portals for modals

Edit and delete modals use `ReactDOM.createPortal` to render directly onto `document.body`. This prevents clipping by parent elements with `overflow: hidden`, which is present on the transaction table container.

### CSV export

Amounts are exported as signed numbers (positive for income, negative for expense) to make the file useful for summing in spreadsheet software. A UTF-8 BOM is prepended to the file so Excel reads special characters correctly without manual encoding selection.