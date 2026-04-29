/**
 * Minimal spinner shown while lazy page chunks load.
 * Lightweight and uses CSS animations for zero JS overhead.
 */
export default function PageLoadSpinner() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#07080d',
        zIndex: 50,
      }}
      aria-label="Loading page"
      role="status"
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '2px solid rgba(212,160,23,0.15)',
          borderTopColor: '#d4a017',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
