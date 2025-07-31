// src/pages/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

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
  const { user, isAuthenticated } = useAuth();

  // Calculate total items in cart
  const cartCount = cartItems.length;

  // Fetch cart from backend when user logs in
  useEffect(() => {
    if (isAuthenticated() && user) {
      fetchCartFromBackend();
    } else {
      // Clear cart when user logs out
      setCartItems([]);
    }
  }, [user]);

  // Fetch cart from backend
  const fetchCartFromBackend = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.cart) {
          setCartItems(data.cart);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Sync cart to backend
  const syncCartToBackend = async (newCartItems) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !isAuthenticated()) return;

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems: newCartItems }),
      });

      if (!response.ok) {
        console.error('Error syncing cart to backend');
      }
    } catch (error) {
      console.error('Error syncing cart to backend:', error);
    }
  };

  // Add to Cart with popup and backend sync
  const addToCart = (item) => {
    const newCartItems = [...cartItems, item];
    setCartItems(newCartItems);
    setLastAddedItem(item);
    setShowCartPopup(true);
    
    // Sync to backend
    syncCartToBackend(newCartItems);
    
    // Hide popup after 3 seconds
    setTimeout(() => {
      setShowCartPopup(false);
      setLastAddedItem(null);
    }, 3000);
  };

  // Remove all instances of an item
  const removeFromCart = (id) => {
    const newCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(newCartItems);
    syncCartToBackend(newCartItems);
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    syncCartToBackend([]);
  };

  // Remove only one quantity of the item
  const decreaseQty = (id) => {
    const index = cartItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      const updated = [...cartItems];
      updated.splice(index, 1); // remove only one item with that id
      setCartItems(updated);
      syncCartToBackend(updated);
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
