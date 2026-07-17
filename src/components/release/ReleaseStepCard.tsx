import type { SedonaStepConfig } from '../../types';
import { useAnimalStore } from '../../stores/useAnimalStore';
import { useBreathing } from '../../hooks/useBreathing';
import { useState } from 'react';

interface ReleaseStepCardProps {
  stepConfig: SedonaStepConfig;
  intensity: number;
  onIntensityChange: (val: number) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function ReleaseStepCard({
  stepConfig,
  intensity,
  onIntensityChange,
  onNext,
  onBack,
  isFirst,
  isLast,
}: ReleaseStepCardProps) {
  const { activeCompanion, showCompanionMessage } = useAnimalStore();
  const { phase, isActive, start, stop } = useBreathing();
  const [breathingStarted, setBreathingStarted] = useState(false);

  const handleStartBreathing = () => {
    if (isActive) {
      stop();
      setBreathingStarted(false);
    } else {
      start();
      setBreathingStarted(true);
      const companionMsg = activeCompanion?.sedonaGuidance[stepConfig.step] || '慢慢来，我在这里陪着你 💛';
      showCompanionMessage(companionMsg);
    }
  };

  return (
    <div className="flex flex-col items-center text-center px-4">
      {/* Companion guide */}
      <div className="text-6xl mb-4 animate-float-slow">
        {activeCompanion?.emoji || '🐱'}
      </div>

      {/* Step title */}
      <h3 className="text-xl font-serif text-warm-800 mb-2">
        {stepConfig.title}
      </h3>

      {/* Guidance text */}
      <p className="text-sm text-warm-600 leading-relaxed mb-6 max-w-xs">
        {stepConfig.guidance}
      </p>

      {/* Breathing circle */}
      <div
        onClick={handleStartBreathing}
        className="cursor-pointer"
      >
        <div className={`breath-circle ${
          breathingStarted ? {
            inhale: 'inhale',
            hold: 'hold',
            exhale: 'exhale',
            rest: '',
          }[phase] : ''
        } flex items-center justify-center`}>
          <div className="text-center">
            {!breathingStarted ? (
              <p className="text-warm-400 text-sm">点我开始呼吸练习</p>
            ) : (
              <p className="text-warm-500 font-medium text-sm">
                {phase === 'inhale' ? '吸气...' :
                 phase === 'hold' ? '屏住...' :
                 phase === 'exhale' ? '呼出...' : ''}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Intensity */}
      <div className="w-full max-w-xs mt-6">
        <div className="flex justify-between text-xs text-warm-400 mb-1">
          <span>此刻感受的强度</span>
          <span>{intensity}/10</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={intensity}
          onChange={(e) => onIntensityChange(Number(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-calm-200 to-sunset-300 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-warm-300"
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8 w-full max-w-xs">
        {!isFirst && (
          <button onClick={onBack} className="ghost-btn flex-1">上一步</button>
        )}
        <button onClick={onNext} className="warm-btn flex-1">
          {isLast ? '完成了 ✨' : '下一步'}
        </button>
      </div>
    </div>
  );
}
