import { useUIStore } from '../../stores/useUIStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useAnimalStore } from '../../stores/useAnimalStore';

export function SettingsSheet() {
  const { activeSheet, closeSheet } = useUIStore();
  const { updateSettings } = useSettingsStore();
  const { companions, activeCompanion, setActiveCompanion } = useAnimalStore();

  const isOpen = activeSheet === 'settings';
  if (!isOpen) return null;

  return (
    <>
      <div className="sheet-overlay" onClick={closeSheet} />
      <div className="sheet-content animate-slide-up">
        <div className="drag-handle" />

        <div className="flex items-center justify-between px-5 py-2 border-b border-warm-100">
          <h3 className="text-lg font-serif text-warm-800">设置</h3>
          <button onClick={closeSheet} className="text-sm text-warm-500 font-medium">完成</button>
        </div>

        <div className="overflow-y-auto px-5 py-4 space-y-6" style={{ maxHeight: '70vh' }}>
          {/* Companion Selection */}
          <section>
            <h4 className="text-sm font-medium text-warm-600 mb-3 flex items-center gap-2">
              <span>🐾</span> 动物伙伴
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {companions.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveCompanion(c.id);
                    updateSettings({ selectedCompanionId: c.id });
                  }}
                  className={`p-3 rounded-2xl text-center transition-all duration-200 ${
                    c.unlocked
                      ? activeCompanion?.id === c.id
                        ? 'bg-warm-100 ring-2 ring-warm-300'
                        : 'bg-warm-50 hover:bg-warm-100'
                      : 'bg-gray-50 opacity-40'
                  }`}
                  disabled={!c.unlocked}
                >
                  <div className="text-3xl mb-1">{c.emoji}</div>
                  <div className="text-xs font-medium text-warm-700">{c.name}</div>
                  {!c.unlocked && <div className="text-xs text-warm-300">🔒</div>}
                </button>
              ))}
            </div>
          </section>

          {/* PWA Install */}
          <section>
            <h4 className="text-sm font-medium text-warm-600 mb-3 flex items-center gap-2">
              <span>📱</span> 添加到手机
            </h4>
            <p className="text-xs text-warm-400 leading-relaxed">
              在浏览器菜单中选择「添加到主屏幕」，即可像使用APP一样访问心晴小屋。所有数据保存在你的手机上，安全私密。
            </p>
          </section>

          {/* About */}
          <section className="text-center pb-4">
            <p className="text-sm font-serif text-warm-500">心晴小屋 🌸</p>
            <p className="text-xs text-warm-300 mt-1">
              情绪陪伴 · 自我关怀 · v1.0
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
