import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PremiumLoaderProps {
  progress: number; // 0 to 100
  label?: string;
  isDone?: boolean;
}

/**
 * PremiumLoader
 * A high-end full-screen loading overlay with percentage counting.
 * Uses the project's Gold & Void palette.
 */
export default function PremiumLoader({ progress, label = 'Initialising Experience', isDone = false }: PremiumLoaderProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  // Smoothly interpolate the progress number
  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < progress) return Math.min(prev + 1, progress);
        return prev;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [progress]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] } }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#07080d',
            gap: '2rem',
          }}
        >
          {/* Animated Rings Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
             <div 
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold/10 animate-pulse"
               style={{ animationDuration: '3s' }}
             />
             <div 
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gold/20 animate-pulse"
               style={{ animationDuration: '4s', animationDelay: '1s' }}
             />
          </div>

          <div className="relative flex flex-col items-center">
            {/* Logo/Icon */}
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8"
            >
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#d4a017" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 8v4M12 16h.01" stroke="#d4a017" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>

            {/* Percentage Text */}
            <div className="flex flex-col items-center gap-2">
              <span className="font-display text-5xl font-bold text-white tracking-tighter">
                {Math.round(displayProgress)}
                <span className="text-gold text-2xl ml-1">%</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold opacity-80">
                {label}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gold shadow-[0_0_15px_rgba(212,160,23,0.8)]"
              style={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            />
          </div>

          {/* Tagline */}
          <div className="absolute bottom-12 text-center">
             <p className="text-[9px] text-text-secondary uppercase tracking-[0.2em] font-medium">
               Building Your Democratic Journey
             </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
