// =====================================================
// ANALYTICS HELPER - Google Analytics 4 + Supabase
// =====================================================

import { supabase } from './supabase';

// Google Analytics 4 helper
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Track page view in GA4
export const trackPageView = (path: string) => {
  if (window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
};

// Track custom event in GA4
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
};

// =====================================================
// FILE OPEN TRACKING (Supabase)
// =====================================================

interface FileOpenEvent {
  regulation: number;
  branch: string;
  year: number;
  sem: number;
  subject_name: string;
  material_type: string;
  material_name: string;
  url: string;
  unit?: number;
}

// Track when user opens a file
export const trackFileOpen = async (event: FileOpenEvent) => {
  try {
    // Track in Google Analytics
    trackEvent('file_open', {
      subject: event.subject_name,
      material_type: event.material_type,
      material_name: event.material_name,
      branch: event.branch,
      year: event.year,
      sem: event.sem,
    });

    // Track in Supabase (for custom analytics)
    await supabase.from('file_opens').insert({
      regulation: event.regulation,
      branch: event.branch,
      year: event.year,
      sem: event.sem,
      subject_name: event.subject_name,
      material_type: event.material_type,
      material_name: event.material_name,
      url: event.url,
      unit: event.unit,
    });
  } catch (error) {
    // Silently fail - don't break user experience
    console.error('Analytics tracking failed:', error);
  }
};

// Track navigation events
export const trackNavigation = (step: string, value: string) => {
  trackEvent('navigation', {
    step,
    value,
  });
};
