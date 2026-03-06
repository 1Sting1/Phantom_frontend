'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/profile');
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#050505]">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Box */}
        <div className="w-full max-w-md bg-[#16141D] rounded-[24px] border border-white/5 p-8 sm:p-10 shadow-2xl relative">
          <h2 className="text-white text-center text-xl font-medium mb-10">
            Phantom
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-gray-400 text-sm pl-1">{t.auth.email}</label>
              <input
                type="email"
                className="w-full bg-[#252330] border border-transparent focus:border-purple-500/50 rounded-xl px-4 py-3.5 text-white outline-none transition-colors"
                placeholder=""
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-400 text-sm pl-1">{t.auth.password}</label>
              <input
                type="password"
                className="w-full bg-[#252330] border border-transparent focus:border-purple-500/50 rounded-xl px-4 py-3.5 text-white outline-none transition-colors"
                placeholder=""
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-400 text-sm pl-1">{t.auth.passwordRepeat}</label>
              <input
                type="password"
                className="w-full bg-[#252330] border border-transparent focus:border-purple-500/50 rounded-xl px-4 py-3.5 text-white outline-none transition-colors"
                placeholder=""
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white hover:bg-gray-100 text-black font-semibold rounded-xl py-3.5 mt-8 transition-colors"
            >
              {t.auth.registerBtn}
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
