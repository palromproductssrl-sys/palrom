'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { trackTelemetryEvent } from './TelemetryTracker';

const InquiryContext = createContext();

export function InquiryProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [lang, setLang] = useState('nl');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [shouldResetConfigurator, setShouldResetConfigurator] = useState(false);
  const [isRomania, setIsRomania] = useState(false);

  // Detect if visitor is in Romania (or localhost for dev testing)
  useEffect(() => {
    async function checkCountry() {
      try {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          setIsRomania(true);
          return;
        }
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.country_code === 'RO') {
          setIsRomania(true);
        }
      } catch (e) {
        console.error('Failed to detect country', e);
      }
    }
    checkCountry();
  }, []);

  // Load cart and language on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('palrom_quote_cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      
      // Check URL parameters for explicit language overrides (?lang=en)
      let initialLang = null;
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get('lang');
        if (urlLang && ['nl', 'en', 'de', 'ro'].includes(urlLang.toLowerCase())) {
          initialLang = urlLang.toLowerCase();
          localStorage.setItem('palrom_lang', initialLang);
        }
      }

      if (initialLang) {
        setLang(initialLang);
      } else {
        const storedLang = localStorage.getItem('palrom_lang');
        if (storedLang && ['nl', 'en', 'de', 'ro'].includes(storedLang)) {
          setLang(storedLang);
        } else {
          // Fallback to browser language if available
          const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
          if (browserLang.startsWith('de')) {
            setLang('de');
          } else if (browserLang.startsWith('ro')) {
            setLang('ro');
          } else if (browserLang.startsWith('en')) {
            setLang('en');
          } else {
            setLang('nl');
          }
        }
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
    setIsInitialized(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('palrom_quote_cart', JSON.stringify(cartItems));
      localStorage.setItem('palrom_lang', lang);
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }, [cartItems, lang, isInitialized]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const exists = prev.find((x) => x.id === item.id);
      if (exists) {
        return prev.map((x) => (x.id === item.id ? { ...x, qty: x.qty + 1 } : x));
      }
      return [...prev, item];
    });

    // Track configurator event in telemetry database
    try {
      trackTelemetryEvent('added_to_cart', {
        category: item.category || null,
        subCategory: item.subCategory || null,
        dimensions: {
          thickness: item.thickness || null,
          width: item.width || item.diameter || null,
          length: item.length || null,
          radius: item.radius || null
        },
        grade: item.grade || null,
        drying: item.drying || null,
        quantity: item.qty || 1
      });
    } catch (e) {
      console.warn('Failed to log add to cart telemetry:', e);
    }
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCartItem = (index, updatedItem) => {
    setCartItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updatedItem } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.length;

  return (
    <InquiryContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        cartCount,
        isInitialized,
        isCartOpen,
        setIsCartOpen,
        isCookieModalOpen,
        setIsCookieModalOpen,
        lang,
        setLang,
        shouldResetConfigurator,
        setShouldResetConfigurator,
        isRomania,
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  return useContext(InquiryContext);
}
