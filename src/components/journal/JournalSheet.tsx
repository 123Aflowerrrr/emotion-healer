import { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useEmotionStore } from '../../stores/useEmotionStore';
import { useSceneStore } from '../../stores/useSceneStore';
import { useAnimalStore } from '../../stores/useAnimalStore';
import { MoodSelector } from './MoodSelector';
import { FeelingTagCloud } from './FeelingTagCloud';
import { JournalEditor } from './JournalEditor';
import type { MoodLevel } from '../../types';

export function JournalSheet() {
  const { activeSheet, closeSheet } = useUIStore();
  const addEntry = useEmotionStore((s) => s.addEntry);
  const currentSceneId = useSceneStore((s) => s.currentSceneId);
  const { activeCompanion, showCompanionMessage } = useAnimalStore();

  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<MoodLevel | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [saving, setSaving] = useState(false);

  const isOpen = activeSheet === 'journal';

  if (!isOpen) return null;

  const handleMoodSelect = (m: MoodLevel) => {
    setMood(m);
    setStep(1);
  };

  const handleTagToggle = (tagId: string) => {
    setTags((prev) => (prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]));
  };

  const handleSave = async () => {
    if (!mood || !currentSceneId) return;
    setSaving(true);
    await addEntry({
      date: new Date().toISOString().split('T')[0],
      sceneId: currentSceneId,
      mood,
      feelingTags: tags,
      note,
      intensity,
      animalCompanion: activeCompanion?.id || 'cat',
    });
    setSaving(false);
    setStep(3);

    // Show animal reaction
    const isNegative = mood === 'very_sad' || mood === 'sad';
    if (isNegative) {
      showCompanionMessage('我感受到你的情绪了... 谢谢你愿意把它写下来 💛');
    } else {
      showCompanionMessage('看到你开心我也很高兴呢！✨');
    }

    setTimeout(() => {
      closeSheet();
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setStep(0);
    setMood(null);
    setTags([]);
    setNote('');
    setIntensity(5);
  };

  const handleClose = () => {
    closeSheet();
    setTimeout(resetForm, 300);
  };

  const isNegative = mood === 'very_sad' || mood === 'sad';

  return (
    <>
      <div className="sheet-overlay" onClick={handleClose} />
      <div className="sheet-content animate-slide-up">
        <div className="drag-handle" />

        {/* Steps indicator */}
        {step < 3 && (
          <div className="flex justify-center gap-2 mb-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-warm-400 w-5' : 'bg-warm-200'
                }`}
              />
            ))}
          </div>
        )}

        {/* Step content */}
        {step === 0 && <MoodSelector selected={mood} onSelect={handleMoodSelect} />}
        {step === 1 && (
          <FeelingTagCloud
            selected={tags}
            onToggle={handleTagToggle}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && (
          <JournalEditor
            value={note}
            onChange={setNote}
            intensity={intensity}
            onIntensityChange={setIntensity}
            onSave={handleSave}
            onBack={() => setStep(1)}
            saving={saving}
            isNegative={isNegative}
          />
        )}

        {/* Completion */}
        {step === 3 && (
          <div className="py-10 text-center">
            <div className="text-5xl animate-bounce-gentle mb-4">🌸</div>
            <p className="text-xl font-serif text-warm-700 mb-2">记录已保存</p>
            <p className="text-sm text-warm-500">每一次记录，都是对自己的温柔照顾</p>
          </div>
        )}
      </div>
    </>
  );
}
