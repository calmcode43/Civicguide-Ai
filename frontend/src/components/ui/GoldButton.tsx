import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';

// =============================================================================
// Types
// =============================================================================

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface GoldButtonProps {
  children: ReactNode;
  onClick?: () => void;
  /** When provided renders a react-router <Link> instead of a <button>. */
  href?: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  /** Forwarded to the underlying element as an accessible label. */
  'aria-label'?: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

// =============================================================================
// Style maps
// =============================================================================

const BASE_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  fontFamily: '"DM Sans", sans-serif',
  fontWeight: 500,
  borderRadius: '9999px',
  cursor: 'pointer',
  border: 'none',
  textDecoration: 'none',
  transition: 'filter 200ms ease, opacity 200ms ease',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  position: 'relative',
  whiteSpace: 'nowrap',
};

const VARIANT_STYLES: Record<Variant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #d4a017, #f0c040)',
    color: '#07080d',
    border: 'none',
  },
  outline: {
    background: 'transparent',
    color: '#d4a017',
    border: '1px solid #d4a017',
  },
  ghost: {
    background: 'transparent',
    color: '#7b8db0',
    border: 'none',
  },
};

const SIZE_STYLES: Record<Size, React.CSSProperties> = {
  sm: { fontSize: '0.8rem', padding: '0.5rem 1rem' },
  md: { fontSize: '0.9rem', padding: '0.75rem 1.75rem' },
  lg: { fontSize: '1rem', padding: '1rem 2.25rem' },
};

const DISABLED_STYLE: React.CSSProperties = {
  opacity: 0.45,
  cursor: 'not-allowed',
  pointerEvents: 'none',
};

// =============================================================================
// Loading spinner
// =============================================================================

function GoldSpinner() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: '1em',
        height: '1em',
        borderRadius: '50%',
        border: '2px solid rgba(212,160,23,0.3)',
        borderTopColor: '#d4a017',
        display: 'inline-block',
        animation: 'spin 0.75s linear infinite',
      }}
    />
  );
}

// =============================================================================
// GoldButton
// =============================================================================

export default function GoldButton({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  'aria-label': ariaLabel,
  type = 'button',
  className,
}: GoldButtonProps) {
  const isDisabled = disabled || loading;

  const composedStyle: React.CSSProperties = {
    ...BASE_STYLE,
    ...VARIANT_STYLES[variant],
    ...SIZE_STYLES[size],
    ...(isDisabled ? DISABLED_STYLE : {}),
  };

  const motionProps = {
    whileHover: isDisabled ? {} : { scale: variant === 'primary' ? 1.03 : 1.02 },
    whileTap: isDisabled ? {} : { scale: 0.97 },
    transition: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const },
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (isDisabled) return;
    if (variant === 'primary') {
      (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)';
    } else if (variant === 'ghost') {
      (e.currentTarget as HTMLElement).style.color = '#d4a017';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (variant === 'primary') {
      (e.currentTarget as HTMLElement).style.filter = 'brightness(1)';
    } else if (variant === 'ghost') {
      (e.currentTarget as HTMLElement).style.color = '#7b8db0';
    }
  };

  const content = (
    <>
      {loading && <GoldSpinner />}
      {loading ? <span className="sr-only">Loading</span> : children}
    </>
  );

  // Render as router Link when href is provided
  if (href) {
    return (
      <motion.div {...motionProps} style={{ display: 'inline-flex' }}>
        <Link
          to={href}
          aria-label={ariaLabel}
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? -1 : undefined}
          style={composedStyle}
          className={clsx(className, { 'pointer-events-none': isDisabled })}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  // Render as button
  return (
    <motion.button
      {...motionProps}
      type={type}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading}
      style={composedStyle}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </motion.button>
  );
}
