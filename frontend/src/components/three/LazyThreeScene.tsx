/**
 * Lazy wrapper for any heavy Three.js component.
 * Delays loading the Three.js bundle until the component is actually needed.
 */
import { lazy, Suspense, ReactNode } from 'react';

interface Props {
  loader: () => Promise<{ default: React.ComponentType<any> }>;
  props?: Record<string, unknown>;
  fallback?: ReactNode;
}

export function LazyThreeScene({ loader, props = {}, fallback }: Props) {
  const Component = lazy(loader);
  return (
    <Suspense fallback={fallback ?? <div style={{ width: '100%', height: '100%' }} />}>
      <Component {...props} />
    </Suspense>
  );
}
