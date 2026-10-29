import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface Stage1EnvelopeProps {
  onOpenLetter: () => void;
}

export const Stage1Envelope: React.FC<Stage1EnvelopeProps> = ({ onOpenLetter }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [showHeartsBurst, setShowHeartsBurst] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    soundManager.playPaperOpen();
    soundManager.playHeartPop();

    // Trigger heart burst after brief wax seal opening delay
    setTimeout(() => {
      setShowHeartsBurst(true);
    }, 300);

    // Transition to main apology card after full opening sequence
    setTimeout(() => {
      onOpenLetter();
    }, 1100);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 z-10">
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center max-w-lg w-full"
      >
        {/* Cute Top Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-3"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-100/80 text-pink-700 text-sm font-medium border border-pink-200/60 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            Special delivery for Rutu
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold font-rounded text-pink-700 tracking-tight mb-2 drop-shadow-sm"
        >
          Hey rutu... 🥺💗
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg sm:text-xl text-pink-900/75 mb-7 font-medium"
        >
          I made a little something for you...
        </motion.p>

        {/* Envelope Container with 3D / Floating effects */}
        <div className="relative w-full max-w-[280px] sm:max-w-sm aspect-[4/3] flex items-center justify-center mb-6 sm:mb-8 cursor-pointer group" onClick={handleOpen}>
          {/* Soft outer glow */}
          <div className="absolute inset-0 bg-pink-300/30 rounded-3xl blur-2xl group-hover:bg-pink-400/40 transition-all duration-500 scale-90" />

          {/* Envelope Graphic Card */}
          <motion.div
            animate={
              isOpening
                ? { scale: [1, 1.05, 0.98], rotate: [0, -1, 1, 0] }
                : { y: [0, -8, 0], rotate: [0, 0.5, -0.5, 0] }
            }
            transition={
              isOpening
                ? { duration: 0.8 }
                : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
            }
            className="relative w-full h-full flex items-center justify-center p-1"
          >
            <img
              src="/assets/envelope.png"
              alt="Cute Pink Apology Envelope with Heart Seal"
              className={`w-full h-full object-contain filter drop-shadow-xl mix-blend-multiply transition-all duration-700 ${
                isOpening ? 'brightness-105' : 'group-hover:scale-102 group-hover:drop-shadow-2xl'
              }`}
            />

            {/* Glowing Heart Pulse on Seal */}
            {!isOpening && (
              <div className="absolute top-[49%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <span className="relative flex h-8 w-8 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-40"></span>
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500/30 animate-pulse" />
                </span>
              </div>
            )}

            {/* Slide-out letter simulation during opening */}
            <AnimatePresence>
              {isOpening && (
                <motion.div
                  initial={{ y: 80, opacity: 0, scale: 0.85 }}
                  animate={{ y: -40, opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="absolute inset-x-4 sm:inset-x-8 top-10 bg-white rounded-xl shadow-2xl p-4 sm:p-5 border border-pink-200/90 z-20 flex flex-col items-center justify-center text-center"
                >
                  <Heart className="w-7 h-7 text-pink-500 fill-pink-500 animate-heart-beat mb-1.5" />
                  <span className="font-rounded text-pink-700 font-bold text-sm sm:text-base">Unfolding with care...</span>
                  <span className="text-xs text-pink-400 mt-0.5">Please read with an open heart 💌</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Shower of Hearts Explosion when seal cracks */}
          <AnimatePresence>
            {showHeartsBurst && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
                {Array.from({ length: 16 }).map((_, i) => {
                  const angle = (i / 16) * 360;
                  const rad = (angle * Math.PI) / 180;
                  const distance = 90 + (i % 3) * 40;
                  const x = Math.cos(rad) * distance;
                  const y = Math.sin(rad) * distance;

                  return (
                    <motion.div
                      key={i}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                      animate={{ x, y, scale: [0, 1.4, 0.8], opacity: [1, 1, 0] }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className="absolute"
                    >
                      <Heart
                        className="w-5 h-5 text-rose-500 fill-pink-400 drop-shadow-sm"
                        style={{
                          transform: `rotate(${angle}deg)`,
                        }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={handleOpen}
          disabled={isOpening}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="relative group px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 bg-[length:200%_auto] hover:bg-right text-white font-rounded font-semibold text-base sm:text-lg shadow-[0_10px_25px_-5px_rgba(244,63,94,0.45)] hover:shadow-[0_15px_30px_-5px_rgba(244,63,94,0.6)] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-80 whitespace-nowrap"
        >
          <span className="tracking-wide">
            {isOpening ? 'Opening for you... 💌' : 'Open my little letter 💌'}
          </span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            ✨
          </span>
        </motion.button>

        <p className="mt-4 text-xs text-pink-600/70 font-medium">
          (click anywhere on the envelope or button to open)
        </p>
      </motion.div>
    </div>
  );
};
