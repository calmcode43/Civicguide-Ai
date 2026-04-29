import { motion } from 'framer-motion';

// =============================================================================
// LoadingDots
// Three gold circles that pulse in a staggered infinite loop.
// Used inside ChatBubble while the assistant is generating a response.
// =============================================================================

const DOT_COUNT = 3;

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
};

const dotVariants = {
  initial: { opacity: 0.3, scale: 0.8 },
  animate: {
    opacity: [0.3, 1, 0.3],
    scale: [0.8, 1.2, 0.8],
    transition: {
      duration: 0.9,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

interface LoadingDotsProps {
  /** Optional accessible label for screen readers. */
  'aria-label'?: string;
}

export default function LoadingDots({ 'aria-label': ariaLabel = 'Assistant is typing' }: LoadingDotsProps) {
  return (
    <motion.span
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '2px 0',
      }}
    >
      {Array.from({ length: DOT_COUNT }).map((_, i) => (
        <motion.span
          key={i}
          variants={dotVariants}
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#d4a017',
            flexShrink: 0,
          }}
        />
      ))}
    </motion.span>
  );
}
