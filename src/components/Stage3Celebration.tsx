import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface Stage3CelebrationProps {
  onContinueToSecret: () => void;
}

export const Stage3Celebration: React.FC<Stage3CelebrationProps> = ({ onContinueToSecret }) => {
  // Fire high-tier cute pink hearts & sparkle confetti explosion
  useEffect(() => {
    soundManager.playYesCelebration();

    // Heart shapes and soft colors
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#f472b6', '#ec4899', '#f43f5e', '#d946ef', '#fb7185', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.7 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1.2,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.7 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1.2,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Center burst
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { y: 0.6 },
      colors: colors,
    });
  }, []);

  const handleNext = () => {
    soundManager.playHeartPop();
    onContinueToSecret();
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 py-10 z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl glass-card rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(244,114,182,0.22)] border border-white/90 relative"
      >
        {/* Animated Teddy Bear with Happy Glow */}
        <div className="flex flex-col items-center mb-6 relative">
          <div className="relative">
            {/* Sparkle badge */}
            <div className="absolute -top-4 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-3 py-1 rounded-full font-rounded font-bold shadow-md animate-bounce flex items-center gap-1 z-20">
              <Sparkles className="w-3 h-3" />
              Forvigen!
            </div>

            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 2, -2, 0],
                scale: [1, 1.04, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-40 h-40 sm:w-48 sm:h-48"
            >
              <img
                src="/assets/bear.png"
                alt="Happy teddy bear hugging a heart"
                className="w-full h-full object-contain filter drop-shadow-xl"
              />

              {/* Glowing halo behind bear */}
              <div className="absolute inset-0 bg-pink-300/30 rounded-full blur-2xl -z-10 scale-90" />
            </motion.div>
          </div>
        </div>

        {/* Big Joyful Title */}
        <div className="text-center mb-6">
          <motion.h1
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-4xl sm:text-5xl font-extrabold font-rounded text-gradient-rose tracking-tight mb-2 drop-shadow-sm"
          >
            YAYYYYY!! 🥹💗
          </motion.h1>

          <p className="text-lg sm:text-xl font-medium text-pink-800">
            You have no idea how happy that makes me.
          </p>
        </div>

        {/* Heartfelt Revelations Container */}
        <div className="space-y-4 text-pink-950/85 text-base sm:text-lg leading-relaxed bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-7 border border-pink-100 shadow-inner mb-8">
          <div className="flex items-center gap-2 text-pink-600 font-rounded font-semibold text-lg border-b border-pink-100 pb-2">
            <span>📢 Okay, official announcement...</span>
          </div>

          <p>
            You're not just someone I talk to every day. You're someone whose messages can change my mood, whose smile makes things feel a little better, and whose presence I never want to take for granted.
          </p>

          <p>
            I don't know how you managed to become such a special part of my world, but somehow... you did. 💗
          </p>

          <div className="p-3.5 bg-pink-50/80 rounded-xl border border-pink-200/60 text-pink-900 font-medium text-base">
            Sometimes I wonder if you know just how much you mean to me... 👀
          </div>

          <p className="italic text-pink-800/90">
            Anywayyy, don't let this get to your head, miss favorite-person-in-disguise. 😭💕
          </p>

          <p className="font-semibold text-pink-700">
            Friends like you are rare. And if I'm being a little honest... you're kind of my favorite kind of person. 💌
          </p>
        </div>

        {/* Final Surprise Action Button */}
        <div className="flex justify-center">
          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-rounded font-bold text-lg sm:text-xl shadow-[0_10px_30px_rgba(244,63,94,0.4)] hover:shadow-[0_15px_35px_rgba(244,63,94,0.6)] transition-all duration-300 cursor-pointer flex items-center gap-2.5 active:scale-95 animate-soft-pulse"
          >
            <span>One last thing...</span>
            <span className="text-xl group-hover:scale-125 transition-transform">💝</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
