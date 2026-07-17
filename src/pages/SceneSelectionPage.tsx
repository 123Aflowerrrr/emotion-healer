import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSceneStore } from '../stores/useSceneStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { SceneCard } from '../components/scene/SceneCard';
import { Greeting } from '../components/ui/Greeting';

export function SceneSelectionPage() {
  const navigate = useNavigate();
  const { scenes, setCurrentScene } = useSceneStore();
  const { settings, updateSettings } = useSettingsStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleEnter = () => {
    if (!selectedId) return;
    setCurrentScene(selectedId);
    if (!settings.firstLaunchComplete) {
      updateSettings({ firstLaunchComplete: true });
    }
    navigate(`/scene/${selectedId}`);
  };

  return (
    <div className="min-h-screen pb-24 safe-top">
      <Greeting />

      {/* First launch hint */}
      {!settings.firstLaunchComplete && (
        <div className="mx-4 mb-4 p-3 bg-warm-100/60 rounded-2xl text-center animate-fade-in">
          <p className="text-sm text-warm-600">
            🌸 欢迎来到心晴小屋！选择一个让你感到舒适的场景开始吧
          </p>
        </div>
      )}

      {/* Scene grid */}
      <div className="px-4 space-y-4">
        <p className="text-sm text-warm-400 font-medium ml-1">
          选择一个场景，进入你的情绪小世界
        </p>
        {scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            isSelected={selectedId === scene.id}
            onSelect={() => handleSelect(scene.id)}
          />
        ))}
      </div>

      {/* Enter button */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 w-full max-w-lg px-4">
        <button
          onClick={handleEnter}
          disabled={!selectedId}
          className={`w-full py-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
            selectedId
              ? 'warm-btn shadow-xl shadow-warm-500/30 animate-slide-up'
              : 'bg-warm-200 text-warm-400 cursor-not-allowed'
          }`}
        >
          {selectedId ? '✨ 进入场景' : '👆 请先选择一个场景'}
        </button>
      </div>
    </div>
  );
}
