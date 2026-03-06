'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="flex flex-col lg:grid lg:grid-cols-[1.2fr_0.8fr] xl:grid-cols-[1.3fr_0.7fr] items-center justify-center py-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32 gap-10 lg:gap-12 relative min-h-[80vh] w-full mt-10 lg:mt-0 lg:pt-24">
      {/* Horizontal Animated Line - Behind All Content */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] pointer-events-none hidden lg:block" style={{ zIndex: 0, width: '100vw', left: '50%', transform: 'translateX(-50%)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-shimmer"></div>
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none -z-10"></div>

      {/* Background Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Additional Floating Orbs */}
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-orb-float"></div>
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-orb-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-violet-500/20 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-orb-float animation-delay-4000"></div>
      </div>

      {/* Floating Particles/Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-float-up"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute w-2 h-2 bg-white rounded-full animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-full filter blur-3xl animate-glow-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-purple-500/10 rounded-full filter blur-3xl animate-glow-pulse animation-delay-2000"></div>
      </div>

      {/* Floating Security Icons Around Text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block" style={{ zIndex: 5 }}>
        {/* Lock Icon - Top Left */}
        <div className="absolute top-20 left-10 animate-float-icon" style={{ animationDelay: '0s' }}>
          <svg className="w-8 h-8 text-purple-400/40 animate-pulse-glow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        {/* Shield Icon - Top Right */}
        <div className="absolute top-32 right-20 animate-float-icon" style={{ animationDelay: '1.5s' }}>
          <svg className="w-10 h-10 text-blue-400/40 animate-pulse-glow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        {/* Key Icon - Bottom Left */}
        <div className="absolute bottom-40 left-16 animate-float-icon" style={{ animationDelay: '3s' }}>
          <svg className="w-7 h-7 text-pink-400/40 animate-pulse-glow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </svg>
        </div>

        {/* Hexagon Security Icon */}
        <div className="absolute top-1/3 left-1/4 animate-rotate-scale" style={{ animationDelay: '2s' }}>
          <svg className="w-12 h-12 text-cyan-400/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
            <path d="M12 12l-4-2v4l4 2 4-2v-4l-4 2z" />
          </svg>
        </div>
      </div>

      {/* Animated Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block" style={{ zIndex: 3 }}>
        {/* Rotating Triangle */}
        <div className="absolute top-1/4 right-1/3 animate-rotate-scale" style={{ animationDuration: '12s' }}>
          <svg className="w-16 h-16 text-purple-500/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L2 22h20L12 2z" />
          </svg>
        </div>

        {/* Floating Diamond */}
        <div className="absolute bottom-1/3 right-1/4 animate-bounce-float" style={{ animationDelay: '1s' }}>
          <svg className="w-14 h-14 text-blue-500/20 animate-pulse-glow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L2 12l10 10 10-10L12 2z" />
          </svg>
        </div>

        {/* Rotating Circle with Pattern */}
        <div className="absolute top-2/3 left-1/5 animate-smooth-rotate" style={{ animationDuration: '18s' }}>
          <svg className="w-20 h-20 text-pink-500/15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </div>
      </div>

      {/* Left Column: Text & Buttons */}
      <div className="flex flex-col gap-6 lg:gap-8 relative animate-fade-in-up order-1 mt-12 lg:mt-0 w-full items-center lg:items-start text-center lg:text-left" style={{ zIndex: 10 }}>

        {/* Badge removed */}

        <h1 className="text-[36px] sm:text-5xl lg:text-[44px] xl:text-[56px] 2xl:text-6xl font-bold leading-[1.15] tracking-tight relative whitespace-pre-wrap min-w-min mx-auto lg:mx-0">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400 animate-gradient-shift">{t.hero.title}</span><br className="sm:hidden" /> {t.hero.subtitle}
          <br />
          {t.hero.subtitle2}

          {/* Decorative Stars/Sparkles */}
          <svg className="absolute -top-8 -left-8 w-12 h-12 text-purple-500/50 animate-spin-slow hidden lg:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
          <svg className="absolute -top-4 right-12 w-8 h-8 text-blue-400/40 animate-sparkle animation-delay-2000 hidden lg:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
          <svg className="absolute top-16 -right-4 w-6 h-6 text-pink-400/40 animate-sparkle animation-delay-4000 hidden lg:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>

          {/* Animated Glow Behind Text */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 blur-2xl -z-10 animate-pulse-scale"></div>

          {/* Floating Crypto Icons */}
          <div className="absolute -right-12 top-1/2 -translate-y-1/2 animate-float-icon hidden lg:block" style={{ animationDelay: '1s' }}>
            <svg className="w-10 h-10 text-purple-400/30 animate-rotate-scale" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
              <path d="M12 12l-4-2v4l4 2 4-2v-4l-4 2z" />
            </svg>
          </div>
        </h1>

        <p className="text-gray-400 text-base sm:text-lg md:text-lg leading-relaxed max-w-2xl lg:max-w-lg font-normal animate-fade-in-up mx-auto lg:mx-0" style={{ animationDelay: '0.2s', opacity: 0 }}>
          {t.hero.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mt-2 animate-fade-in-up w-full sm:w-auto mx-auto lg:mx-0" style={{ animationDelay: '0.4s', opacity: 0 }}>
          <Link href="/install" className="w-full sm:w-auto relative overflow-hidden bg-[#8B5CF6] hover:bg-[#7c4dff] text-white font-medium py-3 sm:py-3.5 px-6 sm:px-9 rounded-full transition-all duration-500 ease-out flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] hover:-translate-y-1 active:scale-95 text-[15px] group animate-pulse-glow">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/30 to-purple-400/0 animate-shimmer"></span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path d="M12 12v9" />
              <path d="m16 16-4 4-4-4" />
            </svg>
            <span className="relative z-10 whitespace-nowrap">{t.hero.btnDownload}</span>
          </Link>
          <Link href="/docs" className="w-full sm:w-auto flex justify-center items-center relative bg-[#1F1D2B] hover:bg-[#2a2838] text-white font-medium py-3 sm:py-3.5 px-6 sm:px-9 rounded-full transition-all duration-500 ease-out border border-white/5 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-900/20 hover:-translate-y-1 active:scale-95 text-[15px] group overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></span>
            <span className="relative z-10 transition-all duration-300 group-hover:tracking-wide whitespace-nowrap">{t.hero.btnLearnMore}</span>
          </Link>
        </div>

        {/* Stats / Trust Indicators */}
        <div className="flex flex-row justify-center lg:justify-start items-center gap-6 md:gap-8 mt-4 pt-6 sm:pt-8 border-t border-white/5 relative animate-fade-in-up w-full max-w-sm sm:max-w-md lg:max-w-none mx-auto lg:mx-0" style={{ animationDelay: '0.6s', opacity: 0, zIndex: 10 }}>
          <div className="flex flex-col group cursor-default relative items-center lg:items-start text-center lg:text-left">
            <span className="text-xl md:text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">100%</span>
            <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider group-hover:text-gray-400 transition-colors">{t.hero.stat1}</span>
            <div className="absolute -inset-2 bg-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-opacity" style={{ zIndex: -1 }}></div>
          </div>
          <div className="flex flex-col group cursor-default relative items-center lg:items-start text-center lg:text-left">
            <span className="text-xl md:text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300">P2P</span>
            <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider group-hover:text-gray-400 transition-colors">{t.hero.stat2}</span>
            <div className="absolute -inset-2 bg-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-opacity" style={{ zIndex: -1 }}></div>
          </div>
          <div className="flex flex-col group cursor-default relative items-center lg:items-start text-center lg:text-left">
            <span className="text-xl md:text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 transition-all duration-300">AES</span>
            <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider group-hover:text-gray-400 transition-colors">{t.hero.stat3}</span>
            <div className="absolute -inset-2 bg-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-opacity" style={{ zIndex: -1 }}></div>
          </div>
        </div>
      </div>

      {/* Right Column: Platform Card & 3D Ghost */}
      <div className="relative flex justify-center items-center animate-slide-in-right order-2 w-full mt-12 lg:mt-0" style={{ animationDelay: '0.3s', opacity: 0, zIndex: 10 }}>

        {/* Background Purple Glow (Behind Card) */}
        <div className="absolute top-1/2 right-0 w-full max-w-[500px] h-full max-h-[500px] bg-purple-600/30 blur-[120px] rounded-full pointer-events-none" style={{ zIndex: 1, left: '50%', transform: 'translate(-50%, -50%)' }}></div>

        {/* Floating Security Elements Around Card */}
        <div className="absolute inset-0 overflow-visible pointer-events-none hidden sm:block" style={{ zIndex: 8 }}>
          {/* Shield Icon - Top Right of Card */}
          <div className="absolute -top-8 -right-8 animate-float-icon" style={{ animationDelay: '0.5s' }}>
            <svg className="w-16 h-16 text-purple-400/30 animate-glow-pulse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>

          {/* Lock Icon - Bottom Left of Card */}
          <div className="absolute -bottom-6 -left-6 animate-float-icon" style={{ animationDelay: '2s' }}>
            <svg className="w-14 h-14 text-blue-400/30 animate-glow-pulse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          {/* Key Icon - Top Left of Card */}
          <div className="absolute -top-6 left-1/4 animate-float-icon" style={{ animationDelay: '3.5s' }}>
            <svg className="w-12 h-12 text-cyan-400/30 animate-glow-pulse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
          </div>
        </div>

        {/* Card Container */}
        <div className="relative bg-[#13111A] border border-white/10 p-6 sm:p-8 rounded-[32px] w-full max-w-[360px] sm:max-w-[400px] flex flex-col items-center shadow-2xl group overflow-hidden animate-fade-in-scale" style={{ animationDelay: '0.5s', opacity: 0, zIndex: 10 }}>

          {/* Animated Border Glow */}
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 ease-out -z-10"></div>

          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity"></div>

          {/* Floating Particles Inside Card */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={`card-particle-${i}`}
                className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-float-up"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 8}s`,
                  animationDuration: `${8 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>

          {/* Card Header */}
          <h3 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6 relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300 text-center">
            {t.carousel.otherPlatforms}
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></div>
          </h3>

          {/* Platforms Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 w-full mb-6 sm:mb-8 relative z-10">
            {/* Android */}
            <Link href="/install" className="relative flex items-center justify-center gap-3 bg-[#1C1A26] hover:bg-[#252330] py-4 px-4 rounded-2xl text-white font-medium transition-all duration-500 ease-out border border-white/5 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/20 group overflow-hidden animate-platform-hover hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:via-green-500/5 group-hover:to-green-500/10 transition-all duration-500 ease-out"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              <svg className="relative z-10 w-6 h-6 shrink-0 fill-white group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] transition-all duration-500 ease-out group-hover:rotate-12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.7201c.148.108.216.285.172.459-.043.174-.182.309-.359.349-.178.04-.366-.029-.474-.177l-1.636-2.237c-.369.25-.763.468-1.17.649l.643 2.249c.051.176-.017.366-.169.474-.152.108-.357.108-.509 0-.152-.108-.22-.298-.169-.474l.739-2.586c-1.345.354-2.786.354-4.131 0l.739 2.586c.051.176-.017.366-.169.474-.152.108-.357.108-.509 0-.152-.108-.22-.298-.169-.474l.643-2.249c-.407-.181-.801-.399-1.17-.649l-1.636 2.237c-.108.148-.296.217-.474.177-.177-.04-.316-.175-.359-.349-.044-.174.024-.351.172-.459l1.723-2.356c-1.79 1.274-2.897 3.235-2.897 5.326 0 3.974 3.977 7.197 8.883 7.197s8.883-3.223 8.883-7.197c0-2.091-1.107-4.052-2.897-5.326l1.723 2.356z" opacity="0" /> {/* spacer */}
                <path d="M16.6074 6.9958l1.6255-2.8215c.1387-.2406.0561-.5521-.1844-.6907-.2406-.1387-.5521-.0561-.6907.1844l-1.6351 2.8382c-1.0667-.4886-2.2756-.7696-3.5588-.7696s-2.4921.281-3.5588.7696l-1.6351-2.8382c-.1387-.2406-.4501-.3231-.6907-.1844-.2406.1387-.3231.4501-.1844.6907l1.6255 2.8215c-2.4054 1.3186-4.0378 3.8078-4.1566 6.7007h17.0998c-.1189-2.8929-1.7513-5.3821-4.1566-6.7007zm-8.275 5.2816c-.4132 0-.7484-.3352-.7484-.7484 0-.4132.3352-.7484.7484-.7484s.7484.3352.7484.7484c0 .4132-.3352.7484-.7484.7484zm7.4989 0c-.4132 0-.7484-.3352-.7484-.7484 0-.4132.3352-.7484.7484-.7484s.7484.3352.7484.7484c0 .4132-.3352.7484-.7484.7484z" />
              </svg>
              <span className="relative z-10">Android</span>
            </Link>

            {/* iOS */}
            <Link href="/install" className="relative flex items-center justify-center gap-3 bg-[#1C1A26] hover:bg-[#252330] py-4 px-4 rounded-2xl text-white font-medium transition-all duration-500 ease-out border border-white/5 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/20 group overflow-hidden animate-platform-hover hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-blue-500/5 group-hover:to-blue-500/10 transition-all duration-500 ease-out"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              <svg className="relative z-10 w-6 h-6 shrink-0 fill-white group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all duration-500 ease-out group-hover:rotate-12" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
              </svg>
              <span className="relative z-10">iOS</span>
            </Link>

            {/* Linux - PNG Icon */}
            <Link href="/install" className="relative flex items-center justify-center gap-3 bg-[#1C1A26] hover:bg-[#252330] py-4 px-4 rounded-2xl text-white font-medium transition-all duration-500 ease-out border border-white/5 hover:border-yellow-500/40 hover:shadow-lg hover:shadow-yellow-500/20 group overflow-hidden animate-platform-hover hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 via-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/10 group-hover:via-yellow-500/5 group-hover:to-yellow-500/10 transition-all duration-500 ease-out"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              <img
                src="/linux-penguin.png"
                alt="Linux"
                className="relative z-10 w-6 h-6 shrink-0 object-contain group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(234,179,8,0.6)] transition-all duration-500 ease-out group-hover:rotate-12 brightness-0 invert"
              />
              <span className="relative z-10">Linux</span>
            </Link>

            {/* MacOS */}
            <Link href="/install" className="relative flex items-center justify-center gap-3 bg-[#1C1A26] hover:bg-[#252330] py-4 px-4 rounded-2xl text-white font-medium transition-all duration-500 ease-out border border-white/5 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20 group overflow-hidden animate-platform-hover hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:via-purple-500/5 group-hover:to-purple-500/10 transition-all duration-500 ease-out"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              <svg className="relative z-10 w-6 h-6 shrink-0 fill-white group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.6)] transition-all duration-500 ease-out group-hover:rotate-12" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
              </svg>
              <span className="relative z-10">MacOS</span>
            </Link>
          </div>

          {/* 3D Ghost Image with Enhanced Float Animation - Only on Hover */}
          <div className="relative -mb-20 mt-4 ghost-container group" style={{ animationDelay: '0.7s', zIndex: 10 }}>
            {/* Glow Orbs Around Ghost - Animate on Hover */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl transition-all duration-1000 group-hover:animate-glow-wave"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-2xl transition-all duration-1000 group-hover:animate-glow-wave" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-pink-500/15 rounded-full blur-xl transition-all duration-1000 group-hover:animate-glow-wave" style={{ animationDelay: '4s' }}></div>

            {/* Rotating Rings with Smooth Animation - Animate on Hover */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] border border-purple-500/10 rounded-full transition-all duration-1000 group-hover:animate-smooth-rotate"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] border border-blue-500/10 rounded-full transition-all duration-1000 group-hover:animate-smooth-rotate" style={{ animationDirection: 'reverse', animationDuration: '25s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] border border-pink-500/5 rounded-full transition-all duration-1000 group-hover:animate-smooth-rotate" style={{ animationDuration: '30s' }}></div>

            {/* Sparkles Around Ghost with Enhanced Animation - Animate on Hover */}
            {[...Array(8)].map((_, i) => {
              const angle = (i * 360) / 8;
              const radius = 180;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              return (
                <div
                  key={`ghost-sparkle-${i}`}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-sparkle transition-all duration-500"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              );
            })}

            {/* Additional Floating Particles - Animate on Hover */}
            {[...Array(6)].map((_, i) => {
              const angle = (i * 360) / 6;
              const radius = 220;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              return (
                <div
                  key={`ghost-particle-${i}`}
                  className="absolute top-1/2 left-1/2 w-1 h-1 bg-cyan-400/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-sparkle transition-all duration-700"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: '3s',
                  }}
                />
              );
            })}

            {/* Orbiting Security Icons Around Ghost - Animate on Hover */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:animate-orbit transition-opacity duration-500" style={{ animationDuration: '20s' }}>
              <svg className="w-6 h-6 text-purple-400/50 group-hover:animate-pulse-glow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:animate-orbit transition-opacity duration-500" style={{ animationDuration: '25s', animationDirection: 'reverse' }}>
              <svg className="w-5 h-5 text-blue-400/50 group-hover:animate-pulse-glow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:animate-orbit transition-opacity duration-500" style={{ animationDuration: '30s', transform: 'translate(-50%, -50%) rotate(120deg) translateX(150px) rotate(-120deg)' }}>
              <svg className="w-4 h-4 text-pink-400/50 group-hover:animate-pulse-glow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
            </div>

            {/* Using standard img tag to bypass build error for potentially corrupted image */}
            <img
              src="/ghost-3d.png"
              alt="Phantom Ghost 3D"
              className="relative z-10 w-[320px] h-auto object-contain drop-shadow-[0_10px_40px_rgba(139,92,246,0.5)] transition-all duration-500 ease-out group-hover:drop-shadow-[0_15px_50px_rgba(139,92,246,0.7)] cursor-pointer"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;