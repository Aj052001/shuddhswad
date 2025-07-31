import React, { useState } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import { FaTimes, FaMoneyBillWave, FaCreditCard, FaUniversity } from 'react-icons/fa';
import { SiRazorpay } from 'react-icons/si';

const RAZORPAY_KEY_ID = 'rzp_test_hTYuWONQ8RCtIq'; // Replace with your Razorpay Test Key ID
const BACKEND_URL = 'https://e6d4290ba137.ngrok-free.app';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const PaymentOptionsModal = ({ open, onClose, onSelect, total }) => {
  if (!open) return null;
  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal enhanced-modal">
        <div className="modal-header">
          <h3>Choose Payment Method</h3>
          <button className="close-modal-btn" onClick={onClose}><FaTimes /></button>
        </div>
        <div className="modal-total">Total: <span>₹{total}</span></div>
        <div className="payment-options-list">
          <button className="payment-option enhanced" onClick={() => onSelect('upi')}>
            <span className="option-icon upi"><FaUniversity /></span>
            <span>Pay via UPI</span>
          </button>
          <button className="payment-option enhanced" onClick={() => onSelect('razorpay')}>
            <span className="option-icon razorpay"><SiRazorpay /></span>
            <span>Pay via Razorpay (Card/Netbanking/Wallet)</span>
          </button>
          <button className="payment-option enhanced" onClick={() => onSelect('cod')}>
            <span className="option-icon cod"><FaMoneyBillWave /></span>
            <span>Cash on Delivery</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const navigate = useNavigate();
  const { 
    getMergedItems, 
    getTotalPrice, 
    removeFromCart, 
    clearCart, 
    decreaseQty,
    addToCart 
  } = useCart();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const mergedItems = getMergedItems();
  const total = getTotalPrice();

  const handleBuyNow = () => {
    navigate('/checkout');
  };

  const handlePaymentSelect = async (method) => {
    setShowPaymentModal(false);
    if (method === 'upi' || method === 'razorpay') {
      // 1. Create order on backend
      let order_id = null;
      try {
        const res = await fetch(`${BACKEND_URL}/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total * 100 }), // amount in paise
        });
        const data = await res.json();
        order_id = data.order_id;
      } catch (err) {
        alert('Failed to create order. Please try again.');
        return;
      }
      if (!order_id) {
        alert('Failed to create order. Please try again.');
        return;
      }
      // 2. Load Razorpay script
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        alert('Razorpay SDK failed to load.');
        return;
      }
      // 3. Open Razorpay checkout with order_id
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: 'INR',
        name: 'Shuddh Swad',
        description: 'Order Payment',
        image: '/images/logo.jpeg',
        order_id: order_id, // <-- Use backend order_id here!
        handler: function (response) {
          alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
          clearCart();
        },
        prefill: { name: '', email: '', contact: '' },
        notes: { address: 'Shuddh Swad Customer' },
        theme: { color: '#9e1030' },
      };
      if (method === 'upi') {
        options.method = { upi: true, card: false, netbanking: false, wallet: false };
      }
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else if (method === 'cod') {
      alert('Order placed with Cash on Delivery!');
      clearCart();
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-heading">Your Cart</h2>
      <PaymentOptionsModal 
        open={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        onSelect={handlePaymentSelect}
        total={total}
      />
      {mergedItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <p>Add some delicious items to get started!</p>
        </div>
      ) : (
        <div>
          {mergedItems.map((item, index) => (
            <div className="cart-item" key={index}>
              <div className="item-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="item-info">
                <h4>{item.title}</h4>
                <p className="item-price">₹{item.price}</p>
              </div>

              <div className="quantity-controls">
                <button 
                  onClick={() => decreaseQty(item.id)}
                  className="qty-btn"
                  disabled={item.qty === 1}
                >
                  -
                </button>
                <span className="qty-display">{item.qty}</span>
                <button 
                  onClick={() => addToCart(item)}
                  className="qty-btn"
                >
                  +
                </button>
              </div>

              <div className="item-total">
                <p>₹{item.price * item.qty}</p>
              </div>

              <button 
                className="remove-btn" 
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="total-section">
            <div className="total-info">
              <span className="total-label">Total Items: {mergedItems.length}</span>
              <span className="total-price">Estimated total: ₹{total}</span>
            </div>
            <div className="cart-actions">
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Cart
              </button>
              <button className="buy-button" onClick={handleBuyNow}>
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
