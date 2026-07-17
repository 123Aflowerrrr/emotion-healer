import { useState } from 'react';
import { FEELING_TAGS, FEELING_CATEGORY_LABELS } from '../../data/feelings';

interface FeelingTagCloudProps {
  selected: string[];
  onToggle: (tagId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function FeelingTagCloud({ selected, onToggle, onNext, onBack }: FeelingTagCloudProps) {
  const [customInput, setCustomInput] = useState('');
  const [customTags, setCustomTags] = useState<string[]>([]);
  const allSelected = [...selected, ...customTags];

  const categories = [...new Set(FEELING_TAGS.map((t) => t.category))];

  const addCustomTag = () => {
    const tag = customInput.trim();
    if (tag && !customTags.includes(tag) && tag.length <= 8) {
      setCustomTags((prev) => [...prev, tag]);
      onToggle(`custom:${tag}`);
      setCustomInput('');
    }
  };

  return (
    <div className="py-4">
      <p className="text-center text-warm-600 text-sm mb-4">你的感受更接近哪些？（可多选）</p>
      <div className="px-4 max-h-[40vh] overflow-y-auto">
        {categories.map((cat) => {
          const catTags = FEELING_TAGS.filter((t) => t.category === cat);
          return (
            <div key={cat} className="mb-4">
              <p className="text-xs text-warm-400 font-medium mb-2 ml-1">
                {FEELING_CATEGORY_LABELS[cat] || cat}
              </p>
              <div className="flex flex-wrap gap-2">
                {catTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => onToggle(tag.id)}
                    className={`px-3.5 py-1.5 rounded-full text-sm transition-all duration-200 ${
                      selected.includes(tag.id)
                        ? 'bg-warm-400 text-white shadow-md shadow-warm-400/20'
                        : 'bg-white/80 text-warm-600 hover:bg-warm-100'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        {/* Custom tag input */}
        <div className="flex gap-2 mt-3 mb-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
            placeholder="自定义标签..."
            maxLength={8}
            className="flex-1 px-3 py-1.5 rounded-full text-sm bg-white/80 text-warm-700 placeholder-warm-300 border border-warm-100 focus:outline-none focus:border-warm-300"
          />
          <button
            onClick={addCustomTag}
            className="px-3 py-1.5 rounded-full text-sm bg-warm-100 text-warm-600 hover:bg-warm-200 transition-colors"
          >
            添加
          </button>
        </div>
        {customTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {customTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-sm bg-forest-100 text-forest-700"
              >
                {tag} ✕
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-3 px-4 mt-6">
        <button onClick={onBack} className="ghost-btn flex-1">上一步</button>
        <button onClick={onNext} className="warm-btn flex-1">
          下一步 {allSelected.length > 0 && `(${allSelected.length})`}
        </button>
      </div>
    </div>
  );
}
