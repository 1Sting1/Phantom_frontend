'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/LanguageContext';

interface NavigationItem {
  id: string;
  title: string;
  href: string;
  type: string;
  order: number;
}

const NavigationItems = ({ pathname }: { pathname: string }) => {
  const { t } = useLanguage();
  const items = [
    { id: '1', title: t.header.install, href: '/install', type: 'link', order: 0 },
    { id: '2', title: t.header.forum, href: '/forum', type: 'link', order: 1 },
    { id: '3', title: t.header.docs, href: '/docs', type: 'link', order: 2 },
    { id: '4', title: t.header.donate, href: '/donate', type: 'link', order: 3 }
  ];

  return (
    <nav className="flex items-center gap-8 text-[17px] font-medium tracking-wide">
      {items.map((item) => (
        <Link
          href={item.href}
          key={item.id}
          className={`relative transition-all duration-300 hover:-translate-y-0.5 ${pathname === item.href
            ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
            : 'text-gray-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]'
            }`}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

/* ─── Pac-Man Easter Egg ─── */
interface ChaseProps {
  startX: number;
  startY: number;
  onComplete: () => void;
}

const PacmanChase = ({ startX, startY, onComplete }: ChaseProps) => {
  const RUN_DURATION = 5.0; // slower run

  useEffect(() => {
    const timer = setTimeout(onComplete, (RUN_DURATION + 0.4 + 0.5) * 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Distance to travel: go past left edge
  const travelLeft = `calc(-${startX + 80}px)`;

  // Pac-Man starts at (startX - 20) and moves left by (startX + 80)px
  // A dot at dotX is reached at time: (startX - 20 - dotX) / (startX + 80) * RUN_DURATION
  // Generate dots from x=16 to x=(startX - 50), every 20px
  const DOT_SPACING = 20;
  const dotStartX = 16;
  const dotEndX = startX - 50;
  const dots = Array.from(
    { length: Math.max(0, Math.floor((dotEndX - dotStartX) / DOT_SPACING) + 1) },
    (_, i) => {
      const dotX = dotStartX + i * DOT_SPACING;
      const delay = ((startX - 20 - dotX) / (startX + 80)) * RUN_DURATION;
      return { x: dotX, delay: Math.max(0, delay) };
    }
  );

  const dotY = startY + 11; // vertically centered on Pac-Man (30px / 2 = 15, minus dot radius)

  return (
    <>
      <style>{`
        @keyframes ph-pacman-left {
          from { transform: translateX(0px); }
          to   { transform: translateX(${travelLeft}); }
        }
        @keyframes ph-ghost-left {
          from { transform: translateX(0px); }
          to   { transform: translateX(${travelLeft}); }
        }
        @keyframes ph-ghost-bob {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-3px); }
        }
        @keyframes ph-dot-eat {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
      `}</style>

      {/* Pac-Man dots — white pellets in front of Pac-Man (to the left) */}
      {dots.map((dot, i) => (
        <div
          key={i}
          style={{
            position: 'fixed',
            top: dotY + 'px',
            left: dot.x + 'px',
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            boxShadow: '0 0 4px rgba(255,255,255,0.6)',
            zIndex: 9997,
            pointerEvents: 'none',
            animationName: 'ph-dot-eat',
            animationDuration: '0.15s',
            animationDelay: dot.delay + 's',
            animationFillMode: 'forwards',
            animationTimingFunction: 'ease-in',
          }}
        />
      ))}

      {/* Pac-Man — leads, facing LEFT */}
      <div
        style={{
          position: 'fixed',
          top: startY + 'px',
          left: (startX - 20) + 'px',
          zIndex: 9999,
          pointerEvents: 'none',
          animation: `ph-pacman-left ${RUN_DURATION}s linear forwards`,
        }}
      >
        <svg width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 0 6px rgba(234,179,8,0.8))' }}>
          <circle cx="10" cy="10" r="10" fill="#EAB308" />
          <path fill="#000">
            <animate
              attributeName="d"
              values="M10 10L0 3V17L10 10Z; M10 10L0 7V13L10 10Z; M10 10L0 9.5V10.5L10 10Z; M10 10L0 7V13L10 10Z; M10 10L0 3V17L10 10Z"
              dur="0.2s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      {/* Ghost — chases from behind (0.4s delay) */}
      <div
        style={{
          position: 'fixed',
          top: (startY - 3) + 'px',
          left: (startX + 20) + 'px',
          zIndex: 9998,
          pointerEvents: 'none',
          animation: `ph-ghost-left ${RUN_DURATION}s linear 0.4s forwards`,
        }}
      >
        <div style={{ animation: 'ph-ghost-bob 0.5s ease-in-out infinite' }}>
          <svg width="34" height="34" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.85))' }}>
            <path
              d="M19 4C12.9249 4 8 8.92487 8 15V28C8 29.6569 9.34315 31 11 31C11.83 31 12.5 30.33 12.5 29.5C12.5 28.67 13.17 28 14 28C14.83 28 15.5 28.67 15.5 29.5C15.5 30.33 16.17 31 17 31C17.83 31 18.5 30.33 18.5 29.5C18.5 28.67 19.17 28 20 28C20.83 28 21.5 28.67 21.5 29.5C21.5 30.33 22.17 31 23 31C23.83 31 24.5 30.33 24.5 29.5C24.5 28.67 25.17 28 26 28C26.83 28 27.5 28.67 27.5 29.5C27.5 30.33 28.17 31 29 31C30.6569 31 32 29.6569 32 28V15C32 8.92487 27.0751 4 19 4Z"
              stroke="#A855F7"
              strokeWidth="2.5"
              fill="#2d0a5e"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="14" cy="14" r="1.2" fill="white" opacity="0.9" />
            <circle cx="24" cy="14" r="1.2" fill="white" opacity="0.9" />
          </svg>
        </div>
      </div>
    </>
  );
};

const Header = () => {
  const { isAuthenticated } = useAuth();
  const [ghostChasing, setGhostChasing] = useState(false);
  const [chasePos, setChasePos] = useState({ x: 0, y: 0 });
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const ghostRef = useRef<HTMLDivElement>(null);

  const handleGhostClick = useCallback(() => {
    if (!ghostChasing && ghostRef.current) {
      const rect = ghostRef.current.getBoundingClientRect();
      // start from the center of the ghost icon
      setChasePos({
        x: rect.left + rect.width / 2 - 50, // offset so ghost appears right of logo
        y: rect.top + rect.height / 2 - 18,  // vertically centered on icon
      });
      setGhostChasing(true);
    }
  }, [ghostChasing]);

  const handleChaseComplete = useCallback(() => {
    setGhostChasing(false);
  }, []);

  return (
    <>
      {/* Easter Egg overlay */}
      {ghostChasing && (
        <PacmanChase
          startX={chasePos.x}
          startY={chasePos.y}
          onComplete={handleChaseComplete}
        />
      )}

      <div className="w-full sticky top-0 z-50 px-4 sm:px-8 pt-6">
        <div className="w-[75%] max-w-[900px] mx-auto relative bg-[#0F0C16]/90 backdrop-blur-xl rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">

          {/* Top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"></div>

          <header className="relative flex items-center justify-between px-5 sm:px-6 h-[68px] w-full z-10">

            {/* 1. LOGO */}
            <div className="flex items-center z-20">
              <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]">

                {/* Ghost icon — click to trigger easter egg */}
                <div
                  ref={ghostRef}
                  onClick={(e) => { e.preventDefault(); handleGhostClick(); }}
                  className={`relative w-7 h-7 flex items-center cursor-pointer select-none transition-all duration-300
                    ${ghostChasing ? 'opacity-20 scale-75' : 'opacity-100 scale-100 hover:scale-110'}`}
                  title="👻 Click me!"
                >
                  <svg viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
                    <path
                      d="M19 4C12.9249 4 8 8.92487 8 15V28C8 29.6569 9.34315 31 11 31C11.83 31 12.5 30.33 12.5 29.5C12.5 28.67 13.17 28 14 28C14.83 28 15.5 28.67 15.5 29.5C15.5 30.33 16.17 31 17 31C17.83 31 18.5 30.33 18.5 29.5C18.5 28.67 19.17 28 20 28C20.83 28 21.5 28.67 21.5 29.5C21.5 30.33 22.17 31 23 31C23.83 31 24.5 30.33 24.5 29.5C24.5 28.67 25.17 28 26 28C26.83 28 27.5 28.67 27.5 29.5C27.5 30.33 28.17 31 29 31C30.6569 31 32 29.6569 32 28V15C32 8.92487 27.0751 4 19 4Z"
                      stroke="#A855F7"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="14" cy="12" r="1.5" fill="#FFFFFF" className="opacity-90">
                      <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="24" cy="12" r="1.5" fill="#FFFFFF" className="opacity-90">
                      <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" begin="0.1s" />
                    </circle>
                  </svg>
                </div>

                <span className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-400 transition-all duration-300">
                  Phantom
                </span>
              </Link>
            </div>

            {/* 2. NAV */}
            <div className="hidden lg:flex flex-shrink-0 items-center justify-center z-20 ml-10">
              <NavigationItems pathname={pathname} />
            </div>

            {/* 3. ACTIONS */}
            <div className="flex-1 flex items-center justify-end gap-4 z-20">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-white bg-purple-500/15 border border-purple-500/40 rounded-xl backdrop-blur-sm"
              >
                <span className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </button>

              <div className="relative hidden lg:block">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors text-[15px] hover:bg-white/5 p-2 rounded-lg"
                >
                  <span>{language.toUpperCase()}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-[2px] opacity-70">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {langMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-[#14121D] border border-purple-500/30 rounded-lg overflow-hidden shadow-xl z-50 min-w-[120px]">
                    <button onClick={() => { setLanguage('ru'); setLangMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white">Русский</button>
                    <button onClick={() => { setLanguage('en'); setLangMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white">English</button>
                  </div>
                )}
              </div>

              <Link href={isAuthenticated ? '/profile' : '/login'} className="hidden lg:flex w-9 h-9 rounded-full border border-purple-500/20 items-center justify-center text-gray-400 hover:text-white hover:border-purple-400 transition-all bg-white/5 hover:scale-105">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </Link>

              <Link href="/install" className="hidden sm:block">
                <div className="relative bg-[#8B5CF6] hover:bg-[#7c4dff] text-white text-[15px] font-semibold py-2 px-5 rounded-full shadow-[0_4px_14px_rgba(139,92,246,0.4)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.6)] hover:-translate-y-0.5 transition-all duration-300">
                  {t.header.download}
                </div>
              </Link>
            </div>
          </header>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${mobileMenuOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        <div className={`absolute top-0 right-0 h-full w-[280px] sm:w-[320px] border-l border-purple-500/30 shadow-2xl transition-transform duration-300 overflow-hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f2e] via-[#0F0C16] to-[#0a0514]"></div>
          <div className="relative h-full flex flex-col z-10 pt-28 overflow-y-auto">
            <div className="px-6 pb-4 border-b border-white/10 flex justify-between items-center">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-400">{t.common?.menu || 'Menu'}</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white p-2">
                <svg width="24" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <nav className="flex flex-col p-6 gap-4">
              <Link href="/install" onClick={() => setMobileMenuOpen(false)} className="text-lg py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">{t.header.install}</Link>
              <Link href="/forum" onClick={() => setMobileMenuOpen(false)} className="text-lg py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">{t.header.forum}</Link>
              <Link href="/docs" onClick={() => setMobileMenuOpen(false)} className="text-lg py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">{t.header.docs}</Link>
              <Link href="/donate" onClick={() => setMobileMenuOpen(false)} className="text-lg py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">{t.header.donate}</Link>
              <div className="mt-4 pt-4 border-t border-white/10">
                <button onClick={() => setLanguage('ru')} className="w-full text-left px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5">Русский</button>
                <button onClick={() => setLanguage('en')} className="w-full text-left px-4 py-3 rounded-lg mt-2 text-gray-300 hover:bg-white/5">English</button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;