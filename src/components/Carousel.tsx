'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { getApiBase } from '@/lib/apiBase';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

interface CarouselSlide {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  order: number;
}

const Carousel = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${getApiBase()}/public/carousel`)
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) {
          // Sort by order
          const sortedSlides = data.data.sort((a: CarouselSlide, b: CarouselSlide) => a.order - b.order);
          setSlides(sortedSlides);
        } else {
          // Fallback to default slides with translations
          setSlides([
            {
              id: '1',
              imageUrl: '/ghost-3d.png',
              title: t.carousel.slide1,
              order: 0
            },
            {
              id: '2',
              imageUrl: '/ghost-3d.png',
              title: t.carousel.slide2,
              order: 1
            },
            {
              id: '3',
              imageUrl: '/ghost-3d.png',
              title: t.carousel.slide3,
              order: 2
            }
          ]);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to default slides on error with translations
        setSlides([
          {
            id: '1',
            imageUrl: '/ghost-3d.png',
            title: t.carousel.slide1,
            order: 0
          },
          {
            id: '2',
            imageUrl: '/ghost-3d.png',
            title: t.carousel.slide2,
            order: 1
          },
          {
            id: '3',
            imageUrl: '/ghost-3d.png',
            title: t.carousel.slide3,
            order: 2
          }
        ]);
        setLoading(false);
      });
  }, [t]);

  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Calculate the maximum translate. For 3 slides, it translates up to -200%
  const maxTranslate = slides.length > 1 ? (slides.length - 1) * 100 : 0;

  // Transform scroll progress (0 to 1) to translateY percentage
  const yTransform = useTransform(scrollYProgress, [0, 1], ['0%', `-${maxTranslate}%`]);

  // Update current slide for pagination dots
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (slides.length > 0) {
      const activeIdx = Math.round(latest * (slides.length - 1));
      if (activeIdx !== currentSlide) {
        setCurrentSlide(activeIdx);
      }
    }
  });

  const goToSlide = (index: number) => {
    // Scroll to the specific slide within the sticky context
    if (containerRef.current) {
      const start = containerRef.current.offsetTop;
      const scrollableHeight = containerRef.current.scrollHeight - window.innerHeight;
      const targetScroll = start + (scrollableHeight * (index / (slides.length - 1)));
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  return (
    <section ref={containerRef} className="w-full relative min-h-[300vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        {/* Background Ambience */}
        <div className="absolute inset-0 bg-[#0F0C16] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-purple-950/20 to-[#0F0C16] pointer-events-none"></div>
        {/* Animated Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-3xl animate-blob will-change-transform transform-gpu"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl animate-blob animation-delay-2000 will-change-transform transform-gpu"></div>
        </div>


        <div className="max-w-[1920px] mx-auto w-full px-4 md:px-8 relative z-10 h-full flex flex-col justify-center">

          {/* Carousel Container */}
          <div className="relative h-[850px] sm:h-[800px] md:h-[900px] lg:h-[1000px] max-h-[100dvh] overflow-hidden pt-28 sm:pt-32 md:pt-16 lg:pt-0">
            {/* Sliding Track */}
            <motion.div
              className="flex flex-col h-full"
              style={{ y: yTransform }}
            >
              {slides.length === 0 && loading ? (
                <div className="w-full min-h-full flex items-center justify-center">
                  <p className="text-gray-400">{t.carousel.loading}</p>
                </div>
              ) : (
                slides.map((slide, index) => {
                  // Determine slide type based on index (for compatibility)
                  const slideType = index % 3 === 1 ? 'mobile-only' : 'desktop-mobile';

                  return (
                    <div
                      key={slide.id}
                      className="w-full h-full relative flex-shrink-0"
                    >
                      <div className="flex flex-col items-center h-full">
                        {/* Title */}
                        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-8 md:mb-12 max-w-[95%] md:max-w-5xl mx-auto leading-tight md:leading-normal px-2 relative z-30">
                          {slide.title || 'Phantom'}
                        </h2>

                        {/* Visuals Container */}
                        <div className="relative flex-1 w-full flex justify-center items-center">

                          {/* SCENARIO 1: Desktop + Mobile (Slides 1 & 3) */}
                          {slideType === 'desktop-mobile' && (
                            <div className="relative w-full max-w-6xl flex justify-center items-center h-full pb-8 md:pb-0">
                              {/* Desktop Screen - Behind */}
                              <div className="hidden md:block relative w-[900px] h-[600px] bg-[#0A0A0A] rounded-[30px] border border-white/10 shadow-2xl mr-32 z-0 overflow-hidden group">
                                {/* Screen Glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none"></div>

                                {/* Content */}
                                <div className="flex flex-col items-center justify-center pt-16">
                                  {/* 3D Logo */}
                                  <div className="relative w-32 h-32 mb-4">
                                    <Image
                                      src="/phantom-ghost.png"
                                      alt="Phantom Logo"
                                      fill
                                      className="object-contain drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]"
                                    />
                                  </div>
                                  {/* Chat List */}
                                  <div className="w-[500px] space-y-4">
                                    <ChatListItems />
                                  </div>
                                </div>
                              </div>

                              {/* Mobile Phone - Front Right Overlap */}
                              <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-[10%] lg:right-[15%] top-1/2 -translate-y-1/2 z-20 transform scale-[0.70] sm:scale-[0.80] md:scale-100">
                                <div className="relative w-[320px] h-[650px] bg-[#0A0A0A] rounded-[45px] border-[6px] border-[#1a1a1a] shadow-2xl overflow-hidden transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                                  {/* Notch & Status Bar */}
                                  <div className="absolute top-0 inset-x-0 h-8 z-30 flex justify-between px-6 items-center pt-2">
                                    <span className="text-white text-xs font-medium">9:41</span>
                                    <div className="w-16 h-5 bg-black rounded-b-xl absolute left-1/2 -translate-x-1/2 top-0"></div>
                                    <div className="w-4 h-2.5 border border-white/60 rounded-[2px] relative"><div className="absolute inset-0.5 bg-white rounded-[1px]"></div></div>
                                  </div>

                                  {/* Content */}
                                  <div className="flex flex-col items-center pt-20 px-4 h-full bg-gradient-to-b from-[#13111A] to-[#0F0C16]">
                                    {/* Small Logo */}
                                    <div className="relative w-16 h-16 mb-8">
                                      <Image
                                        src="/phantom-ghost.png"
                                        alt="Phantom Logo"
                                        fill
                                        className="object-contain drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                                      />
                                    </div>

                                    <div className="w-full space-y-3">
                                      <ChatListItems compact />
                                    </div>

                                    {/* Home Indicator */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* SCENARIO 2: Mobile Only (Slide 2) */}
                          {slideType === 'mobile-only' && (
                            <div className="relative z-20 h-full flex justify-start pt-6 sm:pt-0 sm:justify-center items-start sm:items-center transform scale-[0.70] sm:scale-[0.80] md:scale-100 pb-8 md:pb-0">
                              <div className="relative w-[320px] h-[650px] bg-[#0A0A0A] rounded-[45px] border-[6px] border-[#1a1a1a] shadow-2xl overflow-hidden transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                                {/* Notch & Status Bar */}
                                <div className="absolute top-0 inset-x-0 h-8 z-30 flex justify-between px-6 items-center pt-2">
                                  <span className="text-white text-xs font-medium">9:41</span>
                                  <div className="w-16 h-5 bg-black rounded-b-xl absolute left-1/2 -translate-x-1/2 top-0"></div>
                                  <div className="w-4 h-2.5 border border-white/60 rounded-[2px] relative"><div className="absolute inset-0.5 bg-white rounded-[1px]"></div></div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col items-center pt-20 px-4 h-full bg-gradient-to-b from-[#13111A] to-[#0F0C16]">
                                  {/* Logo */}
                                  <div className="relative w-16 h-16 mb-8">
                                    <Image
                                      src="/phantom-ghost.png"
                                      alt="Phantom Logo"
                                      fill
                                      className="object-contain drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                                    />
                                  </div>

                                  <div className="w-full space-y-3">
                                    <ChatListItems compact />
                                  </div>

                                  {/* Home Indicator */}
                                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full"></div>
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          </div>

          {/* Indicators */}
          {slides.length > 0 && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentSlide
                    ? 'bg-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                    : 'bg-white/30 hover:bg-white/50'
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};


// Reusable Chat List Component
const ChatListItems = ({ compact = false }: { compact?: boolean }) => {
  const { t } = useLanguage();
  const items = t.carousel.chatItems;
  const colors = ['pink', 'blue', 'yellow', 'green'];

  return (
    <>
      {items.map((item, idx) => {
        const color = colors[idx % colors.length];
        return (
          <div key={idx} className={`
                  group
                  flex items-center gap-3 sm:gap-4 
                  ${compact ? 'p-2 sm:p-3 rounded-2xl' : 'p-3 sm:p-4 rounded-xl'}
                  bg-white/5 border border-white/5 backdrop-blur-md transform-gpu
                  hover:bg-white/10 transition-all duration-300 ease-out cursor-pointer
                  hover:-translate-y-1 hover:shadow-xl w-full
                  ${color === 'pink' ? 'hover:shadow-pink-500/10 hover:border-pink-500/20' : ''}
                  ${color === 'blue' ? 'hover:shadow-blue-500/10 hover:border-blue-500/20' : ''}
                  ${color === 'yellow' ? 'hover:shadow-yellow-500/10 hover:border-yellow-500/20' : ''}
                  ${color === 'green' ? 'hover:shadow-green-500/10 hover:border-green-500/20' : ''}
              `}>
            {/* Avatar with Ghost Icon */}
            <div className={`
                      ${compact ? 'w-10 h-10' : 'w-12 h-12'} 
                      rounded-full flex items-center justify-center shrink-0 overflow-hidden relative
                      ${color === 'pink' ? 'bg-[#3A1425] shadow-[0_0_10px_rgba(236,72,153,0.3)]' : ''}
                      ${color === 'blue' ? 'bg-[#10243E] shadow-[0_0_10px_rgba(59,130,246,0.3)]' : ''}
                      ${color === 'yellow' ? 'bg-[#3E3810] shadow-[0_0_10px_rgba(234,179,8,0.3)]' : ''}
                      ${color === 'green' ? 'bg-[#0F2922] shadow-[0_0_10px_rgba(34,197,94,0.3)]' : ''}
                  `}>
              <div className={`${compact ? 'w-8 h-8' : 'w-9 h-9'} relative`}>
                <Image
                  src={
                    color === 'pink' ? '/ghost-v2-pink.png' :
                      color === 'blue' ? '/ghost-v2-blue.png' :
                        color === 'yellow' ? '/ghost-v2-yellow.png' :
                          '/ghost-v2-green.png'
                  }
                  alt="Ghost Avatar"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-white font-medium text-sm md:text-base leading-none mb-1">{item.name}</div>
              <div className="text-gray-400 text-xs md:text-sm truncate">{item.msg}</div>
            </div>
            <div className="text-gray-500 text-[10px] sm:text-xs">{item.time}</div>
          </div>
        );
      })}
    </>
  );
}

export default Carousel;
