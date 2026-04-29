import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from '@/components/layout/NavBar';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { SkipToContent } from '@/components/ui/SkipToContent';
import PageLoadSpinner from '@/components/ui/PageLoadSpinner';

// Lazy load pages for performance optimization
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const AssistantPage = lazy(() => import('@/pages/AssistantPage'));
const TimelinePage = lazy(() => import('@/pages/TimelinePage'));
const VotingPlanPage = lazy(() => import('@/pages/VotingPlanPage'));
const BallotDecoderPage = lazy(() => import('@/pages/BallotDecoderPage'));
const MilestonesPage = lazy(() => import('@/pages/MilestonesPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

/**
 * App
 * Root component with performance optimizations:
 * 1. Page-level code splitting via React.lazy
 * 2. Suspense boundaries with lightweight loading state
 * 3. Global persistent UI components (NavBar, OfflineBanner)
 */
export default function App() {
  return (
    <BrowserRouter>
      <SkipToContent />
      <NavBar />
      <div className="pt-16">
        <Suspense fallback={<PageLoadSpinner />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/voting-plan" element={<VotingPlanPage />} />
            <Route path="/ballot-decoder" element={<BallotDecoderPage />} />
            <Route path="/milestones" element={<MilestonesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
      <OfflineBanner />
    </BrowserRouter>
  );
}
