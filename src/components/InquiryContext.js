'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const InquiryContext = createContext();

export function InquiryProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

  // Load cart on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('palrom_quote_cart');
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load quote cart', e);
    }
    setIsInitialized(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('palrom_quote_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save quote cart', e);
    }
  }, [cartItems, isInitialized]);

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
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  return useContext(InquiryContext);
}
