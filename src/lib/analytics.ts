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

// Detect device manufacturer from User Agent
const getDeviceManufacturer = (): string | null => {
  const ua = navigator.userAgent.toLowerCase();
  
  // Apple devices
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'Apple';
  if (ua.includes('macintosh') || ua.includes('mac os')) return 'Apple';
  
  // Samsung
  if (ua.includes('samsung') || ua.includes('sm-') || ua.includes('galaxy')) return 'Samsung';
  
  // Google Pixel
  if (ua.includes('pixel')) return 'Google';
  
  // Xiaomi
  if (ua.includes('xiaomi') || ua.includes('mi ') || ua.includes('redmi')) return 'Xiaomi';
  
  // OnePlus
  if (ua.includes('oneplus')) return 'OnePlus';
  
  // Oppo
  if (ua.includes('oppo')) return 'Oppo';
  
  // Vivo
  if (ua.includes('vivo')) return 'Vivo';
  
  // Realme
  if (ua.includes('realme')) return 'Realme';
  
  // Huawei
  if (ua.includes('huawei') || ua.includes('honor')) return 'Huawei';
  
  // Motorola
  if (ua.includes('motorola') || ua.includes('moto')) return 'Motorola';
  
  // Nokia
  if (ua.includes('nokia')) return 'Nokia';
  
  // LG
  if (ua.includes('lg-') || ua.includes('lge')) return 'LG';
  
  // Sony
  if (ua.includes('sony')) return 'Sony';
  
  // HTC
  if (ua.includes('htc')) return 'HTC';
  
  // Asus
  if (ua.includes('asus')) return 'Asus';
  
  // Lenovo
  if (ua.includes('lenovo')) return 'Lenovo';
  
  // Microsoft Surface
  if (ua.includes('surface')) return 'Microsoft';
  
  // Dell
  if (ua.includes('dell')) return 'Dell';
  
  // HP
  if (ua.includes('hp ')) return 'HP';
  
  return null;
};

// Detect device model from User Agent
const getDeviceModel = (): string | null => {
  const ua = navigator.userAgent;
  
  // iPhone models
  const iphoneMatch = ua.match(/iPhone\s?(\d+[,\s]\d+)?/);
  if (iphoneMatch) {
    // Try to get more specific model
    if (ua.includes('iPhone15')) return 'iPhone 15';
    if (ua.includes('iPhone14')) return 'iPhone 14';
    if (ua.includes('iPhone13')) return 'iPhone 13';
    if (ua.includes('iPhone12')) return 'iPhone 12';
    if (ua.includes('iPhone11')) return 'iPhone 11';
    return iphoneMatch[0];
  }
  
  // iPad models
  const ipadMatch = ua.match(/iPad(\d+[,\s]\d+)?/);
  if (ipadMatch) return ipadMatch[0];
  
  // Samsung Galaxy models
  const samsungMatch = ua.match(/SM-[A-Z]\d+[A-Z]?/i);
  if (samsungMatch) return samsungMatch[0];
  
  const galaxyMatch = ua.match(/Galaxy\s([A-Z]\d+)/i);
  if (galaxyMatch) return `Galaxy ${galaxyMatch[1]}`;
  
  // Google Pixel models
  const pixelMatch = ua.match(/Pixel\s?(\d+[a-z]?(\s?Pro)?(\s?XL)?)/i);
  if (pixelMatch) return `Pixel ${pixelMatch[1]}`;
  
  // Xiaomi models
  const xiaomiMatch = ua.match(/(Mi|Redmi)\s?([A-Z0-9\s]+)/i);
  if (xiaomiMatch) return `${xiaomiMatch[1]} ${xiaomiMatch[2]}`.trim();
  
  // OnePlus models
  const oneplusMatch = ua.match(/OnePlus\s?([A-Z0-9]+)/i);
  if (oneplusMatch) return `OnePlus ${oneplusMatch[1]}`;
  
  return null;
};

// Get platform (more detailed than OS)
const getPlatform = (): string => {
  const ua = navigator.userAgent;
  
  // Mobile platforms
  if (ua.includes('Android')) {
    const versionMatch = ua.match(/Android\s([\d.]+)/);
    return versionMatch ? `Android ${versionMatch[1]}` : 'Android';
  }
  
  if (ua.includes('iPhone') || ua.includes('iPad')) {
    const versionMatch = ua.match(/OS\s([\d_]+)/);
    if (versionMatch) {
      const version = versionMatch[1].replace(/_/g, '.');
      return `iOS ${version}`;
    }
    return 'iOS';
  }
  
  // Desktop platforms
  if (ua.includes('Win')) {
    if (ua.includes('Windows NT 10.0')) return 'Windows 10/11';
    if (ua.includes('Windows NT 6.3')) return 'Windows 8.1';
    if (ua.includes('Windows NT 6.2')) return 'Windows 8';
    if (ua.includes('Windows NT 6.1')) return 'Windows 7';
    return 'Windows';
  }
  
  if (ua.includes('Mac OS X')) {
    const versionMatch = ua.match(/Mac OS X\s([\d_]+)/);
    if (versionMatch) {
      const version = versionMatch[1].replace(/_/g, '.');
      return `macOS ${version}`;
    }
    return 'macOS';
  }
  
  if (ua.includes('Linux')) return 'Linux';
  
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
      // NEW: Enhanced device tracking
      device_manufacturer: getDeviceManufacturer(),
      device_model: getDeviceModel(),
      platform: getPlatform(),
      user_agent: navigator.userAgent,
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
