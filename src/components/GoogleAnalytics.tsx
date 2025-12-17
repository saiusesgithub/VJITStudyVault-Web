// =====================================================
// GOOGLE ANALYTICS 4 COMPONENT
// =====================================================

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GA_MEASUREMENT_ID, trackPageView } from '@/lib/analytics';

export function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search);
  }, [location]);

  // Don't render anything if no GA ID
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return null;
}
