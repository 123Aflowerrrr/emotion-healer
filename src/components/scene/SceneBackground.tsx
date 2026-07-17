import { useMemo, useRef, useEffect } from 'react';
import type { Scene } from '../../types';

interface SceneBackgroundProps {
  scene: Scene;
}

export function SceneBackground({ scene }: SceneBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (scene.bgVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [scene.bgVideo]);

  const particles = useMemo(() => {
    return Array.from({ length: scene.particles.count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * scene.particles.speed,
      duration: (scene.particles.speed * 0.5) + Math.random() * scene.particles.speed,
      size: scene.particles.size * (0.5 + Math.random()),
    }));
  }, [scene]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Custom video background */}
      {scene.bgVideo && (
        <video
          ref={videoRef}
          src={import.meta.env.BASE_URL + scene.bgVideo.replace(/^\//, '')}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Custom image background */}
      {scene.bgImage && !scene.bgVideo && (
        <div
          className="absolute inset-0 bg-cover bg-center animate-breathe"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}${scene.bgImage.replace(/^\//, '')})` }}
        />
      )}

      {/* Default gradient background (fallback) */}
      {!scene.bgImage && !scene.bgVideo && (
        <div className={`absolute inset-0 ${scene.bgClass} animate-breathe`} />
      )}

      {/* Light overlay for readability */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Particles layer (只在无视频时显示，视频本身已有动态感) */}
      {!scene.bgVideo && (
        <div className="absolute inset-0 pointer-events-none">
          {scene.particles.type === 'firefly' &&
            particles.map((p) => (
              <div
                key={p.id}
                className="firefly"
                style={{
                  left: `${p.left}%`,
                  top: `${20 + p.top * 0.6}%`,
                  width: `${p.size * 2}px`,
                  height: `${p.size * 2}px`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                }}
              />
            ))}
          {scene.particles.type === 'rain' &&
            particles.map((p) => (
              <div
                key={p.id}
                className="rain-drop"
                style={{
                  left: `${p.left}%`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${0.8 + Math.random() * 1}s`,
                }}
              />
            ))}
          {scene.particles.type === 'sparkle' &&
            particles.map((p) => (
              <div
                key={p.id}
                className="sparkle-particle"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                }}
              />
            ))}
          {scene.particles.type === 'petal' &&
            particles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full opacity-30"
                style={{
                  left: `${p.left}%`,
                  top: `${-10 + p.top * 0.3}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: scene.particles.color,
                  animation: `drift ${p.duration + 4}s ease-in-out infinite`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            ))}
        </div>
      )}
    </div>
  );
}
