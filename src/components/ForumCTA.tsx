import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ForumCTA = () => {
    return (
        <section className="w-full px-4 md:px-8 py-20 relative z-20">
            <div className="max-w-5xl mx-auto w-full">
                {/* Header Text */}
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-left">
                    Присоединяйтесь к форуму Phantom!
                </h2>

                {/* Card */}
                <div className="relative w-full bg-[#111] rounded-[40px] overflow-hidden p-8 md:p-12 border border-white/5">

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
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-10 max-w-md">
                            Phantom развивается вместе с сообществом. Форум — это место, где вы можете предложить идею, обсудить развитие проекта, задать вопрос или внести вклад в улучшение экосистемы. Чем больше нас — тем сильнее безопасность
                        </p>

                        {/* Button */}
                        <Link href="/forum" className="inline-block bg-white text-black font-semibold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors">
                            Вступить
                        </Link>
                    </div>

                    {/* Large Ghost Image - Right Side */}
                    <div className="absolute -right-20 -bottom-32 w-[600px] h-[600px] pointer-events-none">
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
