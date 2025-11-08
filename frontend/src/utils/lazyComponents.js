// Lazy-loaded heavy components for performance
import { lazy } from 'react';

// Chart components (heavy Recharts imports)
export const LazyLineChart = lazy(() => import('recharts').then(m => ({ default: m.LineChart })));
export const LazyBarChart = lazy(() => import('recharts').then(m => ({ default: m.BarChart })));
export const LazyPieChart = lazy(() => import('recharts').then(m => ({ default: m.PieChart })));

// Pages with heavy dependencies
export const LazyAnalyticsPage = lazy(() => import('../pages/AnalyticsPage'));
export const LazyHealthMetricsPage = lazy(() => import('../pages/HealthMetricsPage'));
export const LazyClientProgressPage = lazy(() => import('../pages/ClientProgressPage'));
