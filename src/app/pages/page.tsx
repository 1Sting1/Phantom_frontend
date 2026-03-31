'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function PagesContent() {
    const searchParams = useSearchParams();
    const slug = searchParams.get('slug');
    const [content, setContent] = useState<{ title: string; content: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) {
            setLoading(false);
            return;
        }

        // Fetch page content from API
        fetch(`${process.env.NEXT_PUBLIC_API_BASE || '/api/v1'}/public/pages?slug=${slug}&lang=ru`)
            .then(res => res.json())
            .then(data => {
                if (data.data) {
                    setContent({
                        title: data.data.title,
                        content: data.data.content
                    });
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [slug]);

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

    if (!content) {
        return (
            <main className="flex min-h-screen flex-col bg-[#050505]">
                <Header />
                <div className="flex-1 px-12 lg:px-24 xl:px-32 2xl:px-40 py-20">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Страница не найдена
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Запрошенная страница не существует.
                        </p>
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
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        {content.title}
                    </h1>
                    <div 
                        className="text-gray-300 prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: content.content }}
                    />
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default function PagesPage() {
    return (
        <Suspense fallback={
            <main className="flex min-h-screen flex-col bg-[#050505]">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-400">Загрузка...</p>
                </div>
                <Footer />
            </main>
        }>
            <PagesContent />
        </Suspense>
    );
}

