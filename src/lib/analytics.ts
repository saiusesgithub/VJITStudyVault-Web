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

// Detect device type
const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

// Detect browser
const getBrowser = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/')) return 'Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  if (ua.includes('Opera/') || ua.includes('OPR/')) return 'Opera';
  return 'Other';
};

// Detect OS
const getOS = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'MacOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Other';
};

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
    const { data, error } = await supabase.from('file_opens').insert({
      regulation: event.regulation,
      branch: event.branch,
      year: event.year,
      sem: event.sem,
      subject_name: event.subject_name,
      material_type: event.material_type,
      material_name: event.material_name,
      url: event.url,
      unit: event.unit,
      device_type: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      screen_width: window.screen.width,
      screen_height: window.screen.height,
    });

    if (error) {
      console.error('Supabase insert error:', error);
    } else {
      console.log('File open tracked successfully:', event.material_name);
    }
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
