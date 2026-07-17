import { useState } from 'react';
import { useAnimalStore } from '../../stores/useAnimalStore';

export function AnimalCompanion() {
  const {
    activeCompanion,
    companionMood,
    companionAnimation,
    message,
    showMessage,
    showCompanionMessage,
    getRandomIdleMessage,
  } = useAnimalStore();
  const [hearts, setHearts] = useState<number[]>([]);

  if (!activeCompanion) return null;

  const handleTap = () => {
    const heartId = Date.now();
    setHearts((prev) => [...prev, heartId]);
    setTimeout(() => setHearts((prev) => prev.filter((h) => h !== heartId)), 2000);
    showCompanionMessage(getRandomIdleMessage());
  };

  const moodScale = {
    idle: 1,
    happy: 1.1,
    concerned: 0.95,
    celebrating: 1.15,
    guiding: 1.05,
  };

  const animClass = {
    breathing: 'animate-float-slow',
    sitting: '',
    wandering: 'animate-drift',
    nuzzling: 'animate-bounce-gentle',
    jumping: 'animate-bounce-gentle',
  };

  return (
    <div className="absolute bottom-24 right-4 z-20">
      {/* Hearts on tap */}
      {hearts.map((id) => (
        <div
          key={id}
          className="tap-heart absolute bottom-0 right-0 text-2xl"
          style={{ left: `${Math.random() * 20 - 10}px` }}
        >
          💕
        </div>
      ))}

      {/* Speech bubble */}
      {showMessage && message && (
        <div className="absolute bottom-full right-0 mb-3 bg-white/95 backdrop-blur-sm rounded-2xl rounded-br-md px-4 py-2.5 shadow-lg border border-warm-100 max-w-[200px] animate-slide-up">
          <p className="text-sm text-warm-700 leading-relaxed">{message}</p>
        </div>
      )}

      {/* Animal */}
      <button
        onClick={handleTap}
        className={`block text-5xl transition-all duration-500 ${animClass[companionAnimation]} select-none cursor-pointer`}
        style={{ transform: `scale(${moodScale[companionMood]})` }}
      >
        <div className="relative">
          <span className="drop-shadow-lg">{activeCompanion.emoji}</span>
          {/* Mood indicator */}
          {companionMood === 'concerned' && (
            <span className="absolute -top-1 -right-1 text-sm">💧</span>
          )}
          {companionMood === 'happy' && (
            <span className="absolute -top-1 -right-1 text-sm">✨</span>
          )}
        </div>
      </button>
    </div>
  );
}
