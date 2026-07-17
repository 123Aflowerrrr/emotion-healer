import type { Scene } from '../../types';

interface SceneCardProps {
  scene: Scene;
  isSelected: boolean;
  onSelect: () => void;
}

export function SceneCard({ scene, isSelected, onSelect }: SceneCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`relative w-full rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer group
        ${isSelected ? 'ring-4 ring-warm-400/60 shadow-2xl scale-[1.02]' : 'shadow-lg hover:shadow-xl hover:scale-[1.01]'}`}
      style={{ aspectRatio: '16/10' }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 ${scene.bgClass} transition-transform duration-700 group-hover:scale-110`} />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {scene.particles.type === 'firefly' &&
          Array.from({ length: scene.particles.count }).map((_, i) => (
            <div
              key={i}
              className="firefly"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${20 + Math.random() * 60}%`,
                width: `${scene.particles.size * 2}px`,
                height: `${scene.particles.size * 2}px`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 4}s`,
              }}
            />
          ))}
        {scene.particles.type === 'rain' &&
          Array.from({ length: scene.particles.count }).map((_, i) => (
            <div
              key={i}
              className="rain-drop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1.5}s`,
                animationDuration: `${0.8 + Math.random() * 1}s`,
              }}
            />
          ))}
        {scene.particles.type === 'sparkle' &&
          Array.from({ length: scene.particles.count }).map((_, i) => (
            <div
              key={i}
              className="sparkle-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 3}s`,
              }}
            />
          ))}
        {scene.particles.type === 'petal' &&
          Array.from({ length: scene.particles.count }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                width: `${scene.particles.size}px`,
                height: `${scene.particles.size}px`,
                backgroundColor: scene.particles.color,
                animation: `drift ${4 + Math.random() * 8}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 6}s`,
              }}
            />
          ))}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
        <div className="text-4xl mb-2 drop-shadow-lg">{scene.icon}</div>
        <h3 className="text-xl font-serif text-white font-medium drop-shadow-md">
          {scene.name}
        </h3>
        <p className="text-white/80 text-sm mt-1 line-clamp-2 drop-shadow-md">
          {scene.description}
        </p>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-7 h-7 bg-warm-400 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-sm">✓</span>
        </div>
      )}
    </button>
  );
}
