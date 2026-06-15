'use client';

import React, { useEffect } from 'react';
import { useInquiry } from './InquiryContext';

export default function CookieConsent() {
  const { isCookieModalOpen, setIsCookieModalOpen } = useInquiry();

  useEffect(() => {
    // Show after 1.5 seconds if not accepted or denied before
    const accepted = localStorage.getItem('palrom_cookies_accepted');
    if (accepted === null) {
      const timer = setTimeout(() => {
        setIsCookieModalOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [setIsCookieModalOpen]);

  const handleAllow = () => {
    localStorage.setItem('palrom_cookies_accepted', 'true');
    setIsCookieModalOpen(false);
  };

  const handleDeny = () => {
    localStorage.setItem('palrom_cookies_accepted', 'false');
    setIsCookieModalOpen(false);
  };

  if (!isCookieModalOpen) return null;

  return (
    <div className="cookie-modal">
      <div className="cookie-content">
        <div className="cookie-header">
          <i className="fa-solid fa-cookie-bite cookie-icon"></i>
          <h3>This website uses cookies</h3>
        </div>
        <p>We use cookies to personalise content, provide social media features, and analyze our traffic. By clicking "Allow all", you agree to our cookie policy.</p>
        <div className="cookie-buttons">
          <button onClick={handleDeny} className="btn btn-outlined">Deny</button>
          <button onClick={handleAllow} className="btn btn-primary">Allow All</button>
        </div>
      </div>
    </div>
  );
}
