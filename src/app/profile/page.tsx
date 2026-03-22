'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/LanguageContext';
import Header from '@/components/Header';
import { GhostAvatar, GHOST_AVATARS } from '@/components/GhostAvatar';
import { useRouter } from 'next/navigation';

function getApiBase(): string {
  if (typeof window !== 'undefined') return window.location.origin + '/api/v1';
  return process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api/v1';
}

export default function ProfilePage() {
  const { t } = useLanguage();
  const { token, isAuthenticated, isReady, logout } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('ghost-1');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('ghost-1');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    if (editName === displayName) {
      setIsNicknameAvailable(true);
      return;
    }
    if (editName.length < 3) {
      setIsNicknameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingNickname(true);
      try {
        const res = await fetch(`/api/v1/public/user/check-nickname?nickname=${encodeURIComponent(editName)}`);
        const data = await res.json();
        if (data.success) {
          setIsNicknameAvailable(data.data.available);
        } else {
          setIsNicknameAvailable(null);
        }
      } catch (e) {
        setIsNicknameAvailable(null);
      } finally {
        setIsCheckingNickname(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [editName, isEditing, displayName]);

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
        if (data?.success) {
          if (data.data?.display_name !== undefined) setDisplayName(data.data.display_name || '');
          if (data.data?.avatar_url) setAvatarUrl(data.data.avatar_url);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isReady, isAuthenticated, token, router]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleEdit = () => {
    setEditName(displayName || '');
    setEditAvatar(avatarUrl || 'ghost-1');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editName !== displayName && isNicknameAvailable === false) {
      setError(t.profile.nicknameTaken || 'Nickname already taken');
      return;
    }
    if (editName.length < 3) {
      setError('Nickname is too short');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const base = getApiBase();
      const res = await fetch(`${base}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ display_name: editName, avatar_url: editAvatar })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDisplayName(editName);
        setAvatarUrl(editAvatar);
        setIsEditing(false);
      } else {
        setError(data?.error === 'nickname_taken' ? t.profile.nicknameTaken : (data?.error || 'Failed to update profile'));
      }
    } catch (err) {
      setError('Network error');
    }
    setSaving(false);
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
            {isEditing ? (
              <div className="flex flex-col items-center w-full mb-6">
                <div className="text-[12px] text-gray-400 mb-3 uppercase tracking-wider font-semibold">{t.profile.chooseAvatar}</div>
                <div className="flex flex-wrap justify-center gap-4 mb-3">
                  {GHOST_AVATARS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setEditAvatar(g.id)}
                      className={`relative flex items-center justify-center w-20 h-20 rounded-full transition-all bg-[#0A0A0A] ${editAvatar === g.id ? 'border-[3px] border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.15)]' : 'border-2 border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                      title={g.name}
                    >
                      <GhostAvatar id={g.id} size={70} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-[200px] h-[200px] rounded-full bg-[#0A0A0A] mb-6 border-2 border-white/5 shadow-2xl overflow-visible">
                <GhostAvatar id={avatarUrl || 'ghost-1'} size={180} />
              </div>
            )}
            
            {isEditing ? (
              <div className="flex flex-col items-center w-full mb-6 relative">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#252330] border border-transparent focus:border-purple-500/50 rounded-xl px-4 py-3 text-white outline-none transition-colors text-center text-[22px] font-medium"
                  placeholder="Nickname"
                  maxLength={30}
                  autoFocus
                />
                <div className="absolute -bottom-6 w-full flex justify-center items-center h-5">
                   {isCheckingNickname ? (
                     <span className="text-xs text-gray-400 animate-pulse">{t.auth.checking}</span>
                   ) : editName.length >= 3 && isNicknameAvailable !== null && editName !== displayName ? (
                     isNicknameAvailable ? (
                       <span className="text-xs text-green-400 font-medium">✓ {t.auth.nicknameAvailable}</span>
                     ) : (
                       <span className="text-xs text-red-400 font-medium">× {t.profile.nicknameTaken}</span>
                     )
                   ) : error ? (
                     <span className="text-xs text-red-400">{error}</span>
                   ) : null}
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-[22px] font-medium mb-2">{loading ? '...' : (displayName || 'User')}</h2>
                <p className="text-gray-400 text-sm mb-6 min-h-[1.5rem]"></p>
              </>
            )}
            
            {isEditing ? (
              <div className="flex gap-2 w-full max-w-[240px] mb-4">
                <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium outline-none transition-colors shadow-sm text-sm">
                  {saving ? '...' : (t.profile.save || 'Save')}
                </button>
                <button onClick={() => { setIsEditing(false); setError(''); }} disabled={saving} className="flex-1 py-3 bg-[#1C1A26] hover:bg-[#252330] rounded-xl text-white font-medium outline-none transition-colors border border-white/5 shadow-sm text-sm">
                  {t.profile.cancel || 'Cancel'}
                </button>
              </div>
            ) : (
              <button onClick={handleEdit} className="flex items-center justify-center gap-2 w-full max-w-[240px] py-3.5 bg-[#1C1A26] hover:bg-[#252330] rounded-xl text-white font-medium outline-none transition-colors border border-white/5 shadow-sm mb-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
                {t.profile.edit}
              </button>
            )}

            {!isEditing && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full max-w-[240px] py-3.5 bg-[#1C1A26] hover:bg-[#252330] rounded-xl text-gray-400 hover:text-white font-medium outline-none transition-colors border border-white/5 shadow-sm mb-10"
              >
                {t.profile.logout}
              </button>
            )}

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
