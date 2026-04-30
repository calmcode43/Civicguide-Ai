import { logEvent, type Analytics } from 'firebase/analytics';

import { initFirebaseAnalytics } from './firebase';

type AnalyticsEventName =
  | 'assistant_query_sent'
  | 'assistant_reply_stream_started'
  | 'assistant_reply_completed'
  | 'timeline_ask_ai_clicked'
  | 'voting_plan_generated'
  | 'ballot_term_decoded'
  | 'translation_requested'
  | 'feedback_submitted'
  | 'session_deleted';

type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

let analyticsPromise: Promise<Analytics | null> | null = null;

function getAnalyticsInstance(): Promise<Analytics | null> {
  if (!analyticsPromise) {
    analyticsPromise = initFirebaseAnalytics();
  }
  return analyticsPromise;
}

export async function trackEvent(
  name: AnalyticsEventName,
  params: AnalyticsParams = {}
): Promise<void> {
  try {
    const analytics = await getAnalyticsInstance();
    if (!analytics) {
      return;
    }
    logEvent(analytics, name, params);
  } catch {
    // Analytics failures should never affect the product flow.
  }
}
