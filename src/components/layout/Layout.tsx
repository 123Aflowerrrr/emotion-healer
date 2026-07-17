import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Toast } from '../ui/Toast';
import { JournalSheet } from '../journal/JournalSheet';
import { ChatSheet } from '../chat/ChatSheet';
import { HistorySheet } from '../history/HistorySheet';
import { SettingsSheet } from './SettingsSheet';

export function Layout() {
  return (
    <div className="min-h-screen bg-warm-50 relative overflow-hidden">
      <Outlet />
      <BottomNav />
      <Toast />
      <JournalSheet />
      <ChatSheet />
      <HistorySheet />
      <SettingsSheet />
    </div>
  );
}
