'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useInquiry } from './InquiryContext';

export default function Footer() {
  const pathname = usePathname();
  const { setIsCookieModalOpen } = useInquiry();

  const isNl = pathname === '/' || pathname === '/configurator';

  const handleCookieClick = (e) => {
    e.preventDefault();
    if (setIsCookieModalOpen) {
      setIsCookieModalOpen(true);
    }
  };

  return (
    <footer className="main-footer">
      <div className="footer-top container">
        <div className="footer-brand">
          <Link href="/" className="footer-logo-link">
            <img src="/images/logo_white.png" alt="PALROM Products Logo" className="footer-logo-img" />
          </Link>
          <p>
            {isNl
              ? "Hoogwaardige hardhouten zagerij en schaafwerkindustrie die wereldwijd op maat gemaakte, FSC®-gecertificeerde beukenhouten componenten levert."
              : "High-quality hardwood lumber sawmill and planing factory delivering customized, FSC® certified beechwood components globally."}
          </p>
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
          <h3>{isNl ? "Snelle Links" : "Quick Links"}</h3>
          <ul>
            <li><Link href="/">{isNl ? "Home" : "Home"}</Link></li>
            <li><Link href="/about">{isNl ? "Bedrijfsprofiel" : "Company Profile"}</Link></li>
            <li><Link href="/products">{isNl ? "Onze Producten" : "Our Products"}</Link></li>
            <li><Link href="/about#timeline-details">{isNl ? "Geschiedenis tijdlijn" : "History Timeline"}</Link></li>
            <li><Link href="/news">{isNl ? "Nieuws" : "News"}</Link></li>
            <li><Link href="/careers">{isNl ? "Vacatures" : "Careers"}</Link></li>
          </ul>
        </div>
        <div className="footer-products">
          <h3>{isNl ? "Ons Aanbod" : "Our Offerings"}</h3>
          <ul>
            <li><Link href="/dowels">{isNl ? "Beukenhouten Dowels" : "Beechwood Dowels"}</Link></li>
            <li><Link href="/four-sides-planed">{isNl ? "4-Zijdig Geschaafd Hout" : "4-Sides Planed Timber"}</Link></li>
            <li><Link href="/profiles">{isNl ? "Houten Profielen & Lijsten" : "Profiles & Mouldings"}</Link></li>
            <li><Link href="/specials">{isNl ? "Speciale Componenten" : "Special Furniture Elements"}</Link></li>
            <li><Link href="/products">{isNl ? "FSC® Duurzaam Beuken" : "FSC® Sustainable Beech"}</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-flex">
          <p>
            {isNl
              ? "© 2026 PALROM Products SRL. Alle rechten voorbehouden. Duurzaam geoogst uit lokale Roemeense bossen."
              : "© 2026 PALROM Products SRL. All rights reserved. Sustainably harvested from local Romanian forests."}
          </p>
          <div className="footer-meta-links">
            <a href="#" onClick={handleCookieClick}>
              {isNl ? "Cookiebeleid" : "Cookie Policy"}
            </a>
            <span className="divider">|</span>
            <span>Created by Emmer1972</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
