'use client';

import React from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLanguage } from "../../context/LanguageContext";

export default function DocsPage() {
    const { t } = useLanguage();
    return (
        <main className="flex min-h-screen flex-col bg-[#050505]">
            <Header />
            <div className="flex-1 px-12 lg:px-24 xl:px-32 2xl:px-40 py-20">
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
                        {t.docs_page.title}
                    </h1>
                    <p className="text-gray-400 text-lg mb-12 text-center max-w-2xl">
                        {t.docs_page.subtitle}
                    </p>
                    <div className="bg-[#111] rounded-[40px] p-12 border border-white/5 w-full text-center">
                        <p className="text-gray-300">
                            {t.docs_page.in_progress}
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

