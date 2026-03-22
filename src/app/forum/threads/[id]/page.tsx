'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from 'next/link';
import { useAuth, useLanguage } from '@/context/LanguageContext';

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

interface Post {
  id: string;
  thread_id: string;
  user_id: string;
  parent_post_id?: string;
  content: string;
  is_edited: boolean;
  edited_at?: string;
  created_at: string;
}

export default function ThreadPage() {
  const params = useParams();
  const router = useRouter();
  const threadId = params.id as string;
  
  const [thread, setThread] = useState<Thread | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { isAuthenticated, user, token } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (!threadId) return;

    // Load thread
    fetch(`/api/v1/forum/threads/${threadId}`)
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setThread(data.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    // Load posts
    fetch(`/api/v1/forum/threads/${threadId}/posts`)
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) {
          setPosts(data.data);
        }
      })
      .catch(() => {});
  }, [threadId]);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !threadId) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/v1/forum/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_id: threadId,
          content: newPostContent,
        }),
      });

      if (response.ok) {
        setNewPostContent('');
        // Reload posts
        const postsResponse = await fetch(`/api/v1/forum/threads/${threadId}/posts`);
        const postsData = await postsResponse.json();
        if (postsData.data && Array.isArray(postsData.data)) {
          setPosts(postsData.data);
        }
      }
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteThread = async () => {
    if (!confirm('Are you sure you want to delete this thread?')) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/v1/forum/threads/${threadId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        router.push('/forum');
      } else {
        alert('Failed to delete thread');
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Error deleting thread:', error);
      alert('Failed to delete thread');
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col bg-[#050505]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Загрузка...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!thread) {
    return (
      <main className="flex min-h-screen flex-col bg-[#050505]">
        <Header />
        <div className="flex-1 px-12 lg:px-24 xl:px-32 2xl:px-40 py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-6">Тред не найден</h1>
            <Link href="/forum" className="text-purple-400 hover:text-purple-300">
              ← Вернуться к форуму
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#050505]">
      <Header />
      <div className="flex-1 px-12 lg:px-24 xl:px-32 2xl:px-40 py-20">
        <div className="max-w-4xl mx-auto">
          <Link href="/forum" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
            ← Вернуться к форуму
          </Link>

          {/* Thread Header */}
          <div className="bg-[#13111A] border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              {thread.is_pinned && (
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/30">
                  Закреплено
                </span>
              )}
              {thread.is_locked && (
                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30">
                  Закрыто
                </span>
              )}
              
              {isAuthenticated && user?.id === thread.user_id && (
                <button
                  onClick={handleDeleteThread}
                  disabled={isDeleting}
                  className="ml-auto px-3 py-1 bg-red-600/10 hover:bg-red-600/20 text-red-500 text-sm rounded border border-red-500/20 transition-colors"
                >
                  {isDeleting ? (t.forum_page?.confirming_delete || "Удаление...") : (t.forum_page?.delete_thread || "Удалить тред")}
                </button>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">{thread.title}</h1>
            <div className="text-gray-400 text-sm mb-4 whitespace-pre-wrap">{thread.content}</div>
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-white/5">
              <span>Автор: {thread.user_id.substring(0, 8)}...</span>
              <span>Просмотров: {thread.views_count}</span>
              <span>{formatDate(thread.created_at)}</span>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-4 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Ответы ({posts.length})
            </h2>
            {posts.length === 0 ? (
              <div className="text-center py-12 bg-[#13111A] border border-white/10 rounded-2xl">
                <p className="text-gray-400">Пока нет ответов. Будьте первым!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#13111A] border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <span className="text-purple-400 text-sm font-medium">
                          {post.user_id.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">
                          {post.user_id.substring(0, 8)}...
                        </div>
                        <div className="text-gray-500 text-xs">
                          {formatDate(post.created_at)}
                          {post.is_edited && ' (отредактировано)'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-300 whitespace-pre-wrap">{post.content}</div>
                </div>
              ))
            )}
          </div>

          {/* Reply Form */}
          {!thread.is_locked && (
            <div className="bg-[#13111A] border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Добавить ответ</h3>
              <form onSubmit={handleSubmitPost}>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  onInvalid={(e) => (e.target as HTMLTextAreaElement).setCustomValidity(t.common?.required_field || 'Required')}
                  onInput={(e) => (e.target as HTMLTextAreaElement).setCustomValidity('')}
                  placeholder="Напишите ваш ответ..."
                  className="w-full bg-[#0F0C16] border border-white/10 rounded-lg p-4 text-white placeholder-gray-500 focus:border-purple-500/50 focus:outline-none resize-none"
                  rows={6}
                  required
                />
                <button
                  type="submit"
                  disabled={submitting || !newPostContent.trim()}
                  className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                >
                  {submitting ? 'Отправка...' : 'Отправить'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

