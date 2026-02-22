'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const ForumCTA = () => {
    const { t } = useLanguage();

    return (
        <section className="w-full px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 relative z-20">
            <div className="max-w-5xl mx-auto w-full">
                {/* Header Text */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 text-left">
                    {t.forum.title}
                </h2>

                {/* Card */}
                <div className="relative w-full bg-[#111] rounded-2xl sm:rounded-3xl md:rounded-[40px] overflow-hidden p-6 sm:p-8 md:p-12 border border-white/5">

                    {/* Content Wrapper */}
                    <div className="relative z-10 max-w-lg">

                        {/* Small Label */}
                        <div className="flex items-center gap-2 mb-6 opacity-80">
                            <div className="w-5 h-5 relative">
                                <Image
                                    src="/phantom-ghost.png"
                                    alt="icon"
                                    fill
                                    className="object-contain opacity-80"
                                />
                            </div>
                            <span className="text-white/80 text-sm font-medium tracking-wide">Phantom</span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed mb-8 sm:mb-10 max-w-md">
                            {t.forum.description}
                        </p>

                        {/* Button */}
                        <Link href="/forum" className="inline-block bg-white text-black font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full text-sm hover:bg-gray-200 transition-colors">
                            {t.forum.button}
                        </Link>
                    </div>

                    {/* Large Ghost Image - Right Side */}
                    <div className="absolute -right-20 -bottom-32 w-[600px] h-[600px] pointer-events-none hidden sm:block">
                        <Image
                            src="/ghost-v2-pink.png"
                            alt="Forum Ghost"
                            fill
                            className="object-contain drop-shadow-[0_0_80px_rgba(168,85,247,0.4)]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForumCTA;
