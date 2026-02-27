import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <UIContext.Provider value={{ isCartOpen, openCart, closeCart }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);

