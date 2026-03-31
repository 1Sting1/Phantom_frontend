'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/LanguageContext';
import Header from '../../components/Header';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { t } = useLanguage();
  const { login, isAuthenticated, isReady } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isReady && isAuthenticated) router.replace('/profile');
  }, [isReady, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.push('/profile');
    } else {
      setError(result.error || 'Login failed');
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-gray-100 disabled:opacity-70 text-black font-semibold rounded-xl py-3.5 mt-8 transition-colors"
            >
              {loading ? '...' : t.auth.loginBtn}
            </button>
          </form>

          <div className="mt-8 mb-6 h-px w-full bg-white/5" />

          <div className="text-center text-sm text-gray-400">
            {t.auth.noAccount}{' '}
            <Link href="/register" className="text-[#8B5CF6] hover:text-[#9f79f8] transition-colors">
              {t.auth.createAccountLink}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
