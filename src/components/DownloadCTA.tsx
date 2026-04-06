'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { OS, useOS } from '@/hooks/useOS';

const DownloadCTA = () => {
    const { t } = useLanguage();
    const os = useOS();
    
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Helper to format the download text
    const getDownloadText = (os: OS) => {
        if (os === 'Unknown') return t.downloadCTA.btnDownload;
        return t.downloadCTA.btnDownloadOS.replace('{os}', os);
    };

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

                    <Link href="/install" className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white font-semibold transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] active:scale-95 flex items-center gap-2 max-w-full truncate">
                        {os === 'Windows' && (
                            <svg className="w-6 h-6 shrink-0 fill-white" viewBox="0 0 24 24">
                                <path d="M0 3.449L9.75 2.1v9.451H0V3.449zm10.949-1.655L24 0v11.551H10.949V1.794zM0 12.6h9.75v9.451L0 20.85V12.6zm10.949 0H24v11.794l-13.051-1.794V12.6z" />
                            </svg>
                        )}
                        {(os === 'MacOS' || os === 'iOS') && (
                            <svg className="w-6 h-6 shrink-0 fill-white" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
                            </svg>
                        )}
                        {os === 'Android' && (
                            <svg className="w-6 h-6 shrink-0 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.6074 6.9958l1.6255-2.8215c.1387-.2406.0561-.5521-.1844-.6907-.2406-.1387-.5521-.0561-.6907.1844l-1.6351 2.8382c-1.0667-.4886-2.2756-.7696-3.5588-.7696s-2.4921.281-3.5588.7696l-1.6351-2.8382c-.1387-.2406-.4501-.3231-.6907-.1844-.2406.1387-.3231.4501-.1844.6907l1.6255 2.8215c-2.4054 1.3186-4.0378 3.8078-4.1566 6.7007h17.0998c-.1189-2.8929-1.7513-5.3821-4.1566-6.7007zm-8.275 5.2816c-.4132 0-.7484-.3352-.7484-.7484 0-.4132.3352-.7484.7484-.7484s.7484.3352.7484.7484c0 .4132-.3352.7484-.7484.7484zm7.4989 0c-.4132 0-.7484-.3352-.7484-.7484 0-.4132.3352-.7484.7484-.7484s.7484.3352.7484.7484c0 .4132-.3352.7484-.7484.7484z" />
                            </svg>
                        )}
                        {os === 'Linux' && (
                            <img
                                src="/linux-penguin.webp"
                                alt="Linux"
                                className="w-6 h-6 shrink-0 object-contain brightness-0 invert"
                            />
                        )}
                        <span className="truncate">{getDownloadText(os)}</span>
                    </Link>

                    {/* Secondary Button */}
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-gray-300 font-medium hover:bg-white/10 transition-colors whitespace-nowrap flex items-center gap-2"
                        >
                            {t.downloadCTA.btnOtherPlatforms}
                            <svg className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        {dropdownOpen && (
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-56 bg-gradient-to-t from-[#13111A] to-[#0A0810]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.2)] overflow-hidden flex flex-col z-50 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200">
                                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
                                {[
                                    { 
                                        id: 'windows', 
                                        name: 'Windows',
                                        icon: <svg className="w-4 h-4 fill-current group-hover:text-purple-400 transition-colors" viewBox="0 0 24 24"><path d="M0 3.449L9.75 2.1v9.451H0V3.449zm10.949-1.655L24 0v11.551H10.949V1.794zM0 12.6h9.75v9.451L0 20.85V12.6zm10.949 0H24v11.794l-13.051-1.794V12.6z" /></svg>
                                    },
                                    { 
                                        id: 'macos', 
                                        name: 'MacOS',
                                        icon: <svg className="w-4 h-4 fill-current group-hover:text-purple-400 transition-colors" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" /></svg>
                                    },
                                    { 
                                        id: 'linux', 
                                        name: 'Linux',
                                        icon: <div className="w-4 h-4 bg-current group-hover:text-purple-400 transition-colors" style={{ maskImage: "url('/linux-penguin.webp')", maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center", WebkitMaskImage: "url('/linux-penguin.webp')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
                                    },
                                    { 
                                        id: 'android', 
                                        name: 'Android',
                                        icon: <svg className="w-4 h-4 fill-current group-hover:text-purple-400 transition-colors" viewBox="0 0 24 24"><path d="M16.6074 6.9958l1.6255-2.8215c.1387-.2406.0561-.5521-.1844-.6907-.2406-.1387-.5521-.0561-.6907.1844l-1.6351 2.8382c-1.0667-.4886-2.2756-.7696-3.5588-.7696s-2.4921.281-3.5588.7696l-1.6351-2.8382c-.1387-.2406-.4501-.3231-.6907-.1844-.2406.1387-.3231.4501-.1844.6907l1.6255 2.8215c-2.4054 1.3186-4.0378 3.8078-4.1566 6.7007h17.0998c-.1189-2.8929-1.7513-5.3821-4.1566-6.7007zm-8.275 5.2816c-.4132 0-.7484-.3352-.7484-.7484 0-.4132.3352-.7484.7484-.7484s.7484.3352.7484.7484c0 .4132-.3352.7484-.7484.7484zm7.4989 0c-.4132 0-.7484-.3352-.7484-.7484 0-.4132.3352-.7484.7484-.7484s.7484.3352.7484.7484c0 .4132-.3352.7484-.7484.7484z" /></svg>
                                    },
                                    { 
                                        id: 'ios', 
                                        name: 'iOS',
                                        icon: <svg className="w-4 h-4 fill-current group-hover:text-purple-400 transition-colors" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" /></svg>
                                    }
                                ].map((platform) => (
                                    <Link 
                                        key={platform.id} 
                                        href={`/install?os=${platform.id}`}
                                        className="px-5 py-3.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all text-left flex items-center justify-between border-b border-white/5 last:border-0 group relative z-10"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {platform.icon}
                                            <span className="group-hover:translate-x-1 transition-transform">{platform.name}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </section>
    );
};

export default DownloadCTA;
