'use client';

import React from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import DownloadCTA from "../../components/DownloadCTA";
import { useLanguage } from "../../context/LanguageContext";

export default function InstallPage() {
    const { t } = useLanguage();
    return (
        <main className="flex min-h-screen flex-col bg-[#050505]">
            <Header />
            <div className="flex-1 px-12 lg:px-24 xl:px-32 2xl:px-40 py-20">
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
                        {t.install_page.title}
                    </h1>
                    <p className="text-gray-400 text-lg mb-12 text-center max-w-2xl">
                        {t.install_page.subtitle}
                    </p>
                    <DownloadCTA />
                </div>
            </div>
            <Footer />
        </main>
    );
}

