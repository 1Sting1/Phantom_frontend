'use client';

import { useState, useEffect } from 'react';

export type OS = 'Windows' | 'MacOS' | 'Linux' | 'Android' | 'iOS' | 'Unknown';

export const useOS = (): OS => {
  const [os, setOS] = useState<OS>('Unknown');

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check URL parameters first for explicit overrides
    const params = new URLSearchParams(window.location.search);
    const osParam = params.get('os');
    
    if (osParam) {
      const lower = osParam.toLowerCase();
      if (lower === 'windows') return setOS('Windows');
      if (lower === 'macos' || lower === 'mac') return setOS('MacOS');
      if (lower === 'linux') return setOS('Linux');
      if (lower === 'android') return setOS('Android');
      if (lower === 'ios') return setOS('iOS');
    }

    const userAgent = window.navigator.userAgent.toLowerCase();

    if (userAgent.includes('windows') || userAgent.includes('win')) {
      setOS('Windows');
    } else if (userAgent.includes('mac') || userAgent.includes('mac os')) {
      // iPad iOS 13+ can report as MacIntel, but for now we'll stick to basic check
      // Could separate by 'iphone'/'ipad' vs 'macintosh' if needed
      setOS(userAgent.includes('iphone') || userAgent.includes('ipad') ? 'iOS' : 'MacOS');
    } else if (userAgent.includes('linux') && !userAgent.includes('android')) {
      setOS('Linux');
    } else if (userAgent.includes('android')) {
      setOS('Android');
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
      setOS('iOS');
    }
  }, []);

  return os;
};
