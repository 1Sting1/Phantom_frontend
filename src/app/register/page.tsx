'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/LanguageContext';
import Header from '../../components/Header';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { t } = useLanguage();
  const { register, isAuthenticated, isReady } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isReady && isAuthenticated) router.replace('/profile');
  }, [isReady, isAuthenticated, router]);

  useEffect(() => {
    if (nickname.length < 3) {
      setIsNicknameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingNickname(true);
      try {
        const res = await fetch(`/api/v1/public/user/check-nickname?nickname=${encodeURIComponent(nickname)}`);
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
  }, [nickname]);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-gray-700 w-0' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    const weakPasswords = ['123123', '123456', '12345678', 'password', 'qwerty', '123456789'];
    if (weakPasswords.includes(pass.toLowerCase())) return { score: 1, label: t.auth.strengthWeak, color: 'bg-red-500 w-1/3' };

    switch (score) {
      case 0:
      case 1:
      case 2:
        return { score: 1, label: t.auth.strengthWeak, color: 'bg-red-500 w-1/3' };
      case 3:
        return { score: 2, label: t.auth.strengthMedium, color: 'bg-yellow-500 w-2/3' };
      case 4:
        return { score: 3, label: t.auth.strengthStrong, color: 'bg-green-500 w-full' };
      default:
        return { score: 0, label: '', color: 'bg-gray-700 w-0' };
    }
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (nickname.length < 3) {
      setError(t.auth.shortPassword || 'Nickname is too short');
      return;
    }

    if (isNicknameAvailable === false) {
      setError(t.profile.nicknameTaken || 'Nickname already taken');
      return;
    }

    if (password !== passwordRepeat) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError(t.auth.shortPassword || 'Password must be at least 8 characters long');
      return;
    }

    const weakPasswords = ['123123', '123456', '12345678', 'password', 'qwerty', '123456789'];
    if (weakPasswords.includes(password.toLowerCase())) {
      setError(t.auth.weakPassword || 'Password is too weak');
      return;
    }
    
    setLoading(true);
    const result = await register(email, password);
    
    if (result.success) {
      // Set chosen nickname upon successful registration
      try {
          const token = localStorage.getItem('phantom-token');
          await fetch('/api/v1/user/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ display_name: nickname })
          });
      } catch (err) {
          console.error('Failed to set nickname', err);
      }
      setLoading(false);
      router.push('/profile');
    } else {
      setLoading(false);
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#050505]">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#16141D] rounded-[24px] border border-white/5 p-8 sm:p-10 shadow-2xl relative">
          <h2 className="text-white text-center text-xl font-medium mb-10">
            Phantom
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                {error}
              </p>
            )}
            <div className="space-y-2">
              <label className="text-gray-400 text-sm pl-1">{t.auth.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#252330] border border-white/10 hover:border-white/20 focus:border-purple-500 focus:bg-[#2A2738] focus:ring-2 focus:ring-purple-500/40 focus:shadow-[0_0_16px_rgba(168,85,247,0.25)] rounded-xl px-4 py-3.5 text-white outline-none transition-colors"
                placeholder=""
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 text-sm pl-1">{t.auth.nickname}</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-[#252330] border border-white/10 hover:border-white/20 focus:border-purple-500 focus:bg-[#2A2738] focus:ring-2 focus:ring-purple-500/40 focus:shadow-[0_0_16px_rgba(168,85,247,0.25)] rounded-xl px-4 py-3.5 text-white outline-none transition-colors"
                placeholder=""
                required
              />
              <div className="px-1 min-h-[20px] flex items-center">
                 {isCheckingNickname ? (
                   <span className="text-xs text-gray-400 animate-pulse">{t.auth.checking}</span>
                 ) : nickname.length >= 3 && isNicknameAvailable !== null ? (
                   isNicknameAvailable ? (
                     <span className="text-xs text-green-400 font-medium">✓ {t.auth.nicknameAvailable}</span>
                   ) : (
                     <span className="text-xs text-red-400 font-medium">× {t.profile.nicknameTaken}</span>
                   )
                 ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-gray-400 text-sm pl-1">{t.auth.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#252330] border border-white/10 hover:border-white/20 focus:border-purple-500 focus:bg-[#2A2738] focus:ring-2 focus:ring-purple-500/40 focus:shadow-[0_0_16px_rgba(168,85,247,0.25)] rounded-xl px-4 py-3.5 text-white outline-none transition-colors"
                placeholder=""
                required
              />
              {password.length > 0 && (
                <div className="pt-1 px-1">
                   <div className="flex justify-between items-center mb-1">
                     <span className="text-xs text-gray-500">{t.auth.passwordStrength}</span>
                     <span className={`text-xs ${strength.score === 3 ? 'text-green-400' : strength.score === 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                       {strength.label}
                     </span>
                   </div>
                   <div className="w-full h-1 bg-gray-700/50 rounded-full overflow-hidden">
                     <div className={`h-full transition-all duration-300 ${strength.color}`}></div>
                   </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-gray-400 text-sm pl-1">{t.auth.passwordRepeat}</label>
              <input
                type="password"
                value={passwordRepeat}
                onChange={(e) => setPasswordRepeat(e.target.value)}
                className="w-full bg-[#252330] border border-white/10 hover:border-white/20 focus:border-purple-500 focus:bg-[#2A2738] focus:ring-2 focus:ring-purple-500/40 focus:shadow-[0_0_16px_rgba(168,85,247,0.25)] rounded-xl px-4 py-3.5 text-white outline-none transition-colors"
                placeholder=""
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-gray-100 disabled:opacity-70 text-black font-semibold rounded-xl py-3.5 mt-8 transition-colors"
            >
              {loading ? '...' : t.auth.registerBtn}
            </button>
          </form>

          <div className="mt-8 mb-6 h-px w-full bg-white/5" />

          <div className="text-center text-sm text-gray-400">
            {t.auth.alreadyHaveAccount}{' '}
            <Link href="/login" className="text-[#8B5CF6] hover:text-[#9f79f8] transition-colors">
              {t.auth.loginLink}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
