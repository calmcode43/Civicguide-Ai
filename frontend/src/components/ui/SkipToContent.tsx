/**
 * "Skip to main content" link for keyboard navigation.
 * Renders visually hidden but becomes visible on focus.
 * Must be the FIRST focusable element in the DOM.
 */
import { FC } from 'react';

export const SkipToContent: FC = () => {
  return (
    <a
      href="#main-content"
      style={{
        position: 'absolute',
        top: '-100px',
        left: '1rem',
        zIndex: 10000,
        padding: '0.75rem 1.5rem',
        background: '#d4a017',
        color: '#07080d',
        fontFamily: 'DM Sans, sans-serif',
        fontWeight: 600,
        fontSize: '0.9rem',
        borderRadius: '0 0 8px 8px',
        textDecoration: 'none',
        transition: 'top 0.2s ease',
      }}
      onFocus={e => { (e.target as HTMLAnchorElement).style.top = '0'; }}
      onBlur={e => { (e.target as HTMLAnchorElement).style.top = '-100px'; }}
    >
      Skip to main content
    </a>
  );
};
