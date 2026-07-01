'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useInquiry } from './InquiryContext';

export default function Footer() {
  const { setIsCookieModalOpen, lang, isRomania } = useInquiry();
  const router = useRouter();

  const handleCookieClick = (e) => {
    e.preventDefault();
    if (setIsCookieModalOpen) {
      setIsCookieModalOpen(true);
    }
  };

  const t = {
    brandDesc: {
      nl: "Palrom Products is een hoogwaardige hardhoutzagerij en schaafbedrijf dat wereldwijd maatwerk levert in FSC®-gecertificeerde beukenhouten componenten, stokken, latten en profielen.",
      en: "Palrom Products is a high-quality hardwood sawmill and planing company delivering globally customized, FSC®-certified beechwood components, sticks, slats, and profiles.",
      de: "Palrom Products ist ein hochwertiges Laubholz-Sägewerk und Hobelwerk, das weltweit maßgeschneiderte, FSC®-zertifizierte Buchenholzkomponenten, Stäbe, Leisten und Profile liefert.",
      ro: "Palrom Products este un gater și o fabrică de rindeluire de înaltă calitate, care oferă la nivel global piese personalizate din lemn de fag certificate FSC®, tije, șipci și profile."
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
    planed: { nl: "Beukenhouten latten", en: "Beechwood slats", de: "Buchenholzleisten", ro: "Șipci din lemn de fag" },
    profiles: { nl: "Beukenhouten profielen", en: "Beechwood profiles", de: "Buchenholzprofile", ro: "Profile din lemn de fag" },
    specials: { nl: "Beukenhouten bestekken", en: "Beechwood specials", de: "Buchenholz-Zuschnitte", ro: "Piese brute din lemn de fag" },
    blanks: { nl: "Beukenhouten blanks", en: "Beechwood blanks", de: "Buchenholz-Blanks", ro: "Piese brute din lemn de fag (blanks)" },
    fscBeech: { nl: "FSC® Duurzaam Beuken", en: "FSC® Sustainable Beech", de: "FSC® Sustainable Beech", ro: "Fag Sustenabil FSC®" },
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
            <Image 
              src="/images/logo_white.png" 
              alt="PALROM Products Logo" 
              className="footer-logo-img" 
              width={198}
              height={64}
            />
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
            <li><Link href="/blanks">{getTranslation('blanks')}</Link></li>
            <li><Link href="/four-sides-planed">{getTranslation('planed')}</Link></li>
            <li><Link href="/rods">{getTranslation('dowels')}</Link></li>
            <li><Link href="/profiles">{getTranslation('profiles')}</Link></li>
            <li><Link href="/specials">{getTranslation('specials')}</Link></li>
            <li><Link href="/products">{getTranslation('fscBeech')}</Link></li>
            {isRomania && (
              <li><Link href="/brichete-fag">{lang === 'ro' ? 'Brichete fag (Exclusiv RO)' : (lang === 'nl' ? 'Houtbriketten (Exclusief RO)' : (lang === 'de' ? 'Holzbriketts (Exklusiv RO)' : 'Beech briquettes (RO Exclusive)'))}</Link></li>
            )}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-flex">
          <p>{getTranslation('copyright')}</p>
          <div className="footer-meta-links">
            <span className="version-tag">v5.10.3</span>
            <span className="divider">|</span>
            <a href="#" onClick={handleCookieClick}>
              {getTranslation('cookiePolicy')}
            </a>
            <span className="divider">|</span>
            <span 
              onDoubleClick={() => router.push('/configurator')} 
              style={{ cursor: 'pointer', userSelect: 'none' }}
              title="Dubbelklik voor configurator"
            >
              Created by Emmer1972
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
