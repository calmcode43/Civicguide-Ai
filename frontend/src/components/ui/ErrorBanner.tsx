import { motion } from 'framer-motion';

// =============================================================================
// ErrorBanner
// Fixed-position error notification that slides up from the bottom.
// =============================================================================

interface ErrorBannerProps {
  /** The error message to display. Must be a non-empty string. */
  message: string;
  /** Callback invoked when the user dismisses the banner. */
  onDismiss: () => void;
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4L4 12M4 4l8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 1L17 16H1L9 1z"
        stroke="#ff4757"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 7v4" stroke="#ff4757" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="13" r="0.75" fill="#ff4757" />
    </svg>
  );
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <motion.aside
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem 0.75rem 0.875rem',
        background: 'rgba(255,71,87,0.12)',
        border: '1px solid rgba(255,71,87,0.3)',
        borderRadius: '0.75rem',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        maxWidth: 'min(480px, calc(100vw - 3rem))',
        width: 'max-content',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Alert icon */}
      <span style={{ flexShrink: 0 }}>
        <AlertIcon />
      </span>

      {/* Message */}
      <p
        style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.875rem',
          color: '#ff4757',
          margin: 0,
          lineHeight: 1.5,
          flex: 1,
        }}
      >
        {message}
      </p>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss error"
        style={{
          flexShrink: 0,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#ff4757',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.25rem',
          borderRadius: '0.375rem',
          transition: 'opacity 150ms ease',
          opacity: 0.8,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.8'; }}
      >
        <CloseIcon />
      </button>
    </motion.aside>
  );
}
