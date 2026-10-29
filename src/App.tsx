import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BackgroundElements } from './components/BackgroundElements';
import { HeartCursorTrail } from './components/HeartCursorTrail';
import { CuteNavbar } from './components/CuteNavbar';
import { Stage1Envelope } from './components/Stage1Envelope';
import { Stage2ApologyCard } from './components/Stage2ApologyCard';
import { Stage3Celebration } from './components/Stage3Celebration';
import { Stage4SecretLetter } from './components/Stage4SecretLetter';

export const App: React.FC = () => {
  // Stages:
  // 1: Envelope screen
  // 2: Main apology card
  // 3: Celebration screen
  // 4: Secret letter
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Map 4 steps to the 3 heart progress stages
  const progressStage: 1 | 2 | 3 = currentStep <= 2 ? 1 : currentStep === 3 ? 2 : 3;

  const handleOpenLetter = () => {
    setCurrentStep(2);
  };

  const handleAcceptApology = () => {
    setCurrentStep(3);
  };

  const handleContinueToSecret = () => {
    setCurrentStep(4);
  };

  const handleRestart = () => {
    setCurrentStep(1);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden selection:bg-pink-200 selection:text-pink-800">
      {/* Background visual layers: custom wallpaper, drifting clouds, hearts, stars */}
      <BackgroundElements />

      {/* Desktop Heart Sparkle Cursor Trail */}
      <HeartCursorTrail />

      {/* Unified, Beautiful Floating CuteNavbar */}
      <CuteNavbar currentStage={progressStage} />

      {/* Main Content Area with Animated Transitions */}
      <main className="relative z-10 flex-grow flex items-center justify-center w-full max-w-4xl mx-auto px-3 sm:px-6 pt-16 sm:pt-20 pb-8">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94, filter: 'blur(4px)' }}
              transition={{ duration: 0.5 }}
              className="w-full flex justify-center"
            >
              <Stage1Envelope onOpenLetter={handleOpenLetter} />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.5 }}
              className="w-full flex justify-center"
            >
              <Stage2ApologyCard onAccept={handleAcceptApology} />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
              transition={{ duration: 0.55 }}
              className="w-full flex justify-center"
            >
              <Stage3Celebration onContinueToSecret={handleContinueToSecret} />
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="w-full flex justify-center"
            >
              <Stage4SecretLetter onRestart={handleRestart} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sweet Footer Note */}
      <footer className="relative z-20 py-4 text-center pointer-events-none">
        <p className="text-xs text-pink-700/60 font-rounded flex items-center justify-center gap-1">
          <span>Made with</span>
          <span className="text-rose-500 animate-pulse">💗</span>
          <span>and genuine sincerity</span>
        </p>
      </footer>
    </div>
  );
};

export default App;
