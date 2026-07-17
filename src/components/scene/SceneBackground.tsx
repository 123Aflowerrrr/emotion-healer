import { useMemo, useRef, useState, useEffect } from 'react';
import type { Scene } from '../../types';

interface SceneBackgroundProps {
  scene: Scene;
}

export function SceneBackground({ scene }: SceneBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    setPlaying(false);
    setShowBtn(!!scene.bgVideo);
    if (videoRef.current) videoRef.current.load();
  }, [scene.bgVideo]);

  const handlePlay = () => {
    videoRef.current?.play().then(() => {
      setPlaying(true);
      setShowBtn(false);
    }).catch(() => {});
  };

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
      {/* Gradient background always visible */}
      <div className={`absolute inset-0 ${scene.bgClass || 'scene-forest'}`} />

      {/* Video (hidden until user taps play) */}
      {scene.bgVideo && (
        <video
          ref={videoRef}
          src={import.meta.env.BASE_URL + scene.bgVideo.replace(/^\//, '')}
          loop
          muted={muted}
          playsInline
          disableRemotePlayback
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${playing ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {/* Image bg */}
      {scene.bgImage && !scene.bgVideo && (
        <div className="absolute inset-0 bg-cover bg-center animate-breathe"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}${scene.bgImage.replace(/^\//, '')})` }} />
      )}

      {/* Overlay */}
      <div className={`absolute inset-0 ${playing ? 'bg-black/10' : 'bg-black/5'}`} />

      {/* Play button */}
      {showBtn && (
        <button onClick={handlePlay}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 active:bg-black/20 transition-colors">
          <div className="w-14 h-14 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center text-2xl shadow-lg active:scale-95 transition-transform">
            ▶
          </div>
        </button>
      )}

      {/* Sound toggle */}
      {playing && (
        <button onClick={() => setMuted(!muted)}
          className="absolute top-20 right-4 z-20 w-10 h-10 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center text-lg shadow-sm active:scale-90 transition-transform">
          {muted ? '🔇' : '🔊'}
        </button>
      )}

      {/* Particles (when video not playing) */}
      {!playing && (
        <div className="absolute inset-0 pointer-events-none">
          {scene.particles.type === 'firefly' && particles.map((p) => (
            <div key={p.id} className="firefly" style={{
              left: `${p.left}%`, top: `${20 + p.top * 0.6}%`,
              width: `${p.size * 2}px`, height: `${p.size * 2}px`,
              animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
            }} />
          ))}
          {scene.particles.type === 'rain' && particles.map((p) => (
            <div key={p.id} className="rain-drop" style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`, animationDuration: `${0.8 + Math.random() * 1}s`,
            }} />
          ))}
          {scene.particles.type === 'sparkle' && particles.map((p) => (
            <div key={p.id} className="sparkle-particle" style={{
              left: `${p.left}%`, top: `${p.top}%`,
              width: `${p.size}px`, height: `${p.size}px`,
              animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
            }} />
          ))}
          {scene.particles.type === 'petal' && particles.map((p) => (
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
