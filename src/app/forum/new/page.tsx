'use client';

import { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/LanguageContext';

export default function NewThreadPage() {
  const { t } = useLanguage();
  const { isAuthenticated, isReady, token } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<{id: string, name: string, slug: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/v1/forum/categories')
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) {
          setCategories(data.data.sort((a: any, b: any) => a.order - b.order));
          if (data.data.length > 0) {
            setCategoryId(data.data[0].id);
          }
        }
      })
      .catch(console.error);
  }, []);

  if (!isReady) return <main className="flex min-h-screen bg-[#050505]"><Header /></main>;

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col bg-[#050505]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">{t.forum_page.create_thread_title}</h2>
            <p className="text-gray-400 mb-6">{t.forum_page.login_required}</p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
            >
              {t.auth.loginBtn}
            </button>
          </div>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!title || !content || !categoryId) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const apiBase = typeof window !== 'undefined' ? window.location.origin + '/api/v1' : process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api/v1';
      const res = await fetch(`${apiBase}/forum/threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          category_id: categoryId
        })
      });
      
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to create thread');
        setLoading(false);
        return;
      }
      
      router.push(`/forum/threads/${data.data.id}`);
    } catch (err) {
      setError('Network error');
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#050505]">
      <Header />
      <div className="flex-1 px-4 lg:px-24 xl:px-32 2xl:px-40 py-20">
        <div className="max-w-3xl mx-auto bg-[#13111A] border border-white/10 rounded-2xl p-6 sm:p-10">
          <h1 className="text-3xl font-bold text-white mb-8">
            {t.forum_page.create_thread_title}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-gray-400 text-sm pl-1">{t.forum_page.thread_title}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(t.common?.required_field || 'Required')}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                className="w-full bg-[#252330] border border-white/10 hover:border-white/20 focus:border-purple-500 focus:bg-[#2A2738] focus:ring-2 focus:ring-purple-500/40 focus:shadow-[0_0_16px_rgba(168,85,247,0.25)] rounded-xl px-4 py-3.5 text-white outline-none transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-400 text-sm pl-1">{t.forum_page.thread_category}</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                onInvalid={(e) => (e.target as HTMLSelectElement).setCustomValidity(t.common?.required_field || 'Required')}
                onInput={(e) => (e.target as HTMLSelectElement).setCustomValidity('')}
                className="w-full bg-[#252330] border border-white/10 hover:border-white/20 focus:border-purple-500 focus:bg-[#2A2738] focus:ring-2 focus:ring-purple-500/40 focus:shadow-[0_0_16px_rgba(168,85,247,0.25)] rounded-xl px-4 py-3.5 text-white outline-none transition-colors"
                required
              >
                <option value="" disabled>{t.forum_page.select_category}</option>
                {categories.map((c) => {
                  const translatedName = t.forum_page.category_names ? (t.forum_page.category_names as any)[c.slug] : null;
                  return (
                    <option key={c.id} value={c.id}>
                      {translatedName || c.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-gray-400 text-sm pl-1">{t.forum_page.thread_content}</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onInvalid={(e) => (e.target as HTMLTextAreaElement).setCustomValidity(t.common?.required_field || 'Required')}
                onInput={(e) => (e.target as HTMLTextAreaElement).setCustomValidity('')}
                rows={8}
                className="w-full bg-[#252330] border border-white/10 hover:border-white/20 focus:border-purple-500 focus:bg-[#2A2738] focus:ring-2 focus:ring-purple-500/40 focus:shadow-[0_0_16px_rgba(168,85,247,0.25)] rounded-xl px-4 py-3.5 text-white outline-none transition-colors resize-y"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-70 text-white font-semibold rounded-xl py-3.5 transition-colors mt-4"
            >
              {loading ? t.forum_page.creating || '...' : t.forum_page.btn_create}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}
