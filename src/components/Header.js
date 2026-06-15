'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useInquiry } from './InquiryContext';

export default function Header() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useInquiry();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isProductsActive = ['/products', '/dowels', '/four-sides-planed', '/profiles', '/specials'].some(
    (path) => pathname === path
  );
  
  const isCareersActive = ['/careers', '/apply'].some(
    (path) => pathname === path
  );

  return (
    <header className="main-header scrolled">
      <div className="header-container">
        <Link href="/" className="logo">
          <img src="/images/logo.png" alt="PALROM Products Logo" className="header-logo-img" />
        </Link>
        <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            Company Profile
          </Link>
          <Link href="/products" className={`nav-link ${isProductsActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            Our Products
          </Link>
          <Link href="/careers" className={`nav-link ${isCareersActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            Careers
          </Link>
          <Link href="/news" className={`nav-link ${pathname === '/news' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            News
          </Link>
          <Link href="#contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            Contact Us
          </Link>
        </nav>
        <div className="header-actions">
          <button className="cart-toggle-btn" onClick={() => setIsCartOpen(true)} aria-label="View Inquiry Cart">
            <i className="fa-solid fa-clipboard-list"></i>
            <span className="cart-count-badge">{cartCount}</span>
          </button>
          <Link href="#contact" className="action-btn">
            Request Quote
          </Link>
          <button 
            className={`mobile-nav-toggle ${isMobileMenuOpen ? 'active' : ''}`} 
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
