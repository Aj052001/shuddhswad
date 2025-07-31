// src/pages/CartContext.js
import React, { createContext, useState, useContext } from 'react';

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);

  // Calculate total items in cart
  const cartCount = cartItems.length;

  // Add to Cart with popup
  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
    setLastAddedItem(item);
    setShowCartPopup(true);
    
    // Hide popup after 3 seconds
    setTimeout(() => {
      setShowCartPopup(false);
      setLastAddedItem(null);
    }, 3000);
  };

  // Remove all instances of an item
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Remove only one quantity of the item
  const decreaseQty = (id) => {
    const index = cartItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      const updated = [...cartItems];
      updated.splice(index, 1); // remove only one item with that id
      setCartItems(updated);
    }
  };

  // Get merged items with quantities
  const getMergedItems = () => {
    return cartItems.reduce((acc, item) => {
      const existing = acc.find(i => i.id === item.id);
      if (existing) {
        existing.qty += 1;
      } else {
        acc.push({ ...item, qty: 1 });
      }
      return acc;
    }, []);
  };

  // Calculate total price
  const getTotalPrice = () => {
    const mergedItems = getMergedItems();
    return mergedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  // Close cart popup
  const closeCartPopup = () => {
    setShowCartPopup(false);
    setLastAddedItem(null);
  };

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        cartCount,
        showCartPopup,
        lastAddedItem,
        addToCart, 
        removeFromCart, 
        clearCart, 
        decreaseQty,
        getMergedItems,
        getTotalPrice,
        closeCartPopup
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
