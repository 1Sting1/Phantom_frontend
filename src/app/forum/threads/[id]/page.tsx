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
  const [userProfiles, setUserProfiles] = useState<Record<string, { display_name: string }>>({});
  
  // Inline replies state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  
  // Post deletion tracking
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  // Custom confirm modal
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    message: string;
    onConfirm: () => void;
  }>({ open: false, message: '', onConfirm: () => {} });
  
  const { isAuthenticated, user, token } = useAuth();
  const { t, language } = useLanguage();

  const [translatedPosts, setTranslatedPosts] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState<Record<string, boolean>>({});

  const handleTranslatePost = async (postId: string, content: string) => {
    if (translatedPosts[postId]) {
      const newMap = { ...translatedPosts };
      delete newMap[postId];
      setTranslatedPosts(newMap);
      return;
    }

    setIsTranslating(prev => ({ ...prev, [postId]: true }));
    try {
      const res = await fetch('/api/v1/localization/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content,
          target_lang: language || 'ru',
          source_lang: 'auto'
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.translated_text) {
          setTranslatedPosts(prev => ({ ...prev, [postId]: data.data.translated_text }));
        }
      }
    } catch (error) {
      console.error('Translation failed', error);
    } finally {
      setIsTranslating(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleTranslateOutgoing = async (text: string, setter: (val: string) => void, targetLang: string) => {
    if (!text.trim()) return;
    try {
      const res = await fetch('/api/v1/localization/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          target_lang: targetLang,
          source_lang: 'auto'
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.translated_text) {
          setter(data.data.translated_text);
        }
      }
    } catch (error) {
      console.error('Translation failed', error);
    }
  };

  const showConfirm = (message: string, onConfirm: () => void) => {
    setConfirmModal({ open: true, message, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmModal(prev => ({ ...prev, open: false }));
  };

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

  useEffect(() => {
    // Resolve user IDs to Nicknames
    const userIds = new Set<string>();
    if (thread) userIds.add(thread.user_id);
    posts.forEach(p => userIds.add(p.user_id));
    
    const idsToFetch = Array.from(userIds).filter(id => !userProfiles[id]);
    if (idsToFetch.length === 0) return;

    idsToFetch.forEach(id => {
      fetch(`/api/v1/public/user/profile/${id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.data && data.data.display_name) {
            setUserProfiles(prev => ({ ...prev, [id]: data.data }));
          }
        })
        .catch(() => {});
    });
  }, [thread, posts]);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !threadId) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/v1/forum/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
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

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyContent.trim() || !threadId) return;

    setSubmittingReply(true);
    try {
      const response = await fetch(`/api/v1/forum/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          thread_id: threadId,
          parent_post_id: parentId,
          content: replyContent,
        }),
      });

      if (response.ok) {
        setReplyContent('');
        setReplyingTo(null);
        // Reload posts
        const postsResponse = await fetch(`/api/v1/forum/threads/${threadId}/posts`);
        const postsData = await postsResponse.json();
        if (postsData.data && Array.isArray(postsData.data)) {
          setPosts(postsData.data);
        }
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeleteThread = () => {
    showConfirm(
      'Вы уверены, что хотите удалить этот тред? Это действие нельзя отменить.',
      () => doDeleteThread()
    );
  };

  const doDeleteThread = async () => {
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

  const handleDeletePost = (postId: string) => {
    showConfirm(
      t.forum_page?.confirm_delete_post || 'Вы уверены, что хотите удалить этот комментарий?',
      () => doDeletePost(postId)
    );
  };

  const doDeletePost = async (postId: string) => {
    setDeletingPostId(postId);
    try {
      const response = await fetch(`/api/v1/forum/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        // Soft reload the posts list
        const postsResponse = await fetch(`/api/v1/forum/threads/${threadId}/posts`);
        const postsData = await postsResponse.json();
        if (postsData.data && Array.isArray(postsData.data)) {
          setPosts(postsData.data);
        }
      } else {
        alert('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    } finally {
      setDeletingPostId(null);
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

      {/* Custom Confirm Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" role="dialog" aria-modal>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeConfirm}
          />
          {/* Modal */}
          <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-b from-[#1A1726] to-[#100E1A] border border-white/10 shadow-[0_0_60px_rgba(168,85,247,0.2)] rounded-3xl p-8">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                  <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
              </div>
              {/* Message */}
              <p className="text-center text-gray-200 text-base leading-relaxed mb-8 font-medium">
                {confirmModal.message}
              </p>
              {/* Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={closeConfirm}
                  className="flex-1 px-5 py-3 rounded-xl font-semibold text-sm text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all active:scale-95"
                >
                  Отмена
                </button>
                <button
                  onClick={() => { confirmModal.onConfirm(); closeConfirm(); }}
                  className="flex-1 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-red-600 hover:bg-red-500 border border-red-500/50 shadow-[0_4px_20px_rgba(239,68,68,0.3)] hover:shadow-[0_4px_20px_rgba(239,68,68,0.5)] transition-all active:scale-95"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 px-4 sm:px-12 lg:px-24 xl:px-32 2xl:px-40 py-16 sm:py-24 relative overflow-hidden">
        {/* Background ambient glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/forum" className="group flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 inline-flex transition-colors font-medium">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Вернуться к форуму
          </Link>

          {/* Thread Header */}
          <div className="bg-gradient-to-b from-[#13111A]/80 to-[#0A0810]/80 border border-white/5 shadow-2xl backdrop-blur-xl rounded-3xl p-6 sm:p-10 mb-8 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/5 blur-[50px] rounded-full pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6">
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
                  className="ml-auto px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-semibold rounded-lg border border-red-500/20 transition-all shadow-[0_0_10px_rgba(239,68,68,0.05)] active:scale-95"
                >
                  {isDeleting ? (t.forum_page?.confirming_delete || "Удаление...") : (t.forum_page?.delete_thread || "Удалить тред")}
                </button>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-6 drop-shadow-sm leading-tight">{thread.title}</h1>
            <div className="text-gray-300 text-[15px] sm:text-base leading-relaxed mb-8 whitespace-pre-wrap selection:bg-purple-500/30">{thread.content}</div>
            
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-purple-300">
                  {(userProfiles[thread.user_id]?.display_name || thread.user_id).substring(0, 2).toUpperCase()}
                </div>
                <span className="text-gray-300">{userProfiles[thread.user_id]?.display_name || thread.user_id.substring(0, 16)}</span>
              </div>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                {thread.views_count}
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {formatDate(thread.created_at)}
              </span>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              Ответы
              <span className="text-sm font-semibold px-3 py-1 bg-white/5 text-gray-400 rounded-full border border-white/10">
                {posts.length}
              </span>
            </h2>
            {posts.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-b from-[#13111A]/50 to-[#0A0810]/50 border border-white/5 rounded-3xl">
                <svg className="w-12 h-12 text-white/10 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <p className="text-gray-400">Пока нет ответов. Будьте первым!</p>
              </div>
            ) : (
              posts.filter(p => !p.parent_post_id).map((topLevelPost) => {
                
                const renderPost = (post: Post, depth: number = 0) => {
                  const replies = posts.filter(p => p.parent_post_id === post.id);
                  const isReplying = replyingTo === post.id;
                  
                  return (
                    <div
                      key={post.id}
                      className={`group ${
                        depth === 0 
                          ? "bg-[#181622]/50 border border-white/5 rounded-3xl p-6 sm:p-8 hover:bg-[#1C1A28]/80 transition-all duration-300 relative overflow-hidden" 
                          : "mt-4 ml-3 sm:ml-8 pl-4 sm:pl-6 border-l-2 border-purple-500/20 relative"
                      }`}
                    >
                      
                      <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.15)] ${depth === 0 ? 'w-10 h-10' : 'w-8 h-8'}`}>
                            <span className={`text-purple-300 font-semibold uppercase ${depth === 0 ? 'text-sm' : 'text-xs'}`}>
                              {(userProfiles[post.user_id]?.display_name || post.user_id).substring(0, 2)}
                            </span>
                          </div>
                          <div>
                            <div className="text-gray-200 font-semibold text-sm">
                              {userProfiles[post.user_id]?.display_name || post.user_id.substring(0, 16)}
                            </div>
                            <div className="text-gray-500 text-[11px] sm:text-xs flex items-center gap-2 mt-0.5">
                              <span>{formatDate(post.created_at)}</span>
                              {post.is_edited && <span className="bg-white/5 px-1.5 py-0.5 rounded text-[10px]">(ред.)</span>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => handleTranslatePost(post.id, post.content)}
                            disabled={isTranslating[post.id]}
                            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all active:scale-95 ${
                              translatedPosts[post.id] 
                                ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
                                : 'text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20'
                            }`}
                          >
                            {isTranslating[post.id] ? '...' : translatedPosts[post.id] ? (t.common?.original || 'Оригинал') : (t.common?.translate || 'Перевести')}
                          </button>

                          {!thread.is_locked && (
                            <button
                              onClick={() => {
                                setReplyingTo(replyingTo === post.id ? null : post.id);
                                setReplyContent('');
                              }}
                              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all active:scale-95 ${
                                isReplying 
                                  ? 'bg-white/10 text-white hover:bg-white/20' 
                                  : 'text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20'
                              }`}
                            >
                              {isReplying ? 'Отмена' : 'Ответить'}
                            </button>
                          )}
                          
                          {isAuthenticated && user?.id === post.user_id && (
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              disabled={deletingPostId === post.id}
                              className="text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-all active:scale-95 disabled:opacity-50"
                            >
                              {deletingPostId === post.id ? '...' : 'Удалить'}
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-gray-300 whitespace-pre-wrap text-[15px] leading-relaxed mb-3 relative z-10 selection:bg-purple-500/30">
                        {translatedPosts[post.id] || post.content}
                      </div>

                      {/* Inline Reply Form */}
                      {isReplying && !thread.is_locked && (
                        <div className="mt-4 mb-4 animate-in fade-in slide-in-from-top-2 duration-300 relative z-10 border-l-2 border-purple-500 pl-4">
                          <form onSubmit={(e) => handleSubmitReply(e, post.id)}>
                            <textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder={`Ответить ${userProfiles[post.user_id]?.display_name || 'пользователю'}...`}
                              className="w-full bg-[#0a0810] border border-white/10 rounded-xl p-4 text-white text-sm placeholder-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none resize-y transition-all"
                              rows={3}
                              autoFocus
                              required
                            />
                            <div className="flex justify-between items-center mt-3">
                              <div className="flex gap-2">
                                <button type="button" onClick={() => handleTranslateOutgoing(replyContent, setReplyContent, 'en')} className="px-2 py-1 text-[10px] sm:text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg border border-blue-500/20 transition-all active:scale-95 mr-1">→ EN 🇬🇧</button>
                                <button type="button" onClick={() => handleTranslateOutgoing(replyContent, setReplyContent, 'ru')} className="px-2 py-1 text-[10px] sm:text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg border border-blue-500/20 transition-all active:scale-95">→ RU 🇷🇺</button>
                              </div>
                              <div className="flex gap-3">
                                <button
                                  type="button"
                                  onClick={() => setReplyingTo(null)}
                                  className="px-5 py-2 text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
                                >
                                  Отмена
                                </button>
                                <button
                                  type="submit"
                                  disabled={submittingReply || !replyContent.trim()}
                                  className="px-5 py-2 text-xs bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/40 disabled:text-gray-500 text-white rounded-lg transition-all font-semibold active:scale-95 shadow-[0_0_15px_rgba(168,85,247,0.3)] disabled:shadow-none"
                                >
                                  {submittingReply ? 'Отправка...' : 'Ответить'}
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Recursive Children Replies */}
                      {replies.length > 0 && (
                        <div className="mt-2">
                          {replies.map(r => renderPost(r, depth + 1))}
                        </div>
                      )}
                    </div>
                  );
                };

                return renderPost(topLevelPost, 0);
              })
            )}
          </div>

          {/* Reply Form */}
          {!thread.is_locked && (
            <div className="bg-gradient-to-b from-[#13111A]/80 to-[#0A0810]/80 border border-white/5 shadow-2xl backdrop-blur-xl rounded-3xl p-6 sm:p-10 relative overflow-hidden">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                Добавить ответ
              </h3>
              <form onSubmit={handleSubmitPost} className="relative z-10">
                <div className="flex gap-2 mb-4">
                   <button type="button" onClick={() => handleTranslateOutgoing(newPostContent, setNewPostContent, 'en')} className="px-3 py-1.5 text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg border border-blue-500/20 transition-all active:scale-95 flex items-center gap-1.5">
                     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                     Translate to 🇬🇧
                   </button>
                   <button type="button" onClick={() => handleTranslateOutgoing(newPostContent, setNewPostContent, 'ru')} className="px-3 py-1.5 text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg border border-blue-500/20 transition-all active:scale-95 flex items-center gap-1.5">
                     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                     Перевести на 🇷🇺
                   </button>
                </div>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  onInvalid={(e) => (e.target as HTMLTextAreaElement).setCustomValidity(t.common?.required_field || 'Required')}
                  onInput={(e) => (e.target as HTMLTextAreaElement).setCustomValidity('')}
                  placeholder="Напишите ваш ответ..."
                  className="w-full bg-[#0a0810] border border-white/10 rounded-2xl p-5 text-white placeholder-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none resize-y transition-all text-sm sm:text-base leading-relaxed"
                  rows={6}
                  required
                />
                <button
                  type="submit"
                  disabled={submitting || !newPostContent.trim()}
                  className="mt-6 px-8 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/40 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-xl transition-all font-semibold shadow-[0_4px_20px_rgba(168,85,247,0.3)] disabled:shadow-none hover:-translate-y-0.5"
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

