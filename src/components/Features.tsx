'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const FeatureCard = ({ title, description, footerText }: { title: string, description: string, footerText: string }) => {
  return (
    <div className="group relative bg-[#13111A] border border-white/10 hover:border-purple-500/50 p-6 sm:p-8 rounded-2xl transition-all duration-300 flex flex-col min-h-[280px] sm:min-h-[320px] overflow-hidden hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:-translate-y-1 w-full max-w-sm">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity"></div>

      <div className="relative z-10 flex flex-col flex-grow">
        <h3 className="text-xl sm:text-2xl font-bold text-[#8B5CF6] mb-4 sm:mb-6 leading-tight whitespace-pre-line">{title.replace(/\\n/g, '\n')}</h3>
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-auto flex-grow">{description}</p>
      </div>

      <div className="relative z-10 flex items-center gap-2 mt-8">
        <span className="text-gray-500 text-xs">{footerText}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
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
  const { t, language } = useLanguage();
  const [featuresData, setFeaturesData] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);


  // Fallback features using translations
  const fallbackFeatures: Feature[] = [
    {
      id: '1',
      title: t.features.feature1Title,
      description: t.features.feature1Desc,
      order: 0,
      language: 'ru'
    },
    {
      id: '2',
      title: t.features.feature2Title,
      description: t.features.feature2Desc,
      order: 1,
      language: 'ru'
    },
    {
      id: '3',
      title: t.features.feature3Title,
      description: t.features.feature3Desc,
      order: 2,
      language: 'ru'
    }
  ];

  useEffect(() => {

    fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1'}/public/features?lang=${language}`)
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) {
          // Sort by order
          const sortedFeatures = data.data.sort((a: Feature, b: Feature) => a.order - b.order);
          setFeaturesData(sortedFeatures);
        } else {
          // Fallback to default features with translations
          setFeaturesData(fallbackFeatures);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to default features on error with translations
        setFeaturesData(fallbackFeatures);
        setLoading(false);
      });
  }, [language, fallbackFeatures]);

  return (
    <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-8 md:px-12 lg:px-24 xl:px-32 2xl:px-40 w-full">
      <div className="w-full">
        <div className="mb-16 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">{t.features.title}</h2>
          <p className="text-white text-xs sm:text-sm md:text-base max-w-3xl leading-relaxed mx-auto">
            {t.features.subtitle}
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-400">{t.features.loading}</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-start gap-6">
            {featuresData.map((feature) => (
              <FeatureCard
                key={feature.id}
                title={feature.title}
                description={feature.description}
                footerText={feature.icon || t.features.footer}
              />
            ))}
          </div>
        )}
      </div>

      {/* Security Guarantees Section */}
      <div className="w-full mt-32 flex flex-col items-center">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">{t.features.securityTitle}</h2>
        </div>

        <div className="w-full max-w-4xl space-y-0 mb-8 mx-auto">
          <div className="group flex items-center cursor-default py-4 border-b border-gray-700/50 hover:border-gray-600/50 transition-colors whitespace-nowrap gap-0">
            <span className="text-xl md:text-2xl font-semibold text-[#8B5CF6] transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-purple-400 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] relative">
              {t.features.securityConfidentiality}
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10">{t.features.securityConfidentiality}</span>
            </span>
            <span className="text-gray-400 text-lg md:text-xl mx-2">—</span>
            <span className="text-white text-base md:text-lg">{t.features.securityConfidentialityDesc}</span>
          </div>

          <div className="group flex items-center cursor-default py-4 border-b border-gray-700/50 hover:border-gray-600/50 transition-colors whitespace-nowrap gap-0">
            <span className="text-xl md:text-2xl font-semibold text-[#8B5CF6] transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-purple-400 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] relative">
              {t.features.securityAuthenticity}
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10">{t.features.securityAuthenticity}</span>
            </span>
            <span className="text-gray-400 text-lg md:text-xl mx-2">—</span>
            <span className="text-white text-base md:text-lg">{t.features.securityAuthenticityDesc}</span>
          </div>

          <div className="group flex items-center cursor-default py-4 border-b border-gray-700/50 hover:border-gray-600/50 transition-colors whitespace-nowrap gap-0">
            <span className="text-xl md:text-2xl font-semibold text-[#8B5CF6] transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-purple-400 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] relative">
              {t.features.securityForwardSecrecy}
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10">{t.features.securityForwardSecrecy}</span>
            </span>
            <span className="text-gray-400 text-lg md:text-xl mx-2">—</span>
            <span className="text-white text-base md:text-lg">{t.features.securityForwardSecrecyDesc}</span>
          </div>

          <div className="group flex items-center cursor-default py-4 border-b border-gray-700/50 hover:border-gray-600/50 transition-colors whitespace-nowrap gap-0">
            <span className="text-xl md:text-2xl font-semibold text-[#8B5CF6] transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-purple-400 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] relative">
              {t.features.securityFutureSecrecy}
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10">{t.features.securityFutureSecrecy}</span>
            </span>
            <span className="text-gray-400 text-lg md:text-xl mx-2">—</span>
            <span className="text-white text-base md:text-lg">{t.features.securityFutureSecrecyDesc}</span>
          </div>

          <div className="group flex items-center cursor-default py-4 border-b border-gray-700/50 hover:border-gray-600/50 transition-colors whitespace-nowrap gap-0">
            <span className="text-xl md:text-2xl font-semibold text-[#8B5CF6] transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-purple-400 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] relative">
              {t.features.securityReplayProtection}
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10">{t.features.securityReplayProtection}</span>
            </span>
            <span className="text-gray-400 text-lg md:text-xl mx-2">—</span>
            <span className="text-white text-base md:text-lg">{t.features.securityReplayProtectionDesc}</span>
          </div>

          <div className="group flex items-center cursor-default py-4 border-b border-gray-700/50 hover:border-gray-600/50 transition-colors whitespace-nowrap gap-0">
            <span className="text-xl md:text-2xl font-semibold text-[#8B5CF6] transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-purple-400 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] relative">
              {t.features.securityLocalEncryption}
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10">{t.features.securityLocalEncryption}</span>
            </span>
            <span className="text-gray-400 text-lg md:text-xl mx-2">—</span>
            <span className="text-white text-base md:text-lg">{t.features.securityLocalEncryptionDesc}</span>
          </div>
        </div>

        <p className="text-gray-400 text-base md:text-lg max-w-3xl leading-relaxed mt-8 text-center">
          {t.features.securityFooter}
        </p>
      </div>
    </section>
  );
};

export default Features;
