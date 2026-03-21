'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface FooterLink {
  id: string;
  title: string;
  href: string;
  category: string;
  order: number;
}

const Footer = () => {
  const { t, language } = useLanguage();
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1'}/public/footer-links`)
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) {
          setFooterLinks(data.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [t]);

  // Group links by category
  const linksByCategory = footerLinks.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, FooterLink[]>);

  // Fallback links if API fails or returns empty - using translations
  const fallbackLinks = {
    menu: [
      { id: '1', title: t.footer.links.install, href: '/install', category: 'menu', order: 0 },
      { id: '2', title: t.footer.links.forum, href: '/forum', category: 'menu', order: 1 },
      { id: '3', title: t.footer.links.documentation, href: '/docs', category: 'menu', order: 2 },
      { id: '4', title: t.footer.links.donate, href: '/donate', category: 'menu', order: 3 }
    ],
    information: [
      { id: '5', title: t.footer.links.terms, href: '/pages?slug=terms', category: 'information', order: 0 },
      { id: '6', title: t.footer.links.privacy, href: '/pages?slug=privacy', category: 'information', order: 1 },
      { id: '7', title: t.footer.links.security, href: '/pages?slug=security', category: 'information', order: 2 }
    ],
    social: [
      { id: '8', title: 'github', href: '#', category: 'social', order: 0 },
      { id: '9', title: 'linkedin', href: '#', category: 'social', order: 1 }
    ],
    contact: [
      { id: '10', title: 'hello@phantom.com', href: 'mailto:hello@phantom.com', category: 'contact', order: 0 },
      { id: '11', title: '@pnm', href: '#', category: 'contact', order: 1 }
    ]
  };

  const displayLinks = loading || Object.keys(linksByCategory).length === 0 ? fallbackLinks : {
    menu: linksByCategory['menu'] || fallbackLinks.menu,
    information: linksByCategory['information'] || linksByCategory['legal'] || fallbackLinks.information,
    social: linksByCategory['social'] || fallbackLinks.social,
    contact: linksByCategory['contact'] || fallbackLinks.contact
  };
  return (
    <footer className="w-full px-4 sm:px-6 md:px-8 py-12 sm:py-16 bg-[#050505] relative z-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12 sm:mb-20">

          {/* Column 1 */}
          <div>
            <h4 className="text-gray-500 text-[10px] sm:text-xs uppercase font-medium mb-4 sm:mb-6">{t.footer.menu}</h4>
            <ul className="space-y-3 sm:space-y-4">
              {displayLinks.menu.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-gray-500 text-[10px] sm:text-xs uppercase font-medium mb-4 sm:mb-6">{t.footer.information}</h4>
            <ul className="space-y-3 sm:space-y-4">
              {displayLinks.information.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="text-gray-300 text-sm hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-gray-500 text-xs uppercase font-medium mb-6">{t.footer.social}</h4>
            <ul className="space-y-4">
              {displayLinks.social.map((link) => (
                <li key={link.id}>
                  <a href={link.href} className="text-gray-300 text-sm hover:text-white transition-colors">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-gray-500 text-xs uppercase font-medium mb-6">{t.footer.contact}</h4>
            <ul className="space-y-4">
              {displayLinks.contact.map((link) => (
                <li key={link.id}>
                  <a href={link.href} className="text-gray-300 text-sm hover:text-white transition-colors">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-8">
          <div className="text-gray-500 text-xs mb-4 md:mb-0">
            {t.footer.copyright.replace('{year}', new Date().getFullYear().toString())}
          </div>

          {/* Language Selector Selector */}
          <button className="flex items-center gap-2 text-gray-300 text-xs hover:text-white transition-colors">
            {language === 'ru' ? 'Русский' : 'English'}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
