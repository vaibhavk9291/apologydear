import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface Stage4SecretLetterProps {
  onRestart: () => void;
}

const FULL_PARAGRAPHS = [
  "Psst... 🤫💗",
  "If I ever act a little extra, smile at my phone for no reason, or care just a tiny bit more than I should...",
  "Well, maybe you're the reason. 🙈",
  "No pressure, no expectations. I just wanted you to know that you're genuinely special to me.",
  "And whatever happens, I'm really glad I have you in my life. 🫶🏻",
];

const SIGNATURE = "— someone who's really lucky to have you 💌";

export const Stage4SecretLetter: React.FC<Stage4SecretLetterProps> = ({ onRestart }) => {
  const [revealedIndex, setRevealedIndex] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [hugSent, setHugSent] = useState(false);

  // Progressive reveal of paragraphs for a magical paced reading effect
  useEffect(() => {
    if (revealedIndex < FULL_PARAGRAPHS.length) {
      const timer = setTimeout(() => {
        setRevealedIndex((prev) => prev + 1);
        soundManager.playHeartPop();
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        setIsTypingDone(true);
      }, 800);
      return () => clearTimeout(finishTimer);
    }
  }, [revealedIndex]);

  const handleShowInstantly = () => {
    setRevealedIndex(FULL_PARAGRAPHS.length);
    setIsTypingDone(true);
  };

  const handleSendHug = () => {
    setHugSent(true);
    soundManager.playYesCelebration();

    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#f472b6', '#ec4899', '#fbcfe8', '#fb7185', '#e9d5ff'],
    });

    setTimeout(() => {
      setHugSent(false);
    }, 3500);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 py-10 z-10">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl glass-card rounded-3xl p-7 sm:p-11 shadow-[0_25px_60px_rgba(244,114,182,0.25)] border-2 border-pink-200/90 relative overflow-hidden"
      >
        {/* Soft background watermark/rose pattern */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-pink-200/30 to-purple-200/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-pink-200/30 to-purple-200/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top stationery tag */}
        <div className="flex items-center justify-between border-b border-pink-200/70 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-ping" />
            <span className="text-xs font-semibold tracking-widest uppercase text-pink-500 font-rounded">
              Secret Note • Just For You
            </span>
          </div>

          {!isTypingDone && (
            <button
              onClick={handleShowInstantly}
              className="text-xs text-pink-400 hover:text-pink-600 underline font-medium cursor-pointer transition-colors"
            >
              Skip typing ✨
            </button>
          )}
        </div>

        {/* Letter Body with typing/reveal progression */}
        <div className="space-y-5 min-h-[280px] font-body text-pink-950/90 text-lg leading-relaxed">
          {FULL_PARAGRAPHS.slice(0, revealedIndex).map((p, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`
                ${idx === 0 ? 'text-2xl font-bold font-rounded text-pink-700' : ''}
                ${idx === 2 ? 'font-semibold text-pink-800 text-xl' : ''}
                ${idx === 4 ? 'font-medium text-pink-900 bg-pink-50/60 p-3 rounded-xl border border-pink-100' : ''}
              `}
            >
              {p}
            </motion.p>
          ))}

          {/* Typing indicator cursor while revealing */}
          {!isTypingDone && revealedIndex < FULL_PARAGRAPHS.length && (
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-flex items-center gap-1 text-pink-400 text-sm font-rounded italic"
            >
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-300 animate-pulse" />
              <span>thinking of you...</span>
            </motion.div>
          )}

          {/* Signature revealed when typing complete */}
          <AnimatePresence>
            {isTypingDone && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="pt-6 border-t border-pink-100/90 flex flex-col items-end"
              >
                <p className="font-hand text-2xl sm:text-3xl text-pink-700 tracking-wide">
                  {SIGNATURE}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Small Glowing Heart that gently expands and contracts */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative flex items-center justify-center">
            {/* Soft pulsing glow aura */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-14 h-14 bg-pink-400/40 rounded-full blur-md"
            />
            <motion.div
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative text-rose-500 drop-shadow-md cursor-pointer"
              onClick={handleSendHug}
              title="Click for a heart burst!"
            >
              <Heart className="w-8 h-8 fill-rose-500 text-rose-500" />
            </motion.div>
          </div>
          <span className="text-xs text-pink-400 font-medium mt-2">
            (tap the glowing heart)
          </span>
        </div>

        {/* Action Buttons: Send a Hug & Restart */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Virtual Hug Button */}
          <button
            onClick={handleSendHug}
            disabled={hugSent}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-800 font-rounded font-semibold text-sm shadow-sm border border-pink-200 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>{hugSent ? 'Hug received! 🤗💗' : 'Send a Hug Back 🤗'}</span>
            <Sparkles className="w-4 h-4 text-pink-500" />
          </button>

          {/* Restart Option */}
          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-5 py-3 rounded-full bg-white hover:bg-pink-50 text-pink-600/90 font-rounded font-medium text-sm shadow-sm border border-pink-200 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            title="Read from the beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Read again 🔄</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
