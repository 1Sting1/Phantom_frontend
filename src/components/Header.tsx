'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  id: string;
  title: string;
  href: string;
  type: string;
  order: number;
}

const NavigationItems = ({ pathname }: { pathname: string }) => {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1'}/public/navigation`)
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) {
          const sortedItems = data.data.sort((a: NavigationItem, b: NavigationItem) => a.order - b.order);
          setItems(sortedItems);
        } else {
          // Fallback to default navigation
          setItems([
            { id: '1', title: 'Установка', href: '/install', type: 'link', order: 0 },
            { id: '2', title: 'Форум', href: '/forum', type: 'link', order: 1 },
            { id: '3', title: 'Документация', href: '/docs', type: 'link', order: 2 },
            { id: '4', title: 'Донат', href: '/donate', type: 'link', order: 3 }
          ]);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback on error
        setItems([
          { id: '1', title: 'Установка', href: '/install', type: 'link', order: 0 },
          { id: '2', title: 'Форум', href: '/forum', type: 'link', order: 1 },
          { id: '3', title: 'Документация', href: '/docs', type: 'link', order: 2 },
          { id: '4', title: 'Донат', href: '/donate', type: 'link', order: 3 }
        ]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <nav className="hidden md:flex items-center gap-10 text-xl font-medium z-10">
        <div className="text-gray-400">...</div>
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center gap-10 text-xl font-medium z-10">
      {items.map((item) => (
        <Link 
          href={item.href} 
          key={item.id} 
          className={`transition-all duration-300 hover:-translate-y-0.5 transform hover:drop-shadow-[0_0_10px_rgba(139,92,246,0.5)] relative group ${
            pathname === item.href 
              ? 'text-white' 
              : 'text-gray-300 hover:text-white'
          }`}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

const Header = () => {
  const [ghostChasing, setGhostChasing] = useState(false);
  const pathname = usePathname();

  const handleGhostClick = () => {
    if (!ghostChasing) {
      setGhostChasing(true);
      // Reset after animation completes (6s for smooth run + return)
      setTimeout(() => {
        setGhostChasing(false);
      }, 6000);
    }
  };

  return (
    <div className="w-full relative border-b border-white/5 bg-[#0F0C16]/80 backdrop-blur-xl sticky top-0 z-50"> 
      {/* Decorative Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[100px] left-1/4 w-[500px] h-[100px] bg-purple-600/20 blur-[100px] rounded-full"></div>
          <div className="absolute -top-[100px] right-1/4 w-[500px] h-[100px] bg-blue-600/20 blur-[100px] rounded-full"></div>
      </div>

      <header className="flex items-center justify-between py-4 px-12 lg:px-24 xl:px-32 2xl:px-40 w-full relative z-10">
        
        {/* Logo Section with Integrated Animation */}
        <Link href="/" className="flex items-center gap-4 cursor-pointer group z-10 relative ml-8 md:ml-16 lg:ml-24 xl:ml-32">
          
          {/* Logo Placeholder & Animation Origin */}
          <div className="relative w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
               {/* Positioning Wrapper - Anchored to Center */}
               <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-end">
                  {/* Pacman and Ghost Animation - Only appears when ghost is clicked */}
                  {ghostChasing && (
                    <>
                      {/* Pacman - Appears before ghost and runs forward (left) */}
                      <div className="absolute right-0 -top-6 flex items-center animate-pacman-run-forward w-max">
                          <div className="w-10 h-10 flex items-center animate-pacman-glow">
                            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]">
                              <path d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0Z" fill="#EAB308"/>
                              <path d="M10 10L0 4V16L10 10Z" fill="#0F0C16">
                                 <animate attributeName="d" values="M10 10L0 4V16L10 10Z; M10 10L0 8V12L10 10Z; M10 10L0 10V10L10 10Z; M10 10L0 8V12L10 10Z; M10 10L0 4V16L10 10Z" dur="0.15s" repeatCount="indefinite" />
                              </path>
                            </svg>
                          </div>
                      </div>

                      {/* Ghost - Follows Pacman then returns when Pacman disappears */}
                      <div className="absolute right-0 -top-6 flex items-center animate-ghost-follow-and-return w-max" style={{ animationDelay: '0.3s' }}>
                        <div className="w-12 h-12 flex items-center">
                          <svg viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
                            <path 
                              d="M19 4C12.9249 4 8 8.92487 8 15V28C8 29.6569 9.34315 31 11 31C11.83 31 12.5 30.33 12.5 29.5C12.5 28.67 13.17 28 14 28C14.83 28 15.5 28.67 15.5 29.5C15.5 30.33 16.17 31 17 31C17.83 31 18.5 30.33 18.5 29.5C18.5 28.67 19.17 28 20 28C20.83 28 21.5 28.67 21.5 29.5C21.5 30.33 22.17 31 23 31C23.83 31 24.5 30.33 24.5 29.5C24.5 28.67 25.17 28 26 28C26.83 28 27.5 28.67 27.5 29.5C27.5 30.33 28.17 31 29 31C30.6569 31 32 29.6569 32 28V15C32 8.92487 27.0751 4 19 4Z" 
                              stroke="#A855F7" 
                              strokeWidth="3"
                              fill="none"
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              className="animate-ghost-glow"
                            />
                            <circle cx="14" cy="12" r="2" fill="#FFFFFF" className="opacity-90" />
                            <circle cx="24" cy="12" r="2" fill="#FFFFFF" className="opacity-90" />
                          </svg>
                        </div>
                      </div>
                    </>
                  )}
               </div>
          </div>

          {/* Static Ghost Next to Text - Clickable */}
          <div 
            onClick={handleGhostClick}
            className={`relative w-8 h-8 flex items-center cursor-pointer transition-all duration-300 ${ghostChasing ? 'opacity-0 scale-0' : 'opacity-100 scale-100 hover:scale-110'}`}
          >
            <svg viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
              <path 
                d="M19 4C12.9249 4 8 8.92487 8 15V28C8 29.6569 9.34315 31 11 31C11.83 31 12.5 30.33 12.5 29.5C12.5 28.67 13.17 28 14 28C14.83 28 15.5 28.67 15.5 29.5C15.5 30.33 16.17 31 17 31C17.83 31 18.5 30.33 18.5 29.5C18.5 28.67 19.17 28 20 28C20.83 28 21.5 28.67 21.5 29.5C21.5 30.33 22.17 31 23 31C23.83 31 24.5 30.33 24.5 29.5C24.5 28.67 25.17 28 26 28C26.83 28 27.5 28.67 27.5 29.5C27.5 30.33 28.17 31 29 31C30.6569 31 32 29.6569 32 28V15C32 8.92487 27.0751 4 19 4Z" 
                stroke="#A855F7" 
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="animate-ghost-glow transition-all duration-300 hover:stroke-[#C084FC]"
              />
              <circle cx="14" cy="12" r="1.5" fill="#FFFFFF" className="opacity-90">
                <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="24" cy="12" r="1.5" fill="#FFFFFF" className="opacity-90">
                <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" begin="0.1s" />
              </circle>
            </svg>
          </div>
          
          <span className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-400 group-hover:to-purple-300 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">Phantom</span>
        </Link>

        {/* Center Navigation */}
        <NavigationItems pathname={pathname} />

        {/* Right Actions */}
        <div className="flex items-center gap-6 z-10">
          
          {/* Language Selector */}
          <button className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors text-[15px] hover:bg-white/5 p-2 rounded-lg">
            <span>Ru</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-[2px]"><path d="m6 9 6 6 6-6"/></svg>
          </button>

          {/* Profile Icon */}
          <button className="w-10 h-10 rounded-full border border-purple-500/30 flex items-center justify-center text-purple-400 hover:text-white hover:border-purple-400 transition-all bg-[#14121D] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:scale-105">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>

          {/* Download Button */}
          <Link href="/install" className="relative group transform active:scale-95 transition-transform duration-150">
             <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500 group-hover:blur-md"></div>
             <div className="relative bg-gradient-to-r from-[#8B5CF6] to-[#6366f1] hover:from-[#7c4dff] hover:to-[#4f46e5] text-white text-[15px] font-medium py-2.5 px-8 rounded-full shadow-lg flex items-center gap-2">
               Скачать
             </div>
          </Link>
        </div>

      </header>
    </div>
  );
};

export default Header;