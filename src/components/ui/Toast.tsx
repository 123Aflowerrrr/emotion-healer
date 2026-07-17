import { useUIStore } from '../../stores/useUIStore';

export function Toast() {
  const { toastMessage, toastType } = useUIStore();

  if (!toastMessage) return null;

  const colors = {
    success: 'bg-forest-500',
    info: 'bg-calm-500',
    warm: 'bg-warm-500',
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
      <div className={`${colors[toastType]} text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-medium`}>
        {toastMessage}
      </div>
    </div>
  );
}
