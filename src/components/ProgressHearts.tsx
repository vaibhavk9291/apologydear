import React from 'react';
import { Heart } from 'lucide-react';

interface ProgressHeartsProps {
  currentStage: 1 | 2 | 3;
}

export const ProgressHearts: React.FC<ProgressHeartsProps> = ({ currentStage }) => {
  const stages = [
    { num: 1, label: 'Apology' },
    { num: 2, label: 'Celebration' },
    { num: 3, label: 'Secret Note' },
  ];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-auto">
      <div className="flex items-center gap-3 px-4 py-1.5 rounded-full glass-card border border-pink-200/80 shadow-sm backdrop-blur-md">
        {stages.map((stage, idx) => {
          const isCompleted = currentStage > stage.num;
          const isCurrent = currentStage === stage.num;

          return (
            <React.Fragment key={stage.num}>
              <div 
                className="flex items-center gap-1.5 transition-all duration-300"
                title={`${stage.label} (Step ${stage.num})`}
              >
                <div className="relative">
                  <Heart
                    className={`w-4 h-4 transition-all duration-500 ${
                      isCurrent
                        ? 'text-pink-500 fill-pink-500 scale-125 animate-pulse drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]'
                        : isCompleted
                        ? 'text-rose-400 fill-rose-400 scale-100'
                        : 'text-pink-300 fill-pink-100/60 scale-90'
                    }`}
                  />
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" />
                  )}
                </div>
                <span 
                  className={`text-[11px] font-medium hidden sm:inline-block transition-colors duration-300 ${
                    isCurrent 
                      ? 'text-pink-700 font-semibold' 
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
                  className={`w-4 h-0.5 rounded-full transition-colors duration-500 ${
                    currentStage > idx + 1 ? 'bg-pink-400' : 'bg-pink-200/80'
                  }`} 
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
