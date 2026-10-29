import React, { useState, useEffect } from 'react';
import { Heart, Volume2, VolumeX, Music } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface CuteNavbarProps {
  currentStage: 1 | 2 | 3;
}

export const CuteNavbar: React.FC<CuteNavbarProps> = ({ currentStage }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(soundManager.getIsPlaying());
  }, []);

  const handleToggleMusic = () => {
    const nextState = soundManager.toggleBgm();
    setIsPlaying(nextState);
  };

  const stages = [
    { num: 1, label: 'Apology' },
    { num: 2, label: 'Yay!' },
    { num: 3, label: 'Secret' },
  ];

  return (
    <header className="fixed top-2.5 sm:top-4 inset-x-0 z-40 px-3 sm:px-6 flex justify-center pointer-events-none">
      <nav 
        aria-label="Navigation"
        className="pointer-events-auto w-full max-w-lg flex items-center justify-between gap-1.5 sm:gap-4 px-3 sm:px-4 py-2 rounded-full glass-card border border-pink-200/90 shadow-[0_6px_20px_rgba(244,114,182,0.18)] backdrop-blur-xl"
      >
        {/* Left: Cute Tag for Rutu */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pl-0.5">
          <span className="text-sm sm:text-base select-none">💌</span>
          <span className="font-rounded font-bold text-xs sm:text-sm text-pink-700 tracking-tight whitespace-nowrap">
            For Rutu
          </span>
        </div>

        {/* Center: 3 Mini Progress Hearts */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {stages.map((stage, idx) => {
            const isCompleted = currentStage > stage.num;
            const isCurrent = currentStage === stage.num;

            return (
              <React.Fragment key={stage.num}>
                <div
                  className="flex items-center gap-1 transition-all duration-300"
                  title={`${stage.label} (Step ${stage.num})`}
                >
                  <div className="relative flex items-center justify-center">
                    <Heart
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${
                        isCurrent
                          ? 'text-pink-500 fill-pink-500 scale-110 animate-pulse drop-shadow-[0_0_6px_rgba(244,114,182,0.7)]'
                          : isCompleted
                          ? 'text-rose-400 fill-rose-400 scale-95'
                          : 'text-pink-300 fill-pink-100/70 scale-90'
                      }`}
                    />
                    {isCurrent && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" />
                    )}
                  </div>

                  {/* Stage text visible on tablet/desktop */}
                  <span
                    className={`text-[10px] sm:text-xs font-semibold hidden md:inline-block ${
                      isCurrent
                        ? 'text-pink-700'
                        : isCompleted
                        ? 'text-pink-500'
                        : 'text-pink-300'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>

                {idx < stages.length - 1 && (
                  <div
                    className={`w-2.5 sm:w-4 h-0.5 rounded-full transition-colors duration-500 ${
                      currentStage > idx + 1 ? 'bg-pink-400' : 'bg-pink-200/90'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Music Toggle Button */}
        <button
          onClick={handleToggleMusic}
          className="group relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-pink-100/70 hover:bg-pink-100 active:scale-95 text-pink-700 shadow-sm border border-pink-200/80 transition-all duration-200 cursor-pointer shrink-0"
          aria-label={isPlaying ? 'Pause background music' : 'Play cute background music'}
          title={isPlaying ? 'Pause music box melody' : 'Play cute music box melody 🎶'}
        >
          {isPlaying ? (
            <>
              <div className="relative flex items-center justify-center text-pink-500">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-pink-500"></span>
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-pink-700 hidden xs:inline">
                Music <span className="text-pink-500 font-bold">On</span>
              </span>
              <span className="text-xs animate-bounce select-none">🎵</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-pink-400 group-hover:text-pink-600 transition-colors" />
              <span className="text-[11px] sm:text-xs font-medium text-pink-600/90 hidden xs:inline">
                Music <span className="text-pink-400">Off</span>
              </span>
              <Music className="w-3 h-3 text-pink-300 group-hover:text-pink-400 transition-colors" />
            </>
          )}
        </button>
      </nav>
    </header>
  );
};
