'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useInquiry } from './InquiryContext';

export default function TelemetryTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { lang } = useInquiry();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get or initialize a persistent anonymous session ID for this visitor
    let sessionId = localStorage.getItem('palrom_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('palrom_session_id', sessionId);
    }

    const trackPageView = async () => {
      try {
        // Skip tracking telemetry requests themselves or direct assets
        if (pathname.startsWith('/api') || pathname.includes('.')) return;

        const path = pathname + (searchParams.toString() ? '?' + searchParams.toString() : '');
        await fetch('/api/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'page_view',
            sessionId,
            payload: {
              path,
              lang,
              referrer: document.referrer || null,
              isMobile: window.innerWidth < 768
            }
          })
        });
      } catch (err) {
        // Fail silently in production
        console.warn('Failed to send page view telemetry:', err);
      }
    };

    trackPageView();
  }, [pathname, searchParams, lang]);

  return null;
}
export function trackTelemetryEvent(eventType, payload = {}) {
  if (typeof window === 'undefined') return;
  
  const sessionId = localStorage.getItem('palrom_session_id') || crypto.randomUUID();
  const lang = localStorage.getItem('palrom_lang') || 'nl';

  fetch('/api/telemetry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'configurator_event',
      sessionId,
      payload: {
        eventType,
        lang,
        ...payload
      }
    })
  }).catch(err => console.warn('Failed to send event telemetry:', err));
}
