import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useReleaseStore } from '../stores/useReleaseStore';
import { useAnimalStore } from '../stores/useAnimalStore';
import { SEDONA_STEPS } from '../data/sedonaContent';
import { ReleaseStepCard } from '../components/release/ReleaseStepCard';

export function ReleasePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sceneId = searchParams.get('sceneId') || 'forest';

  const {
    activeSession,
    startSession,
    nextStep,
    previousStep,
    recordIntensity,
    completeSession,
  } = useReleaseStore();

  const { activeCompanion } = useAnimalStore();
  const [intensity, setIntensity] = useState(5);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    if (!activeSession) {
      startSession(sceneId, activeCompanion?.id || 'cat');
    }
  }, []);

  if (!activeSession) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <p className="text-warm-400">加载中...</p>
      </div>
    );
  }

  if (showCompletion || activeSession.completed) {
    const step = activeSession.currentStep;
    const stepConfig = SEDONA_STEPS[Math.min(step, 4)];

    return (
      <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center px-6 safe-top safe-bottom">
        <div className="text-7xl animate-bounce-gentle mb-6">🎉</div>
        <h2 className="text-2xl font-serif text-warm-800 mb-3">你做得很好</h2>
        <p className="text-warm-500 text-center mb-2 leading-relaxed max-w-xs">
          你勇敢地面对了自己的情绪。每一次释放，都是一次温柔的自我关怀。
        </p>
        <p className="text-sm text-warm-400 italic mb-8">「{stepConfig?.affirmation || '允许一切发生'}」</p>

        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={() => navigate(-1)}
            className="ghost-btn flex-1"
          >
            返回场景
          </button>
          <button
            onClick={() => {
              useReleaseStore.getState().cancelSession();
              setShowCompletion(false);
              startSession(sceneId, activeCompanion?.id || 'cat');
            }}
            className="warm-btn flex-1"
          >
            再做一次
          </button>
        </div>
      </div>
    );
  }

  const currentStep = activeSession.currentStep;
  const stepConfig = SEDONA_STEPS[currentStep];

  const handleNext = () => {
    recordIntensity(intensity);
    if (currentStep >= SEDONA_STEPS.length - 1) {
      completeSession();
      setShowCompletion(true);
    } else {
      nextStep();
      setIntensity(5);
    }
  };

  const handleBack = () => {
    previousStep();
    setIntensity(5);
  };

  return (
    <div className="min-h-screen bg-warm-50 safe-top safe-bottom">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-warm-600 shadow-sm"
        >
          ←
        </button>
        <h2 className="text-lg font-serif text-warm-800">圣多纳释放法</h2>
        <div className="w-10" />
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {SEDONA_STEPS.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i < currentStep
                ? 'bg-forest-400'
                : i === currentStep
                ? 'bg-warm-400 w-6'
                : 'bg-warm-200'
            }`}
          />
        ))}
      </div>

      {/* Step labels */}
      <div className="flex justify-center gap-2 px-4 mb-6">
        {SEDONA_STEPS.map((s, i) => (
          <span
            key={i}
            className={`text-xs transition-all duration-300 ${
              i <= currentStep ? 'text-warm-500 font-medium' : 'text-warm-300'
            }`}
          >
            {s.stepNumber}. {s.title}
          </span>
        ))}
      </div>

      {/* Step content */}
      <div className="px-4">
        <ReleaseStepCard
          stepConfig={stepConfig}
          intensity={intensity}
          onIntensityChange={setIntensity}
          onNext={handleNext}
          onBack={handleBack}
          isFirst={currentStep === 0}
          isLast={currentStep === SEDONA_STEPS.length - 1}
        />
      </div>
    </div>
  );
}
