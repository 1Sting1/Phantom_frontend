'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface CarouselSlide {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  order: number;
}

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1'}/public/carousel`)
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) {
          // Sort by order
          const sortedSlides = data.data.sort((a: CarouselSlide, b: CarouselSlide) => a.order - b.order);
          setSlides(sortedSlides);
        } else {
          // Fallback to default slides if API returns empty
          setSlides([
            {
              id: '1',
              imageUrl: '/ghost-3d.png',
              title: "Интерфейс, созданный для скорости, приватности и фокуса",
              order: 0
            },
            {
              id: '2',
              imageUrl: '/ghost-3d.png',
              title: "Мгновенная синхронизация",
              order: 1
            },
            {
              id: '3',
              imageUrl: '/ghost-3d.png',
              title: "Расширенные настройки приватности",
              order: 2
            }
          ]);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to default slides on error
        setSlides([
          {
            id: '1',
            imageUrl: '/ghost-3d.png',
            title: "Интерфейс, созданный для скорости, приватности и фокуса",
            order: 0
          },
          {
            id: '2',
            imageUrl: '/ghost-3d.png',
            title: "Мгновенная синхронизация",
            order: 1
          },
          {
            id: '3',
            imageUrl: '/ghost-3d.png',
            title: "Расширенные настройки приватности",
            order: 2
          }
        ]);
        setLoading(false);
      });
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-20 w-full relative overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[#0F0C16] pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-purple-950/20 to-[#0F0C16] pointer-events-none"></div>
      {/* Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000`}></div>
      </div>


      <div className="max-w-[1920px] mx-auto w-full px-4 md:px-8 relative z-10">

        {/* Carousel Container */}
        <div className="relative h-[800px] md:h-[900px] lg:h-[1000px] overflow-hidden">
          {/* Sliding Track */}
          {/* Sliding Track */}
          <div
            className="flex flex-col h-full transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
            style={{ transform: `translateY(-${currentSlide * 100}%)` }}
          >
            {slides.length === 0 && loading ? (
              <div className="w-full min-h-full flex items-center justify-center">
                <p className="text-gray-400">Загрузка...</p>
              </div>
            ) : (
              slides.map((slide, index) => {
                // Determine slide type based on index (for compatibility)
                const slideType = index % 3 === 1 ? 'mobile-only' : 'desktop-mobile';
                
                return (
                  <div
                    key={slide.id}
                    className="w-full min-h-full relative flex-shrink-0"
                  >
                    <div className="flex flex-col items-center h-full">
                      {/* Title */}
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-12 max-w-5xl mx-auto leading-normal drop-shadow-lg">
                        {slide.title || 'Phantom'}
                      </h2>

                      {/* Visuals Container */}
                      <div className="relative flex-1 w-full flex justify-center items-center">

                        {/* SCENARIO 1: Desktop + Mobile (Slides 1 & 3) */}
                        {slideType === 'desktop-mobile' && (
                      <div className="relative w-full max-w-6xl flex justify-center items-center">
                        {/* Desktop Screen - Behind */}
                        <div className="relative w-[900px] h-[600px] bg-[#0A0A0A] rounded-[30px] border border-white/10 shadow-2xl mr-32 z-0 overflow-hidden group">
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
                        <div className="absolute right-[10%] lg:right-[15%] top-1/2 -translate-y-1/2 z-20">
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
                      <div className="relative z-20">
                        <div className="relative w-[340px] h-[700px] bg-[#0A0A0A] rounded-[50px] border-[8px] border-[#1a1a1a] shadow-2xl overflow-hidden transform scale-110 transition-all duration-500 ease-out hover:scale-[1.13] hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                          {/* Notch & Status Bar */}
                          <div className="absolute top-0 inset-x-0 h-8 z-30 flex justify-between px-6 items-center pt-3">
                            <span className="text-white text-xs font-medium">9:41</span>
                            <div className="w-20 h-6 bg-black rounded-b-xl absolute left-1/2 -translate-x-1/2 top-0"></div>
                            <div className="w-4 h-2.5 border border-white/60 rounded-[2px] relative"><div className="absolute inset-0.5 bg-white rounded-[1px]"></div></div>
                          </div>

                          {/* Content */}
                          <div className="flex flex-col items-center pt-24 px-5 h-full bg-gradient-to-b from-[#13111A] to-[#0F0C16]">
                            {/* Larger Logo */}
                            <div className="relative w-24 h-24 mb-10">
                              <Image
                                src="/phantom-ghost.png"
                                alt="Phantom Logo"
                                fill
                                className="object-contain drop-shadow-[0_0_20px_rgba(139,92,246,0.7)]"
                              />
                            </div>

                            <div className="w-full space-y-4">
                              <ChatListItems compact />
                            </div>

                            {/* Home Indicator */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/20 rounded-full"></div>
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
          </div>
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
    </section>
  );
};


// Reusable Chat List Component
const ChatListItems = ({ compact = false }: { compact?: boolean }) => {
  const items = [
    { name: 'Alex', msg: 'See you tommorow', time: '2m', color: 'pink' }, // 'tommorow' to match typo in design if sticking to strict 1:1, or fix it? Design has 'tommorow' in screenshot.
    { name: 'Jamie', msg: "What's up?", time: '5m', color: 'blue' },
    { name: 'Morgan', msg: 'Got it, thanks!', time: '1h', color: 'yellow' }, // In screenshot looks dark/grayish
    { name: 'Sam', msg: "Let's meet up!", time: '3h', color: 'green' }
  ];

  return (
    <>
      {items.map((item, idx) => (
        <div key={idx} className={`
                group
                flex items-center gap-4 
                ${compact ? 'p-3 rounded-2xl' : 'p-4 rounded-xl'}
                bg-white/5 border border-white/5 backdrop-blur-md
                hover:bg-white/10 transition-all duration-300 ease-out cursor-pointer
                hover:-translate-y-1 hover:shadow-xl
                ${item.color === 'pink' ? 'hover:shadow-pink-500/10 hover:border-pink-500/20' : ''}
                ${item.color === 'blue' ? 'hover:shadow-blue-500/10 hover:border-blue-500/20' : ''}
                ${item.color === 'yellow' ? 'hover:shadow-yellow-500/10 hover:border-yellow-500/20' : ''}
                ${item.color === 'green' ? 'hover:shadow-green-500/10 hover:border-green-500/20' : ''}
            `}>
          {/* Avatar with Ghost Icon */}
          <div className={`
                    ${compact ? 'w-10 h-10' : 'w-12 h-12'} 
                    rounded-full flex items-center justify-center shrink-0 overflow-hidden relative
                    ${item.color === 'pink' ? 'bg-[#3A1425] shadow-[0_0_10px_rgba(236,72,153,0.3)]' : ''}
                    ${item.color === 'blue' ? 'bg-[#10243E] shadow-[0_0_10px_rgba(59,130,246,0.3)]' : ''}
                    ${item.color === 'yellow' ? 'bg-[#3E3810] shadow-[0_0_10px_rgba(234,179,8,0.3)]' : ''}
                    ${item.color === 'green' ? 'bg-[#0F2922] shadow-[0_0_10px_rgba(34,197,94,0.3)]' : ''}
                `}>
            <div className={`${compact ? 'w-8 h-8' : 'w-9 h-9'} relative`}>
              <Image
                src={
                  item.color === 'pink' ? '/ghost-v2-pink.png' :
                    item.color === 'blue' ? '/ghost-v2-blue.png' :
                      item.color === 'yellow' ? '/ghost-v2-yellow.png' :
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
        </div>
      ))}
    </>
  );
}

export default Carousel;
