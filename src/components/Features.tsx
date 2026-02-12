'use client';

import React, { useState, useEffect } from 'react';

const FeatureCard = ({ title, description, footerText }: { title: string, description: string, footerText: string }) => {
  return (
    <div className="group relative bg-[#13111A] border border-white/10 hover:border-purple-500/50 p-8 rounded-2xl transition-all duration-300 flex flex-col min-h-[320px] overflow-hidden hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:-translate-y-1 w-full max-w-sm">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity"></div>
      
      <div className="relative z-10 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-[#8B5CF6] mb-6 leading-tight whitespace-pre-line">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-auto flex-grow">{description}</p>
      </div>
      
      <div className="relative z-10 flex items-center gap-2 mt-8">
        <span className="text-gray-500 text-xs">{footerText}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <path d="M12 17h.01"/>
        </svg>
      </div>
    </div>
  );
};

interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string;
  order: number;
  language: string;
}

const Features = () => {
  const [featuresData, setFeaturesData] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('ru');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1'}/public/features?lang=${language}`)
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) {
          // Sort by order
          const sortedFeatures = data.data.sort((a: Feature, b: Feature) => a.order - b.order);
          setFeaturesData(sortedFeatures);
        } else {
          // Fallback to default features
          setFeaturesData([
            {
              id: '1',
              title: "Гибридное E2E-\nшифрование",
              description: "Каждая сессия защищена одновременно постквантовым Kyber и классическим X25519. Чтобы взломать соединение, нужно сломать оба алгоритма сразу.",
              order: 0,
              language: 'ru'
            },
            {
              id: '2',
              title: "Децентрализация\nпо умолчанию",
              description: "Phantom может работать без центрального сервера: клиенты находят друг друга через DHT, mDNS и relay-узлы. Сервер выступает только как fallback-транспорт.",
              order: 1,
              language: 'ru'
            },
            {
              id: '3',
              title: "Отдельное\nклиентское ядро",
              description: "Ядро инкапсулирует всю криптографию, сеть и хранение. UI общается с ним через асинхронный API и события: можно строить свои клиенты, не переписывая протокол.",
              order: 2,
              language: 'ru'
            }
          ]);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to default features on error
        setFeaturesData([
          {
            id: '1',
            title: "Гибридное E2E-\nшифрование",
            description: "Каждая сессия защищена одновременно постквантовым Kyber и классическим X25519. Чтобы взломать соединение, нужно сломать оба алгоритма сразу.",
            order: 0,
            language: 'ru'
          },
          {
            id: '2',
            title: "Децентрализация\nпо умолчанию",
            description: "Phantom может работать без центрального сервера: клиенты находят друг друга через DHT, mDNS и relay-узлы. Сервер выступает только как fallback-транспорт.",
            order: 1,
            language: 'ru'
          },
          {
            id: '3',
            title: "Отдельное\nклиентское ядро",
            description: "Ядро инкапсулирует всю криптографию, сеть и хранение. UI общается с ним через асинхронный API и события: можно строить свои клиенты, не переписывая протокол.",
            order: 2,
            language: 'ru'
          }
        ]);
        setLoading(false);
      });
  }, [language]);

  return (
    <section className="py-32 px-12 lg:px-24 xl:px-32 2xl:px-40 w-full">
      <div className="w-full">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ключевые возможности</h2>
          <p className="text-white text-sm max-w-3xl leading-relaxed mx-auto">
            Phantom сочетает гибридное шифрование, децентрализованный P2P-транспорт и модульную архитектуру, чтобы обеспечить долгосрочную безопасность и отказоустойчивость.
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-400">Загрузка...</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-start gap-6">
            {featuresData.map((feature) => (
              <FeatureCard 
                key={feature.id} 
                title={feature.title}
                description={feature.description}
                footerText={feature.icon || "Фича"}
              />
            ))}
          </div>
        )}
      </div>

      {/* Security Guarantees Section */}
      <div className="w-full mt-32 flex flex-col items-center">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Гарантии безопасности</h2>
        </div>
        
        <div className="w-full max-w-4xl space-y-0 mb-8 mx-auto">
          <div className="group flex items-center cursor-default py-4 border-b border-gray-700/50 hover:border-gray-600/50 transition-colors whitespace-nowrap gap-0">
            <span className="text-xl md:text-2xl font-semibold text-[#8B5CF6] transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-purple-400 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] relative">
              Конфиденциальность
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10">Конфиденциальность</span>
            </span>
            <span className="text-gray-400 text-lg md:text-xl mx-2">—</span>
            <span className="text-white text-base md:text-lg">сервер не может расшифровать сообщения</span>
          </div>

          <div className="group flex items-center cursor-default py-4 border-b border-gray-700/50 hover:border-gray-600/50 transition-colors whitespace-nowrap gap-0">
            <span className="text-xl md:text-2xl font-semibold text-[#8B5CF6] transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-purple-400 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] relative">
              Аутентичность
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10">Аутентичность</span>
            </span>
            <span className="text-gray-400 text-lg md:text-xl mx-2">—</span>
            <span className="text-white text-base md:text-lg">dilithium5-подписи защищают ключи и пакеты</span>
          </div>

          <div className="group flex items-center cursor-default py-4 border-b border-gray-700/50 hover:border-gray-600/50 transition-colors whitespace-nowrap gap-0">
            <span className="text-xl md:text-2xl font-semibold text-[#8B5CF6] transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-purple-400 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] relative">
              Forward secrecy
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10">Forward secrecy</span>
            </span>
            <span className="text-gray-400 text-lg md:text-xl mx-2">—</span>
            <span className="text-white text-base md:text-lg">компрометация ключей не раскрывает прошлую историю</span>
          </div>

          <div className="group flex items-center cursor-default py-4 border-b border-gray-700/50 hover:border-gray-600/50 transition-colors whitespace-nowrap gap-0">
            <span className="text-xl md:text-2xl font-semibold text-[#8B5CF6] transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-purple-400 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] relative">
              Future secrecy
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10">Future secrecy</span>
            </span>
            <span className="text-gray-400 text-lg md:text-xl mx-2">—</span>
            <span className="text-white text-base md:text-lg">гибридный Double Ratchet обновляет ключи на лету</span>
          </div>

          <div className="group flex items-center cursor-default py-4 border-b border-gray-700/50 hover:border-gray-600/50 transition-colors whitespace-nowrap gap-0">
            <span className="text-xl md:text-2xl font-semibold text-[#8B5CF6] transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-purple-400 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] relative">
              Защита от Replay-атак
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10">Защита от Replay-атак</span>
            </span>
            <span className="text-gray-400 text-lg md:text-xl mx-2">—</span>
            <span className="text-white text-base md:text-lg">timestamp + случайный nonce в каждом сообщении</span>
          </div>

          <div className="group flex items-center cursor-default py-4 border-b border-gray-700/50 hover:border-gray-600/50 transition-colors whitespace-nowrap gap-0">
            <span className="text-xl md:text-2xl font-semibold text-[#8B5CF6] transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-purple-400 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] relative">
              Локальное шифрование
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10">Локальное шифрование</span>
            </span>
            <span className="text-gray-400 text-lg md:text-xl mx-2">—</span>
            <span className="text-white text-base md:text-lg">keyStore и MessageStore на ChaCha20-Poly1305 + Argon2id</span>
          </div>
        </div>

        <p className="text-gray-400 text-base md:text-lg max-w-3xl leading-relaxed mt-8 text-center">
          Модель угроз Phantom рассчитана на пассивных и активных атакующих, скомпрометированный сервер и будущие квантовые компьютеры.
        </p>
      </div>
    </section>
  );
};

export default Features;
