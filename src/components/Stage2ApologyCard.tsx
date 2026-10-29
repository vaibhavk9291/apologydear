import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface Stage2ApologyCardProps {
  onAccept: () => void;
}

interface SparkleTrail {
  id: number;
  x: number;
  y: number;
}

const NO_PHRASES = [
  "No 😤",
  "hehe, too slow 😝",
  "nope, try again 😂",
  "are you sureee? 🥹",
  "catch me first 💨",
  "wrong answer, bestie 😭",
  "oops, missed me! 🏃‍♀️",
  "not an option! 🤭",
  "try the pink button! 👉",
  "still trying? 🥺💕",
];

const BEAR_THOUGHTS = [
  "I'm really sorry... 🥺",
  "please forgive him? 👉👈",
  "best friends forever? 💗",
  "he wrote this from his heart 🧸",
  "we can't stay mad! 🌸",
];

export const Stage2ApologyCard: React.FC<Stage2ApologyCardProps> = ({ onAccept }) => {
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number } | null>(null);
  const [noPhraseIndex, setNoPhraseIndex] = useState(0);
  const [escapeTrails, setEscapeTrails] = useState<SparkleTrail[]>([]);
  const [bearBlushing, setBearBlushing] = useState(false);
  const [bearThought, setBearThought] = useState(BEAR_THOUGHTS[0]);
  const [dodgeCount, setDodgeCount] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const bearRef = useRef<HTMLDivElement>(null);
  const lastDodgeTimeRef = useRef(0);

  // Function to move NO button to a new safe position within the viewport & card
  const dodgeButton = useCallback(() => {
    const now = Date.now();
    // Throttle slightly to allow smooth spring animation
    if (now - lastDodgeTimeRef.current < 280) return;
    lastDodgeTimeRef.current = now;

    const noBtn = noButtonRef.current;
    const yesBtn = yesButtonRef.current;
    if (!noBtn) return;

    soundManager.playDodgeSound();

    const noRect = noBtn.getBoundingClientRect();
    const yesRect = yesBtn ? yesBtn.getBoundingClientRect() : null;

    // Leave a sparkle trail at previous position
    const newTrail: SparkleTrail = {
      id: now,
      x: noRect.left + noRect.width / 2,
      y: noRect.top + noRect.height / 2,
    };
    setEscapeTrails((prev) => [...prev.slice(-8), newTrail]);
    setTimeout(() => {
      setEscapeTrails((prev) => prev.filter((t) => t.id !== newTrail.id));
    }, 700);

    // Viewport constraints with safe margins for mobile & desktop
    const vpWidth = window.innerWidth;
    const vpHeight = window.innerHeight;
    const btnWidth = noRect.width || 110;
    const btnHeight = noRect.height || 44;
    const margin = 16;
    const topSafeMargin = 72; // Keep clear of top floating CuteNavbar
    const bottomSafeMargin = 48; // Keep clear of mobile browser bottom bar

    // Generate random positions until we find one sufficiently far from YES button
    let safeX = 0;
    let safeY = 0;
    let found = false;
    let attempts = 0;

    const availableHeight = Math.max(100, vpHeight - btnHeight - topSafeMargin - bottomSafeMargin);
    const availableWidth = Math.max(100, vpWidth - btnWidth - margin * 2);

    while (!found && attempts < 25) {
      attempts++;
      // Pick position within viewport safe zone
      const candidateX = margin + Math.random() * availableWidth;
      const candidateY = topSafeMargin + Math.random() * availableHeight;

      // Check distance from YES button so it never overlaps
      if (yesRect) {
        const yesCenterX = yesRect.left + yesRect.width / 2;
        const yesCenterY = yesRect.top + yesRect.height / 2;
        const candCenterX = candidateX + btnWidth / 2;
        const candCenterY = candidateY + btnHeight / 2;
        const distFromYes = Math.hypot(candCenterX - yesCenterX, candCenterY - yesCenterY);

        if (distFromYes > 120) {
          safeX = candidateX;
          safeY = candidateY;
          found = true;
        }
      } else {
        safeX = candidateX;
        safeY = candidateY;
        found = true;
      }
    }

    if (!found) {
      // Fallback safe offsets
      safeX = Math.max(margin, vpWidth * 0.5 - btnWidth / 2);
      safeY = topSafeMargin + 40;
    }

    setNoButtonPos({ x: safeX, y: safeY });
    setNoPhraseIndex((prev) => (prev + 1) % NO_PHRASES.length);
    setDodgeCount((prev) => prev + 1);

    // Update bear thought as dodge count increases
    setBearThought(BEAR_THOUGHTS[(dodgeCount + 1) % BEAR_THOUGHTS.length]);
  }, [dodgeCount]);

  // Pointer Proximity Detection for Desktop
  useEffect(() => {
    let animationFrameId: number;

    const handlePointerMove = (e: PointerEvent) => {
      const noBtn = noButtonRef.current;
      if (!noBtn) return;

      const rect = noBtn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      // Distance from cursor to button center
      const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

      // Escape threshold ~115px away before the cursor can touch it
      const threshold = 115;

      if (distance < threshold) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => {
          dodgeButton();
        });
      }

      // Check proximity to Bear for cute reaction
      const bearEl = bearRef.current;
      if (bearEl) {
        const bearRect = bearEl.getBoundingClientRect();
        const bearDist = Math.hypot(
          e.clientX - (bearRect.left + bearRect.width / 2),
          e.clientY - (bearRect.top + bearRect.height / 2)
        );
        setBearBlushing(bearDist < 160);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dodgeButton]);

  const handleYesClick = () => {
    soundManager.playYesCelebration();
    onAccept();
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 py-10 z-10">
      {/* Sparkle escape trail remnants */}
      {escapeTrails.map((trail) => (
        <div
          key={trail.id}
          className="fixed pointer-events-none z-50 transition-all duration-700 ease-out flex items-center justify-center"
          style={{
            left: `${trail.x}px`,
            top: `${trail.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span className="text-xl animate-ping">💨</span>
          <Heart className="w-5 h-5 text-pink-400 fill-pink-300 animate-heart-beat ml-1 opacity-75" />
        </div>
      ))}

      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl glass-card rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(244,114,182,0.18)] border border-white/80 relative overflow-visible"
      >
        {/* Soft decorative header glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-pink-300/40 rounded-full blur-xl pointer-events-none" />

        {/* Teddy Bear Section */}
        <div className="flex flex-col items-center mb-5 relative">
          <div
            ref={bearRef}
            className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => {
              setBearBlushing(true);
              soundManager.playHeartPop();
              setTimeout(() => setBearBlushing(false), 2000);
            }}
          >
            {/* Bear Speech Bubble */}
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={bearThought}
              className="absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-pink-700 shadow-md border border-pink-200 flex items-center gap-1 z-20 pointer-events-none"
            >
              <span>{bearThought}</span>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 rotate-45 border-r border-b border-pink-200" />
            </motion.div>

            {/* Bear Graphic from user */}
            <motion.div
              animate={
                bearBlushing
                  ? { rotate: [-2, 2, -2], scale: 1.06 }
                  : { y: [0, -4, 0], rotate: [0, 1, -1, 0] }
              }
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-28 h-28 sm:w-40 sm:h-40"
            >
              <img
                src="/assets/bear.png"
                alt="Cute plush teddy bear holding a heart"
                className="w-full h-full object-contain filter drop-shadow-lg"
              />

              {/* Extra Blush Cheeks on proximity */}
              {bearBlushing && (
                <>
                  <div className="absolute top-[52%] left-[28%] w-4 sm:w-5 h-2 sm:h-2.5 bg-rose-400/50 rounded-full blur-[2px] animate-pulse" />
                  <div className="absolute top-[52%] right-[28%] w-4 sm:w-5 h-2 sm:h-2.5 bg-rose-400/50 rounded-full blur-[2px] animate-pulse" />
                </>
              )}
            </motion.div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-4xl font-bold font-rounded text-center text-pink-700 mb-4 sm:mb-5 tracking-tight flex items-center justify-center gap-2">
          <span>I'm really sorry... 🥺</span>
        </h1>

        {/* Heartfelt Message Body */}
        <div className="space-y-3 sm:space-y-4 text-pink-950/85 text-sm sm:text-base leading-relaxed font-normal bg-pink-50/50 rounded-2xl p-4 sm:p-6 border border-pink-100/80 mb-5 sm:mb-6">
          <p className="font-semibold text-pink-700 font-rounded text-base sm:text-lg">
            Hey youuu 💗
          </p>

          <p>
            I know I messed up, and I'm genuinely sorry if I hurt you. The last thing I'd ever want is to be the reason behind your sadness.
          </p>

          <p>
            You're one of those rare people who can make an ordinary day feel special just by being in it. And honestly, having you in my life means more to me than I probably say out loud.
          </p>

          <p>
            I might not always get everything right, but I never want a silly mistake to make you forget how special you are to me.
          </p>

          <p className="font-medium text-pink-800">
            So... can we make things okay again? 🥹👉👈
          </p>
        </div>

        {/* Question with animated heart */}
        <div className="flex flex-col items-center justify-center mb-6 sm:mb-8">
          <motion.div
            animate={{ scale: [1, 1.25, 1], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-1.5 sm:mb-2 text-rose-500"
          >
            <Heart className="w-6 h-6 sm:w-7 sm:h-7 fill-rose-500 drop-shadow-[0_2px_8px_rgba(244,63,94,0.4)]" />
          </motion.div>

          <h2 className="text-lg sm:text-2xl font-bold font-rounded text-center text-pink-800">
            Will you forgive me? 🥺💗
          </h2>
        </div>

        {/* Interactive Buttons Container */}
        <div className="relative min-h-[58px] sm:min-h-[64px] flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
          {/* YES Button — Anchored, pulsing, beautiful gradient */}
          <button
            ref={yesButtonRef}
            onClick={handleYesClick}
            className="group relative z-10 px-7 py-3 sm:px-10 sm:py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-rounded font-bold text-base sm:text-xl shadow-[0_8px_25px_rgba(244,63,94,0.5)] hover:shadow-[0_12px_32px_rgba(244,63,94,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2 animate-soft-pulse"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white group-hover:scale-110 transition-transform" />
            <span>YESSS 💗</span>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-200 group-hover:rotate-12 transition-transform" />
          </button>

          {/* NO Button — Dodges cursor with proximity detection */}
          {noButtonPos === null ? (
            // Default inline position before first dodge
            <button
              ref={noButtonRef}
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                dodgeButton();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                dodgeButton();
              }}
              onMouseEnter={dodgeButton}
              className="px-6 py-3.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-800 font-rounded font-medium text-base shadow-sm border border-purple-200 transition-colors select-none cursor-pointer"
            >
              {NO_PHRASES[0]}
            </button>
          ) : null}
        </div>

        {/* Fun hint / dodge tracker */}
        {dodgeCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-6 text-xs sm:text-sm text-pink-600/80 font-medium"
          >
            {dodgeCount === 1 && "Psst, that 'No' button is pretty slippery... 😜"}
            {dodgeCount >= 2 && dodgeCount < 5 && `Dodged you ${dodgeCount} times! Give the pink button a try 💕`}
            {dodgeCount >= 5 && `Nice reflexes! But besties belong together! 🥺💗 Click YESSS!`}
          </motion.div>
        )}
      </motion.div>

      {/* Fixed Viewport Escaped NO Button */}
      <AnimatePresence>
        {noButtonPos !== null && (
          <motion.button
            ref={noButtonRef}
            type="button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              left: `${noButtonPos.x}px`,
              top: `${noButtonPos.y}px`,
              scale: 1,
              opacity: 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 420,
              damping: 24,
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              dodgeButton();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              dodgeButton();
            }}
            onMouseEnter={dodgeButton}
            style={{
              position: 'fixed',
              zIndex: 9999,
            }}
            className="px-5 py-3 rounded-full bg-purple-100/95 backdrop-blur-md hover:bg-purple-200 text-purple-800 font-rounded font-semibold text-sm sm:text-base shadow-xl border-2 border-purple-300 transition-colors select-none cursor-pointer active:scale-95"
            aria-label="No button"
          >
            {NO_PHRASES[noPhraseIndex]}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
