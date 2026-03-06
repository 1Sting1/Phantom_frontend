'use client';

import { useState, useEffect } from 'react';

export type OS = 'Windows' | 'MacOS' | 'Linux' | 'Android' | 'iOS' | 'Unknown';

export const useOS = (): OS => {
  const [os, setOS] = useState<OS>('Unknown');

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

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
