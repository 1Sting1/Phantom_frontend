'use client';

import { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  order: number;
}

interface Thread {
  id: string;
  category_id: string;
  user_id: string;
  title: string;
  slug: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export default function ForumPage() {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [userProfiles, setUserProfiles] = useState<Record<string, { display_name: string }>>({});

  useEffect(() => {
    // Fetch user profiles for threads
    const ids = Array.from(new Set(threads.map(t => t.user_id))).filter(id => !userProfiles[id]);
    if (ids.length === 0) return;

    ids.forEach(id => {
      fetch(`/api/v1/public/user/profile/${id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.data && data.data.display_name) {
            setUserProfiles(prev => ({ ...prev, [id]: data.data }));
          }
        })
        .catch(() => {});
    });
  }, [threads]);

  useEffect(() => {
    // Load categories
    fetch('/api/v1/forum/categories')
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) {
          const sorted = data.data.sort((a: Category, b: Category) => a.order - b.order);
          setCategories(sorted);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Load threads
    setThreadsLoading(true);
    fetch(`/api/v1/forum/threads`)
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) {
          let filtered = data.data;
          if (selectedCategory) {
            filtered = filtered.filter((t: Thread) => t.category_id === selectedCategory);
          }
          // Sort: pinned first, then by date
          filtered.sort((a: Thread, b: Thread) => {
            if (a.is_pinned && !b.is_pinned) return -1;
            if (!a.is_pinned && b.is_pinned) return 1;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
          setThreads(filtered);
        }
        setThreadsLoading(false);
      })
      .catch(() => {
        setThreadsLoading(false);
      });
  }, [selectedCategory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'ru' ? 'ru-RU' : 'en-US';
    return date.toLocaleDateString(locale, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#050505]">
      <Header />
      <div className="flex-1 px-4 sm:px-12 lg:px-24 xl:px-32 2xl:px-40 py-16 sm:py-24 relative overflow-hidden">
        {/* Background ambient glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-400 mb-6 drop-shadow-sm tracking-tight">
            {t.forum_page.title}
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl mb-12 max-w-2xl leading-relaxed">
            {t.forum_page.subtitle}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-b from-[#13111A]/80 to-[#0A0810]/80 border border-white/5 shadow-2xl backdrop-blur-xl rounded-3xl p-6 pl-8 sticky top-24 relative overflow-hidden group">
                {/* Subtle orb inside sidebar */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 blur-[40px] rounded-full pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
                
                <h2 className="text-xl font-bold text-white mb-6 tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                  {t.forum_page.categories}
                </h2>
                {loading ? (
                  <div className="animate-pulse space-y-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-10 bg-white/5 rounded-xl"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-5 py-3 rounded-xl transition-all duration-300 font-medium ${
                        selectedCategory === null
                          ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)] translate-x-1'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1 border border-transparent'
                      }`}
                    >
                      {t.forum_page.all_categories}
                    </button>
                    {categories.map((category) => {
                      const translatedName = t.forum_page.category_names ? (t.forum_page.category_names as any)[category.slug] : null;
                      return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-5 py-3 rounded-xl transition-all duration-300 font-medium ${
                          selectedCategory === category.id
                            ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)] translate-x-1'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1 border border-transparent'
                        }`}
                      >
                        {translatedName || category.name}
                      </button>
                    )})}
                  </div>
                )}
              </div>
            </div>

            {/* Threads List */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-b from-[#13111A]/80 to-[#0A0810]/80 border border-white/5 shadow-2xl backdrop-blur-xl rounded-3xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    {t.forum_page.threads}
                    <span className="text-xs font-semibold px-2.5 py-1 bg-white/5 text-gray-400 rounded-full border border-white/10">
                      {threads.length}
                    </span>
                  </h2>
                  <Link
                    href="/forum/new"
                    className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] text-white rounded-xl transition-all duration-300 text-sm font-semibold active:scale-95"
                  >
                    {t.forum_page.new_thread}
                  </Link>
                </div>

                {threadsLoading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400">{t.forum_page.loading_threads}</p>
                  </div>
                ) : threads.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400">{t.forum_page.no_threads}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {threads.map((thread) => {
                      const username = userProfiles[thread.user_id]?.display_name || thread.user_id;
                      return (
                      <Link
                        key={thread.id}
                        href={`/forum/threads/${thread.id}`}
                        className="group block bg-[#181622]/50 border border-white/5 rounded-2xl p-6 hover:border-purple-500/30 hover:bg-[#1C1A28] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(168,85,247,0.12)] relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        
                        <div className="flex items-start justify-between relative z-10">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              {thread.is_pinned && (
                                <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-semibold rounded-lg border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)] flex items-center gap-1.5">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                                  {t.forum_page.pinned}
                                </span>
                              )}
                              {thread.is_locked && (
                                <span className="px-2.5 py-1 bg-red-500/10 text-red-400 text-xs font-semibold rounded-lg border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)] flex items-center gap-1.5">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                  {t.forum_page.locked}
                                </span>
                              )}
                              <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                                {thread.title}
                              </h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-5 line-clamp-2 leading-relaxed max-w-4xl">
                              {thread.content.substring(0, 200)}...
                            </p>
                             <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
                               <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-purple-300">
                                   {username.substring(0, 2).toUpperCase()}
                                 </div>
                                 <span className="text-gray-300">{username.substring(0, 16)}{username.length > 16 ? '...' : ''}</span>
                               </div>
                               <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg">
                                 <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                 {thread.views_count}
                               </span>
                               <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg">
                                 <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                 {formatDate(thread.created_at)}
                               </span>
                             </div>
                          </div>
                        </div>
                      </Link>
                    )})}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
