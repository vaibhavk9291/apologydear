import React, { useMemo } from 'react';

interface FloatingItem {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  type: 'heart' | 'star' | 'sparkle';
  color: string;
}

export const BackgroundElements: React.FC = () => {
  // Generate consistent dreamy floating particles
  const particles = useMemo<FloatingItem[]>(() => {
    const items: FloatingItem[] = [];
    const colors = ['#f472b6', '#ec4899', '#c084fc', '#fb7185', '#a855f7', '#fbcfe8'];
    
    // Floating hearts
    for (let i = 0; i < 18; i++) {
      items.push({
        id: i,
        x: Math.random() * 96 + 2,
        y: Math.random() * 92 + 4,
        size: Math.random() * 16 + 14,
        opacity: Math.random() * 0.35 + 0.2,
        duration: Math.random() * 6 + 7,
        delay: Math.random() * 5,
        type: 'heart',
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Twinkling stars
    for (let i = 18; i < 34; i++) {
      items.push({
        id: i,
        x: Math.random() * 96 + 2,
        y: Math.random() * 92 + 4,
        size: Math.random() * 12 + 10,
        opacity: Math.random() * 0.45 + 0.25,
        duration: Math.random() * 3 + 2.5,
        delay: Math.random() * 4,
        type: 'star',
        color: '#f43f5e',
      });
    }

    return items;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background image overlay from user */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-multiply scale-105 transition-transform duration-1000 ease-out"
        style={{ backgroundImage: "url('/assets/bg-heart.png')" }}
      />

      {/* Dreamy soft gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-50/70 via-purple-50/50 to-pink-100/60" />

      {/* Subtle radial glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-pink-300/20 via-purple-300/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-gradient-to-tr from-pink-200/25 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-gradient-to-bl from-purple-200/25 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Floating Animated Clouds */}
      <div className="absolute top-12 left-[5%] opacity-35 animate-cloud-drift">
        <svg width="140" height="70" viewBox="0 0 140 70" fill="none">
          <path d="M25 50C16.7157 50 10 43.2843 10 35C10 27.228 15.932 20.8415 23.5135 20.0838C26.177 11.4554 34.2045 5.25 43.75 5.25C54.4988 5.25 63.366 13.0645 64.9189 23.3594C67.5744 21.849 70.6865 21 75 21C86.0457 21 95 29.9543 95 41C95 41.6749 94.9666 42.342 94.9015 43C95.5912 42.9469 96.2917 42.9167 97 42.9167C105.744 42.9167 112.833 50.0058 112.833 58.75C112.833 67.4942 105.744 74.5833 97 74.5833H25C13.9543 74.5833 5 65.629 5 54.5833C5 52.8803 5.2127 51.2268 5.61288 49.6508C6.93294 49.8804 8.29344 50 9.6875 50H25Z" fill="#fed7aa" fillOpacity="0.4" />
        </svg>
      </div>

      <div className="absolute top-44 right-[8%] opacity-30 animate-cloud-drift" style={{ animationDelay: '-12s' }}>
        <svg width="170" height="85" viewBox="0 0 140 70" fill="none">
          <path d="M25 50C16.7157 50 10 43.2843 10 35C10 27.228 15.932 20.8415 23.5135 20.0838C26.177 11.4554 34.2045 5.25 43.75 5.25C54.4988 5.25 63.366 13.0645 64.9189 23.3594C67.5744 21.849 70.6865 21 75 21C86.0457 21 95 29.9543 95 41C95 41.6749 94.9666 42.342 94.9015 43C95.5912 42.9469 96.2917 42.9167 97 42.9167C105.744 42.9167 112.833 50.0058 112.833 58.75C112.833 67.4942 105.744 74.5833 97 74.5833H25C13.9543 74.5833 5 65.629 5 54.5833C5 52.8803 5.2127 51.2268 5.61288 49.6508C6.93294 49.8804 8.29344 50 9.6875 50H25Z" fill="#fbcfe8" fillOpacity="0.45" />
        </svg>
      </div>

      {/* Floating Hearts & Twinkling Sparkles */}
      {particles.map((p) => {
        if (p.type === 'heart') {
          return (
            <div
              key={p.id}
              className="absolute animate-slow-float transition-all duration-700"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                opacity: p.opacity,
              }}
            >
              <svg
                width={p.size}
                height={p.size}
                viewBox="0 0 24 24"
                fill={p.color}
                stroke="none"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          );
        }

        return (
          <div
            key={p.id}
            className="absolute animate-twinkle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity,
            }}
          >
            {/* 4-pointed sparkle star */}
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              fill="#fb7185"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
        );
      })}
    </div>
  );
};
