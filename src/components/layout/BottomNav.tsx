import { useNavigate, useLocation } from 'react-router-dom';
import { useUIStore } from '../../stores/useUIStore';
import type { SheetType } from '../../types';

const NAV_ITEMS: { icon: string; label: string; sheet: SheetType; path?: string }[] = [
  { icon: '🏠', label: '场景', sheet: null, path: '/' },
  { icon: '📝', label: '日记', sheet: 'journal' },
  { icon: '🧘', label: '释放', sheet: null, path: '/release' },
  { icon: '📊', label: '轨迹', sheet: 'history' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openSheet, closeSheet, activeSheet } = useUIStore();

  const handleNav = (item: typeof NAV_ITEMS[0]) => {
    if (item.path) {
      closeSheet();
      navigate(item.path);
    } else if (item.sheet) {
      if (activeSheet === item.sheet) {
        closeSheet();
      } else {
        openSheet(item.sheet);
      }
    } else {
      closeSheet();
      navigate('/');
    }
  };

  const isActive = (item: typeof NAV_ITEMS[0]) => {
    if (item.path === '/') return location.pathname === '/';
    if (item.sheet) return activeSheet === item.sheet;
    return false;
  };

  if (location.pathname.includes('/release')) return null;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-30 safe-bottom">
      <div className="mx-4 mb-2 bg-white/85 backdrop-blur-xl rounded-2xl shadow-lg shadow-warm-900/5 border border-white/50 px-2 py-1.5 flex justify-around">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => handleNav(item)}
            className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all duration-200 min-w-[56px] ${
              isActive(item)
                ? 'text-warm-600 bg-warm-100 scale-105'
                : 'text-warm-400 hover:text-warm-500 active:bg-warm-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
