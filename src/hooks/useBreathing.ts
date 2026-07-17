import { useState, useEffect, useCallback, useRef } from 'react';

export type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

const INHALE_DURATION = 4000;
const HOLD_DURATION = 7000;
const EXHALE_DURATION = 8000;

export function useBreathing() {
  const [phase, setPhase] = useState<BreathPhase>('rest');
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const runCycle = useCallback(() => {
    setPhase('inhale');
    timerRef.current = window.setTimeout(() => {
      setPhase('hold');
      timerRef.current = window.setTimeout(() => {
        setPhase('exhale');
        timerRef.current = window.setTimeout(() => {
          setPhase('inhale');
        }, EXHALE_DURATION);
      }, HOLD_DURATION);
    }, INHALE_DURATION);
  }, []);

  const start = useCallback(() => {
    setIsActive(true);
    runCycle();
  }, [runCycle]);

  const stop = useCallback(() => {
    setIsActive(false);
    clearTimer();
    setPhase('rest');
  }, [clearTimer]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return {
    phase,
    isActive,
    start,
    stop,
    phaseLabel:
      phase === 'inhale' ? '吸气... (4秒)' :
      phase === 'hold' ? '屏住呼吸... (7秒)' :
      phase === 'exhale' ? '慢慢呼出... (8秒)' :
      '准备开始',
    phaseDuration:
      phase === 'inhale' ? INHALE_DURATION :
      phase === 'hold' ? HOLD_DURATION :
      phase === 'exhale' ? EXHALE_DURATION : 0,
  };
}
