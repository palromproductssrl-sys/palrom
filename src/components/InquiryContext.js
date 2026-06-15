'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const InquiryContext = createContext();

export function InquiryProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [lang, setLang] = useState('nl');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

  // Load cart and language on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('palrom_quote_cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
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
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  return useContext(InquiryContext);
}
