import { useUIStore } from '../../stores/useUIStore';
import { useEmotionStore } from '../../stores/useEmotionStore';
import { MOOD_OPTIONS } from '../../data/feelings';
import { useState, useMemo } from 'react';

export function HistorySheet() {
  const { activeSheet, closeSheet } = useUIStore();
  const entries = useEmotionStore((s) => s.entries);
  const [viewMode, setViewMode] = useState<'timeline' | 'stats'>('timeline');

  const isOpen = activeSheet === 'history';
  if (!isOpen) return null;

  const moodStats = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach((e) => {
      counts[e.mood] = (counts[e.mood] || 0) + 1;
    });
    const total = entries.length || 1;
    return MOOD_OPTIONS.map((opt) => ({
      ...opt,
      count: counts[opt.level] || 0,
      percent: Math.round(((counts[opt.level] || 0) / total) * 100),
    }));
  }, [entries]);

  const groupedEntries = useMemo(() => {
    const groups: Record<string, typeof entries> = {};
    entries.forEach((e) => {
      if (!groups[e.date]) groups[e.date] = [];
      groups[e.date].push(e);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [entries]);

  return (
    <>
      <div className="sheet-overlay" onClick={closeSheet} />
      <div className="sheet-content animate-slide-up" style={{ maxHeight: '80vh' }}>
        <div className="drag-handle" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2">
          <h3 className="text-lg font-serif text-warm-800">情绪轨迹</h3>
          <div className="flex gap-1 bg-warm-50 rounded-full p-0.5">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === 'timeline' ? 'bg-white text-warm-600 shadow-sm' : 'text-warm-400'
              }`}
            >
              时间线
            </button>
            <button
              onClick={() => setViewMode('stats')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === 'stats' ? 'bg-white text-warm-600 shadow-sm' : 'text-warm-400'
              }`}
            >
              统计
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-4 pb-6" style={{ maxHeight: 'calc(80vh - 80px)' }}>
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-5xl mb-4 block">📝</span>
              <p className="text-warm-500">还没有情绪记录</p>
              <p className="text-sm text-warm-400 mt-1">开始记录你的第一个心情吧</p>
            </div>
          ) : viewMode === 'timeline' ? (
            <div className="space-y-4">
              {groupedEntries.slice(0, 30).map(([date, dayEntries]) => (
                <div key={date}>
                  <p className="text-xs text-warm-400 font-medium mb-2 ml-1">{date}</p>
                  <div className="space-y-2">
                    {dayEntries.map((entry) => {
                      const moodOpt = MOOD_OPTIONS.find((m) => m.level === entry.mood);
                      return (
                        <div
                          key={entry.id}
                          className="bg-white/80 rounded-xl p-3 flex items-start gap-3"
                        >
                          <span className="text-2xl">{moodOpt?.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-warm-700 line-clamp-2">{entry.note || '(无文字记录)'}</p>
                            {entry.feelingTags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {entry.feelingTags.slice(0, 4).map((tag) => (
                                  <span key={tag} className="px-2 py-0.5 bg-warm-50 rounded-full text-xs text-warm-500">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-warm-400 mt-1">
                              强度: {entry.intensity}/10
                            </p>
                          </div>
                          <span className="text-xs text-warm-300 whitespace-nowrap">
                            {new Date(entry.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {/* Mood distribution */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-warm-600 mb-3">心情分布</h4>
                <div className="space-y-2">
                  {moodStats.map((stat) => (
                    <div key={stat.level} className="flex items-center gap-3">
                      <span className="text-xl w-8 text-center">{stat.emoji}</span>
                      <div className="flex-1 h-6 bg-warm-50 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${stat.percent}%`,
                            backgroundColor: stat.color,
                            opacity: 0.7,
                          }}
                        />
                      </div>
                      <span className="text-xs text-warm-500 w-12 text-right">
                        {stat.count}次 ({stat.percent}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white/80 rounded-2xl p-4">
                <h4 className="text-sm font-medium text-warm-600 mb-2">小结</h4>
                <p className="text-sm text-warm-500 leading-relaxed">
                  共记录了 <span className="font-medium text-warm-700">{entries.length}</span> 条心情，
                  覆盖了 <span className="font-medium text-warm-700">{groupedEntries.length}</span> 天。
                  {moodStats.find(s => s.level === 'great' || s.level === 'good') && '继续保持积极的记录习惯吧！✨'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
