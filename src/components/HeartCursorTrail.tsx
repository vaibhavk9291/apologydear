import React, { useEffect, useState } from 'react';

interface TrailHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export const HeartCursorTrail: React.FC = () => {
  const [hearts, setHearts] = useState<TrailHeart[]>([]);
  const [isPointerFine, setIsPointerFine] = useState(false);

  useEffect(() => {
    // Only activate cursor trail on devices with fine pointer (mouse)
    const media = window.matchMedia('(pointer: fine)');
    setIsPointerFine(media.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsPointerFine(e.matches);
    };
    media.addEventListener('change', handleMediaChange);

    return () => {
      media.removeEventListener('change', handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (!isPointerFine) return;

    let count = 0;
    const colors = ['#f472b6', '#ec4899', '#c084fc', '#f43f5e', '#fb7185'];

    const handlePointerMove = (e: PointerEvent) => {
      // Throttle creation: only create every ~3rd event to keep it light
      count++;
      if (count % 3 !== 0) return;

      const newHeart: TrailHeart = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 8 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      setHearts((prev) => [...prev.slice(-14), newHeart]);

      // Remove after 750ms
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 750);
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [isPointerFine]);

  if (!isPointerFine) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
          style={{
            left: `${h.x}px`,
            top: `${h.y}px`,
            animation: 'trailFade 0.75s ease-out forwards',
          }}
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill={h.color}
            opacity="0.8"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes trailFade {
          0% {
            transform: translate(-50%, -50%) scale(1) translateY(0);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.3) translateY(-20px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
