'use client';

import React from 'react';
import Link from 'next/link';
import { useInquiry } from './InquiryContext';

export default function Footer() {
  const { setIsCookieModalOpen, lang } = useInquiry();

  const handleCookieClick = (e) => {
    e.preventDefault();
    if (setIsCookieModalOpen) {
      setIsCookieModalOpen(true);
    }
  };

  const t = {
    brandDesc: {
      nl: "Hoogwaardige hardhouten zagerij en schaafwerkindustrie die wereldwijd op maat gemaakte, FSC®-gecertificeerde beukenhouten componenten levert.",
      en: "High-quality hardwood lumber sawmill and planing factory delivering customized, FSC® certified beechwood components globally.",
      de: "Hochwertiges Laubholz-Sägewerk und Hobelwerk, das weltweit maßgeschneiderte, FSC®-zertifizierte Buchenholzkomponenten liefert.",
      ro: "Fierăstrău de foioase de înaltă calitate și fabrică de rindeluire care livrează componente din lemn de fag certificate FSC® la nivel global."
    },
    quickLinks: {
      nl: "Snelle Links",
      en: "Quick Links",
      de: "Schnelle Links",
      ro: "Linkuri Rapide"
    },
    home: { nl: "Home", en: "Home", de: "Home", ro: "Home" },
    about: { nl: "Bedrijfsprofiel", en: "Company Profile", de: "Unternehmensprofil", ro: "Profilul Companiei" },
    products: { nl: "Producten", en: "Products", de: "Produkte", ro: "Produsele" },
    timeline: { nl: "Geschiedenis tijdlijn", en: "History Timeline", de: "Geschichte Zeitleiste", ro: "Istoric Timeline" },
    news: { nl: "Nieuws", en: "News", de: "Neuigkeiten", ro: "Știri" },
    careers: { nl: "Vacatures", en: "Careers", de: "Karriere", ro: "Cariere" },
    offerings: {
      nl: "Ons Aanbod",
      en: "Our Offerings",
      de: "Unser Angebot",
      ro: "Oferta Noastră"
    },
    dowels: { nl: "Beukenhouten stokken", en: "Beechwood sticks", de: "Buchenholzstäbe", ro: "Tije din lemn de fag" },
    planed: { nl: "4-Zijdig Geschaafd Hout", en: "4-Sides Planed Timber", de: "4-seitig gehobeltes Holz", ro: "Lemn Rinduit pe 4 Fețe" },
    profiles: { nl: "Houten Profielen & Lijsten", en: "Profiles & Mouldings", de: "Holzprofile & Leisten", ro: "Profile & Plinte din Lemn" },
    specials: { nl: "Speciale Componenten", en: "Special Furniture Elements", de: "Spezielle Möbelkomponenten", ro: "Elemente Speciale de Mobilier" },
    fscBeech: { nl: "FSC® Duurzaam Beuken", en: "FSC® Sustainable Beech", de: "FSC® Nachhaltige Buche", ro: "Fag Sustenabil FSC®" },
    copyright: {
      nl: "© 2026 PALROM Products SRL. Alle rechten voorbehouden. Duurzaam geoogst uit lokale Roemeense bossen.",
      en: "© 2026 PALROM Products SRL. All rights reserved. Sustainably harvested from local Romanian forests.",
      de: "© 2026 PALROM Products SRL. Alle Rechte vorbehalten. Nachhaltig geerntet aus lokalen rumänischen Wäldern.",
      ro: "© 2026 PALROM Products SRL. Toate drepturile rezervate. Recoltat în mod durabil din pădurile locale românești."
    },
    cookiePolicy: {
      nl: "Cookiebeleid",
      en: "Cookie Policy",
      de: "Cookie-Richtlinie",
      ro: "Politica de Cookie-uri"
    }
  };

  const getTranslation = (key) => {
    return t[key]?.[lang] || t[key]?.nl || '';
  };

  return (
    <footer className="main-footer">
      <div className="footer-top container">
        <div className="footer-brand">
          <Link href="/" className="footer-logo-link">
            <img src="/images/logo_white.png" alt="PALROM Products Logo" className="footer-logo-img" />
          </Link>
          <p>{getTranslation('brandDesc')}</p>
          <div className="footer-socials">
            <a href="https://www.facebook.com/profile.php?id=100004110856648" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="#" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>
        </div>
        <div className="footer-links">
          <h3>{getTranslation('quickLinks')}</h3>
          <ul>
            <li><Link href="/">{getTranslation('home')}</Link></li>
            <li><Link href="/about">{getTranslation('about')}</Link></li>
            <li><Link href="/products">{getTranslation('products')}</Link></li>
            <li><Link href="/about#timeline-details">{getTranslation('timeline')}</Link></li>
            <li><Link href="/news">{getTranslation('news')}</Link></li>
            <li><Link href="/careers">{getTranslation('careers')}</Link></li>
          </ul>
        </div>
        <div className="footer-products">
          <h3>{getTranslation('offerings')}</h3>
          <ul>
            <li><Link href="/dowels">{getTranslation('dowels')}</Link></li>
            <li><Link href="/four-sides-planed">{getTranslation('planed')}</Link></li>
            <li><Link href="/profiles">{getTranslation('profiles')}</Link></li>
            <li><Link href="/specials">{getTranslation('specials')}</Link></li>
            <li><Link href="/products">{getTranslation('fscBeech')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-flex">
          <p>{getTranslation('copyright')}</p>
          <div className="footer-meta-links">
            <a href="/palrom_fsc_certificate.pdf" target="_blank" rel="noopener noreferrer">
              {lang === 'nl'
                ? 'FSC® Certificaat (PDF)'
                : (lang === 'de'
                  ? 'FSC®-Zertifikat (PDF)'
                  : (lang === 'ro'
                    ? 'Certificat FSC® (PDF)'
                    : 'FSC® Certificate (PDF)'))}
            </a>
            <span className="divider">|</span>
            <a href="#" onClick={handleCookieClick}>
              {getTranslation('cookiePolicy')}
            </a>
            <span className="divider">|</span>
            <span>Created by Emmer1972</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
