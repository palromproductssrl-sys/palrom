'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function FloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`floating-contact-widget ${isOpen ? 'active' : ''}`} ref={widgetRef} id="floatingContact">
      <div className="widget-menu">
        <a href="https://wa.me/40254606053" target="_blank" rel="noopener noreferrer" className="widget-item whatsapp-item" aria-label="Chat on WhatsApp" onClick={() => setIsOpen(false)}>
          <span className="widget-tooltip">WhatsApp</span>
          <i className="fa-brands fa-whatsapp"></i>
        </a>
        <a href="tel:+40254606053" className="widget-item phone-item" aria-label="Call Us" onClick={() => setIsOpen(false)}>
          <span className="widget-tooltip">Call Us</span>
          <i className="fa-solid fa-phone"></i>
        </a>
        <a href="mailto:office@palromproducts.ro" className="widget-item email-item" aria-label="Send an Email" onClick={() => setIsOpen(false)}>
          <span className="widget-tooltip">Email Us</span>
          <i className="fa-solid fa-envelope"></i>
        </a>
        <a href="#contact" className="widget-item form-item" aria-label="Go to Contact Form" onClick={() => setIsOpen(false)}>
          <span className="widget-tooltip">Contact Form</span>
          <i className="fa-solid fa-file-signature"></i>
        </a>
      </div>
      <button className="widget-toggle-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Contact Menu">
        <i className={`fa-solid fa-comments toggle-icon-open ${isOpen ? 'hidden' : ''}`}></i>
        <i className={`fa-solid fa-xmark toggle-icon-close ${isOpen ? '' : 'hidden'}`}></i>
      </button>
    </div>
  );
}
