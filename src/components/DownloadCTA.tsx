'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const DownloadCTA = () => {
    const { t } = useLanguage();

    return (
        <section className="w-full px-4 py-16 sm:py-20 md:py-24 relative z-20">
            <div className="max-w-4xl mx-auto text-center">

                {/* Title */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                    {t.downloadCTA.title}
                </h2>

                {/* Subtitle */}
                <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-10 sm:mb-12 max-w-xl mx-auto">
                    {t.downloadCTA.subtitle1}
                    <br />
                    {t.downloadCTA.subtitle2}
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

                    {/* Primary Button */}
                    <Link href="/install" className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white font-semibold transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] active:scale-95 flex items-center gap-2">
                        {/* Windows Icon (Simple SVG) */}
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M0 3.449L9.75 2.1v9.451H0V3.449zm10.949-1.655L24 0v11.551H10.949V1.794zM0 12.6h9.75v9.451L0 20.85V12.6zm10.949 0H24v11.794l-13.051-1.794V12.6z" />
                        </svg>
                        {t.downloadCTA.btnDownload}
                    </Link>

                    {/* Secondary Button */}
                    <Link href="/install" className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-gray-300 font-medium hover:bg-white/10 transition-colors">
                        {t.downloadCTA.btnOtherPlatforms}
                    </Link>

                </div>

            </div>
        </section>
    );
};

export default DownloadCTA;
