import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Toast } from '../ui/Toast';
import { useUIStore } from '../../stores/useUIStore';

const JournalSheet = lazy(() => import('../journal/JournalSheet').then(m => ({ default: m.JournalSheet })));
const HistorySheet = lazy(() => import('../history/HistorySheet').then(m => ({ default: m.HistorySheet })));
const SettingsSheet = lazy(() => import('./SettingsSheet').then(m => ({ default: m.SettingsSheet })));

export function Layout() {
  const activeSheet = useUIStore((s) => s.activeSheet);

  return (
    <div className="min-h-screen bg-warm-50 relative overflow-hidden">
      <Outlet />
      <BottomNav />
      <Toast />
      <Suspense fallback={null}>
        {activeSheet === 'journal' && <JournalSheet />}
        {activeSheet === 'history' && <HistorySheet />}
        {activeSheet === 'settings' && <SettingsSheet />}
      </Suspense>
    </div>
  );
}
