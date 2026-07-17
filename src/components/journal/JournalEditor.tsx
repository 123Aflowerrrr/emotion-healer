import { useNavigate } from 'react-router-dom';
import { useSceneStore } from '../../stores/useSceneStore';

interface JournalEditorProps {
  value: string;
  onChange: (text: string) => void;
  intensity: number;
  onIntensityChange: (val: number) => void;
  onSave: () => void;
  onBack: () => void;
  saving: boolean;
  isNegative: boolean;
}

export function JournalEditor({
  value,
  onChange,
  intensity,
  onIntensityChange,
  onSave,
  onBack,
  saving,
  isNegative,
}: JournalEditorProps) {
  const navigate = useNavigate();
  const currentSceneId = useSceneStore((s) => s.currentSceneId);

  return (
    <div className="py-4">
      <p className="text-center text-warm-600 text-sm mb-4">写下你想说的任何话... 🌿</p>

      {/* Intensity slider */}
      <div className="px-6 mb-4">
        <div className="flex justify-between text-xs text-warm-400 mb-2">
          <span>感受强度</span>
          <span>{intensity}/10</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={intensity}
          onChange={(e) => onIntensityChange(Number(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-calm-300 via-warm-300 to-sunset-400 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-warm-300"
        />
      </div>

      {/* Text area */}
      <div className="px-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="此刻，你心里在想些什么呢..."
          rows={4}
          className="w-full p-4 rounded-2xl bg-white/80 border border-warm-100 text-warm-700 placeholder-warm-300
            focus:outline-none focus:border-warm-300 focus:ring-2 focus:ring-warm-200/50 resize-none text-sm leading-relaxed"
        />
      </div>

      {/* Quick Sedona prompt */}
      {isNegative && (
        <div className="mx-4 mt-4 p-4 bg-sunset-50 rounded-2xl border border-sunset-100">
          <p className="text-sm text-sunset-700 mb-2">💛 需要我陪你做一个释放练习吗？</p>
          <button
            onClick={() => {
              onSave();
              navigate(`/release?sceneId=${currentSceneId}`);
            }}
            className="text-sm text-sunset-600 font-medium hover:text-sunset-700 underline"
          >
            好的，带我去释放练习 →
          </button>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 px-4 mt-6">
        <button onClick={onBack} className="ghost-btn flex-1" disabled={saving}>
          上一步
        </button>
        <button onClick={onSave} className="warm-btn flex-1" disabled={saving || !value.trim()}>
          {saving ? '保存中...' : '保存记录 ✨'}
        </button>
      </div>
    </div>
  );
}
