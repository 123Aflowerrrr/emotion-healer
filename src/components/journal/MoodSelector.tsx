import type { MoodLevel } from '../../types';
import { MOOD_OPTIONS } from '../../data/feelings';

interface MoodSelectorProps {
  selected: MoodLevel | null;
  onSelect: (mood: MoodLevel) => void;
}

export function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div className="py-6">
      <p className="text-center text-warm-600 text-sm mb-6">此刻你的心情如何？</p>
      <div className="flex justify-center gap-3 px-4">
        {MOOD_OPTIONS.map((option) => (
          <button
            key={option.level}
            onClick={() => onSelect(option.level)}
            className={`mood-card flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 ${
              selected === option.level
                ? 'selected bg-white shadow-lg'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            style={{
              borderColor: selected === option.level ? option.color : 'transparent',
              borderWidth: selected === option.level ? '2px' : '0',
            }}
          >
            <span className="text-3xl transition-transform duration-300">{option.emoji}</span>
            <span className="text-xs text-warm-600 font-medium whitespace-nowrap">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
