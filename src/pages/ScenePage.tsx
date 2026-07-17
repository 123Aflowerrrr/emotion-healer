import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSceneStore } from '../stores/useSceneStore';
import { useAnimalStore } from '../stores/useAnimalStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useUIStore } from '../stores/useUIStore';
import { SceneBackground } from '../components/scene/SceneBackground';
import { AnimalCompanion } from '../components/animal/AnimalCompanion';

export function ScenePage() {
  const { sceneId } = useParams<{ sceneId: string }>();
  const navigate = useNavigate();
  const { scenes, setCurrentScene } = useSceneStore();
  const { settings } = useSettingsStore();
  const { setActiveCompanion, showCompanionMessage } = useAnimalStore();
  const { openSheet } = useUIStore();

  const scene = scenes.find((s) => s.id === sceneId);

  useEffect(() => {
    if (!scene) {
      navigate('/');
      return;
    }
    setCurrentScene(scene.id);

    // Set companion from settings
    if (settings.selectedCompanionId) {
      setActiveCompanion(settings.selectedCompanionId);
    }

    // Welcome message
    setTimeout(() => {
      showCompanionMessage(`欢迎来到${scene.name}~ 我在这里陪着你 🌿`);
    }, 800);
  }, [sceneId]);

  if (!scene) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Scene background with animations */}
      <SceneBackground scene={scene} />

      {/* Ambient info */}
      <div className="absolute top-0 left-0 right-0 p-5 safe-top z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-sm text-warm-600"
          >
            ←
          </button>
          <div className="glass-card px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{scene.icon}</span>
              <span className="text-sm font-medium text-warm-700">{scene.name}</span>
            </div>
          </div>
          <button
            onClick={() => openSheet('settings')}
            className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-sm text-warm-600"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Animal companion */}
      <AnimalCompanion />

      {/* Action buttons */}
      <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-4 z-10 px-4">
        <button
          onClick={() => openSheet('journal')}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/75 backdrop-blur-md shadow-lg flex items-center justify-center text-2xl
            transition-all duration-200 group-active:scale-95 group-hover:shadow-xl border border-white/50">
            📝
          </div>
          <span className="text-xs text-white font-medium drop-shadow-md bg-black/20 px-2 py-0.5 rounded-full">
            记录心情
          </span>
        </button>

        <button
          onClick={() => navigate(`/release?sceneId=${scene.id}`)}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/75 backdrop-blur-md shadow-lg flex items-center justify-center text-2xl
            transition-all duration-200 group-active:scale-95 group-hover:shadow-xl border border-white/50">
            🧘
          </div>
          <span className="text-xs text-white font-medium drop-shadow-md bg-black/20 px-2 py-0.5 rounded-full">
            释放情绪
          </span>
        </button>
      </div>
    </div>
  );
}
