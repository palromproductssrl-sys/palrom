'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useInquiry } from './InquiryContext';

export default function Header() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, lang, setLang } = useInquiry();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isProductsActive = ['/products', '/rods', '/four-sides-planed', '/profiles', '/specials', '/brichete-fag'].some(
    (path) => pathname === path
  );
  
  const isCareersActive = ['/careers', '/apply'].some(
    (path) => pathname === path
  );

  const t = {
    home: { nl: 'Home', en: 'Home', de: 'Home', ro: 'Home' },
    about: { nl: 'Bedrijfsprofiel', en: 'Company Profile', de: 'Unternehmensprofil', ro: 'Profilul Companiei' },
    products: { nl: 'Producten', en: 'Products', de: 'Produkte', ro: 'Produsele' },
    careers: { nl: 'Vacatures', en: 'Careers', de: 'Karriere', ro: 'Cariere' },
    news: { nl: 'Nieuws', en: 'News', de: 'Neuigkeiten', ro: 'Știri' },
    contact: { nl: 'Contact', en: 'Contact Us', de: 'Kontakt', ro: 'Contact' },
    requestQuote: { nl: 'Offerte Aanvragen', en: 'Request Quote', de: 'Angebot anfordern', ro: 'Solicită Ofertă' }
  };

  const getTranslation = (key) => {
    return t[key]?.[lang] || t[key]?.nl || '';
  };

  return (
    <header className="main-header scrolled">
      <div className="header-container">
        <Link href="/" className="logo">
          <img src="/images/logo.png" alt="PALROM Products Logo" className="header-logo-img" />
        </Link>
        <nav className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            {getTranslation('home')}
          </Link>
          <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            {getTranslation('about')}
          </Link>
          <Link href="/products" className={`nav-link ${isProductsActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            {getTranslation('products')}
          </Link>
          {lang === 'ro' && (
            <Link href="/brichete-fag" className={`nav-link ${pathname === '/brichete-fag' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              Brichete Fag
            </Link>
          )}
          <Link href="/careers" className={`nav-link ${isCareersActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            {getTranslation('careers')}
          </Link>
          <Link href="/news" className={`nav-link ${pathname === '/news' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            {getTranslation('news')}
          </Link>
          <Link href="#contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            {getTranslation('contact')}
          </Link>
        </nav>
        <div className="header-actions">
          {pathname === '/configurator' && (
            <button className="cart-toggle-btn" onClick={() => setIsCartOpen(true)} aria-label="View Inquiry Cart">
              <i className="fa-solid fa-clipboard-list"></i>
              <span className={`cart-count-badge ${cartCount > 0 ? 'visible' : ''}`}>{cartCount}</span>
            </button>
          )}
          <Link href="#contact" className="action-btn">
            {getTranslation('requestQuote')}
          </Link>
          <div className="language-switcher-vertical">
            {pathname === '/brichete-fag' ? (
              <button 
                className="lang-btn active" 
                disabled 
                aria-label="Română"
                style={{ cursor: 'not-allowed', opacity: 0.8 }}
              >
                RO
              </button>
            ) : (
              <>
                <button 
                  className={`lang-btn ${lang === 'nl' ? 'active' : ''}`} 
                  onClick={() => setLang('nl')}
                  aria-label="Nederlands"
                >
                  NL
                </button>
                <button 
                  className={`lang-btn ${lang === 'en' ? 'active' : ''}`} 
                  onClick={() => setLang('en')}
                  aria-label="English"
                >
                  EN
                </button>
                <button 
                  className={`lang-btn ${lang === 'de' ? 'active' : ''}`} 
                  onClick={() => setLang('de')}
                  aria-label="Deutsch"
                >
                  DE
                </button>
                <button 
                  className={`lang-btn ${lang === 'ro' ? 'active' : ''}`} 
                  onClick={() => setLang('ro')}
                  aria-label="Română"
                >
                  RO
                </button>
              </>
            )}
          </div>
          <button 
            className={`mobile-nav-toggle ${isMobileMenuOpen ? 'open' : ''}`} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
