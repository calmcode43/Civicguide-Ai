/**
 * Displays a persistent banner when the user is offline.
 * Animates in from bottom using Framer Motion.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          role="alert"
          aria-live="assertive"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-[#ff47571f] border border-[#ff475759] backdrop-blur-xl rounded-full px-6 py-2.5 text-[#ff4757] text-sm font-medium whitespace-nowrap pointer-events-none shadow-2xl shadow-red-500/10 no-print"
        >
          ⚡ No internet connection — AI responses unavailable
        </motion.div>
      )}
    </AnimatePresence>
  );
}
