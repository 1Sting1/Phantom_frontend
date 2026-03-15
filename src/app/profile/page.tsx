'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/LanguageContext';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';

function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1';
}

export default function ProfilePage() {
  const { t } = useLanguage();
  const { token, isAuthenticated, isReady, logout } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated || !token) {
      router.replace('/login');
      return;
    }
    const base = getApiBase();
    fetch(`${base}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.data?.display_name !== undefined) {
          setDisplayName(data.data.display_name || '');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isReady, isAuthenticated, token, router]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  if (!isReady || !isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col bg-[#0A0A0A] text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">...</p>
        </div>
      </main>
    );
  }

  const activityData = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 0],
    [0, 0, 1, 2, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 3]
  ];

  const getColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-[#2A2833]';
      case 1: return 'bg-[#5B3C88]';
      case 2: return 'bg-[#8B5CF6]';
      case 3: return 'bg-[#B68EF8]';
      default: return 'bg-[#2A2833]';
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#0A0A0A] text-white">
      <Header />
      
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-14">
          
          <div className="flex flex-col items-center w-full md:w-[320px] shrink-0">
            <div className="w-[180px] h-[180px] rounded-full bg-[#D1C9C5] mb-6"></div>
            
            <h2 className="text-[22px] font-medium mb-2">Nickname</h2>
            <p className="text-gray-400 text-sm mb-6 min-h-[1.5rem]">
              {loading ? '...' : (displayName || '—')}
            </p>
            
            <button className="flex items-center justify-center gap-2 w-full max-w-[240px] py-3.5 bg-[#1C1A26] hover:bg-[#252330] rounded-xl text-white font-medium outline-none transition-colors border border-white/5 shadow-sm mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
              {t.profile.edit}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full max-w-[240px] py-3.5 bg-[#1C1A26] hover:bg-[#252330] rounded-xl text-gray-400 hover:text-white font-medium outline-none transition-colors border border-white/5 shadow-sm mb-10"
            >
              {t.profile.logout}
            </button>

            <div className="w-full max-w-[240px] bg-[#16141D] rounded-2xl p-5 shadow-lg border border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-[13px] font-semibold text-gray-200">{t.profile.activity}</h3>
                <span className="text-[11px] text-gray-500">{t.profile.months[2]}</span>
              </div>
              
              <div className="flex flex-col gap-2 relative">
                <div className="flex justify-between w-full">
                  {t.profile.days.map((day, i) => (
                    <div key={i} className="text-[10px] text-gray-400 w-5 text-center">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col gap-2">
                  {activityData.map((week, weekIdx) => (
                    <div key={weekIdx} className="flex justify-between w-full">
                      {week.map((level, dayIdx) => (
                        <div 
                          key={`${weekIdx}-${dayIdx}`} 
                          className={`w-5 h-5 rounded-[4px] ${getColor(level)} transition-colors cursor-default`}
                        ></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
          
          <div className="flex-1 w-full mt-10 md:mt-0">
            <div className="w-full h-full min-h-[500px] bg-[#16141D] border border-white/5 shadow-2xl rounded-2xl">
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
