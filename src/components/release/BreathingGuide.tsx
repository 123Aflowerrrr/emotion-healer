import { useBreathing } from '../../hooks/useBreathing';

export function BreathingGuide() {
  const { phase, isActive, phaseLabel, phaseDuration } = useBreathing();

  const phaseClass = isActive ? {
    inhale: 'inhale',
    hold: 'hold',
    exhale: 'exhale',
    rest: '',
  }[phase] : '';

  return (
    <div className="flex flex-col items-center py-6">
      <div className={`breath-circle ${phaseClass} flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-warm-500 font-medium text-sm">
            {isActive ? phaseLabel : '准备深呼吸...'}
          </p>
        </div>
      </div>
      {isActive && (
        <p className="text-xs text-warm-400 mt-3">
          {phaseDuration / 1000}秒
        </p>
      )}
    </div>
  );
}
