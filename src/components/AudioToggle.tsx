import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const AudioToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(soundManager.getIsPlaying());
  }, []);

  const handleToggle = () => {
    const nextState = soundManager.toggleBgm();
    setIsPlaying(nextState);
  };

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
      <button
        onClick={handleToggle}
        className="group relative flex items-center gap-2 px-3.5 py-2 rounded-full glass-card hover:bg-white/95 text-pink-700 shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 text-xs sm:text-sm font-medium border border-pink-200/80 cursor-pointer"
        aria-label={isPlaying ? 'Pause background music' : 'Play cute background music'}
        title={isPlaying ? 'Pause gentle music box melody' : 'Play gentle music box melody 🎶'}
      >
        {isPlaying ? (
          <>
            <div className="relative flex items-center justify-center text-pink-500">
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
            </div>
            <span className="text-pink-600 font-semibold tracking-wide flex items-center gap-1">
              Music <span className="text-[11px] font-normal text-pink-400">On</span>
            </span>
            <span className="inline-block animate-bounce text-xs">🎵</span>
          </>
        ) : (
          <>
            <div className="text-pink-400 group-hover:text-pink-600 transition-colors">
              <VolumeX className="w-4 h-4" />
            </div>
            <span className="text-pink-700/80 font-medium">
              Music <span className="text-[11px] text-pink-400">Off</span>
            </span>
            <Music className="w-3.5 h-3.5 text-pink-300 group-hover:text-pink-400 transition-colors" />
          </>
        )}
      </button>
    </div>
  );
};
