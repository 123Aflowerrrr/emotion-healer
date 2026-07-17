import { useMemo, useRef, useEffect, useState } from 'react';
import type { Scene } from '../../types';

interface SceneBackgroundProps {
  scene: Scene;
}

export function SceneBackground({ scene }: SceneBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    setVideoReady(false);
    const video = videoRef.current;
    if (!video || !scene.bgVideo) return;

    const onReady = () => {
      setVideoReady(true);
      video.play().catch(() => {});
    };

    if (video.readyState >= 2) {
      onReady();
    } else {
      video.addEventListener('loadeddata', onReady, { once: true });
      video.load();
    }

    return () => {
      video.removeEventListener('loadeddata', onReady);
    };
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
      {/* Default gradient background - always visible as fallback */}
      <div className={`absolute inset-0 ${scene.bgClass || 'scene-forest'}`} />

      {/* Video background - fades in when loaded */}
      {scene.bgVideo && (
        <video
          ref={videoRef}
          src={import.meta.env.BASE_URL + scene.bgVideo.replace(/^\//, '')}
          loop
          muted
          playsInline
          disableRemotePlayback
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Image background - fades in */}
      {scene.bgImage && !scene.bgVideo && (
        <div
          className="absolute inset-0 bg-cover bg-center animate-breathe"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}${scene.bgImage.replace(/^\//, '')})` }}
        />
      )}

      {/* Light overlay for UI readability */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Particles (only without video) */}
      {!scene.bgVideo && (
        <div className="absolute inset-0 pointer-events-none">
          {scene.particles.type === 'firefly' &&
            particles.map((p) => (
              <div key={p.id} className="firefly" style={{
                left: `${p.left}%`, top: `${20 + p.top * 0.6}%`,
                width: `${p.size * 2}px`, height: `${p.size * 2}px`,
                animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
              }} />
            ))}
          {scene.particles.type === 'rain' &&
            particles.map((p) => (
              <div key={p.id} className="rain-drop" style={{
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`, animationDuration: `${0.8 + Math.random() * 1}s`,
              }} />
            ))}
          {scene.particles.type === 'sparkle' &&
            particles.map((p) => (
              <div key={p.id} className="sparkle-particle" style={{
                left: `${p.left}%`, top: `${p.top}%`,
                width: `${p.size}px`, height: `${p.size}px`,
                animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
              }} />
            ))}
          {scene.particles.type === 'petal' &&
            particles.map((p) => (
              <div key={p.id} className="absolute rounded-full opacity-30" style={{
                left: `${p.left}%`, top: `${-10 + p.top * 0.3}%`,
                width: `${p.size}px`, height: `${p.size}px`,
                backgroundColor: scene.particles.color,
                animation: `drift ${p.duration + 4}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
              }} />
            ))}
        </div>
      )}
    </div>
  );
}
