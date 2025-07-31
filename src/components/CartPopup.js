import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../pages/CartContext';
import { FaCheck, FaTimes } from 'react-icons/fa';
import './CartPopup.css';

const CartPopup = () => {
  const { showCartPopup, lastAddedItem, closeCartPopup, cartCount } = useCart();
  const navigate = useNavigate();

  if (!showCartPopup || !lastAddedItem) {
    return null;
  }

  const handleViewCart = () => {
    closeCartPopup();
    navigate('/cart');
  };

  return (
    <div className="cart-popup-overlay">
      <div className="cart-popup">
        <div className="cart-popup-header">
          <div className="success-icon">
            <FaCheck />
          </div>
          <h3>Item Added to Cart!</h3>
          <button className="close-popup" onClick={closeCartPopup}>
            <FaTimes />
          </button>
        </div>
        
        <div className="cart-popup-content">
          <div className="added-item">
            <img src={lastAddedItem.image} alt={lastAddedItem.title} />
            <div className="item-details">
              <h4>{lastAddedItem.title}</h4>
              <p className="item-price">₹{lastAddedItem.price}</p>
            </div>
          </div>
          
          <div className="cart-summary">
            <p>Total items in cart: <strong>{cartCount}</strong></p>
          </div>
        </div>
        
        <div className="cart-popup-actions">
          <button className="continue-shopping" onClick={closeCartPopup}>
            Continue Shopping
          </button>
          <button className="view-cart" onClick={handleViewCart}>
            View Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPopup; 