'use client';

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function DonatePage() {
    const { t } = useLanguage();
    return (
        <main className="flex min-h-screen flex-col bg-[#050505]">
            <Header />
            <div className="flex-1 px-12 lg:px-24 xl:px-32 2xl:px-40 py-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        {t.donate_page.title}
                    </h1>
                    <p className="text-gray-400 text-lg mb-12">
                        {t.donate_page.subtitle}
                    </p>
                    <div className="bg-[#111] rounded-[40px] p-12 border border-white/5">
                        <p className="text-gray-300 mb-6">
                            {t.donate_page.info}
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

