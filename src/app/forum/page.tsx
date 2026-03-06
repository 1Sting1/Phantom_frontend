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

  useEffect(() => {
    // Load categories
    fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1'}/forum/categories`)
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
    fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1'}/forum/threads`)
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
      <div className="flex-1 px-12 lg:px-24 xl:px-32 2xl:px-40 py-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t.forum_page.title}
          </h1>
          <p className="text-gray-400 text-lg mb-12">
            {t.forum_page.subtitle}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[#13111A] border border-white/10 rounded-2xl p-6 sticky top-20">
                <h2 className="text-xl font-bold text-white mb-4">{t.forum_page.categories}</h2>
                {loading ? (
                  <p className="text-gray-400 text-sm">{t.common?.loading || 'Loading...'}</p>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === null
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      {t.forum_page.all_categories}
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'text-gray-300 hover:bg-white/5'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Threads List */}
            <div className="lg:col-span-3">
              <div className="bg-[#13111A] border border-white/10 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">{t.forum_page.threads}</h2>
                  <Link
                    href="/forum/new"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
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
                    {threads.map((thread) => (
                      <Link
                        key={thread.id}
                        href={`/forum/threads/${thread.id}`}
                        className="block bg-[#0F0C16] border border-white/5 rounded-xl p-6 hover:border-purple-500/30 transition-all hover:bg-[#14121D]"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {thread.is_pinned && (
                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/30">
                                  {t.forum_page.pinned}
                                </span>
                              )}
                              {thread.is_locked && (
                                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30">
                                  {t.forum_page.locked}
                                </span>
                              )}
                              <h3 className="text-lg font-semibold text-white">
                                {thread.title}
                              </h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                              {thread.content.substring(0, 150)}...
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                               <span>{t.forum_page.author}: {thread.user_id.substring(0, 8)}...</span>
                               <span>{t.forum_page.views}: {thread.views_count}</span>
                               <span>{formatDate(thread.created_at)}</span>
                             </div>
                          </div>
                        </div>
                      </Link>
                    ))}
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
