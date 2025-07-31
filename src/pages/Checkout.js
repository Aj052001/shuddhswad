import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const { getMergedItems, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const cartItems = getMergedItems();
  const totalAmount = getTotalPrice();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    // Pre-fill user details
    if (user) {
      setOrderDetails(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [isAuthenticated, user, cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    // Validate form
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    const missingFields = requiredFields.filter(field => !orderDetails[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        alert('Razorpay SDK failed to load');
        setLoading(false);
        return;
      }

      // Create order on backend
      const token = localStorage.getItem('token');
      const orderResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'INR',
          receipt: `order_${Date.now()}`
        })
      });

      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Initialize Razorpay payment
      const options = {
        key: 'rzp_test_hTYuWONQ8RCtIq',
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Your Store Name',
        description: `Order for ${cartItems.length} items`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              alert('Payment successful! Your order has been placed.');
              clearCart();
              navigate('/orders');
            } else {
              alert('Payment verification failed. Please try again.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: orderDetails.name,
          email: orderDetails.email,
          contact: orderDetails.phone
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <h2>Checkout</h2>
        <p>Your cart is empty. Please add items to proceed.</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      
      <div className="checkout-content">
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.qty}</p>
                  <p>₹{item.price * item.qty}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="total">
            <h3>Total: ₹{totalAmount}</h3>
          </div>
        </div>

        <div className="shipping-details">
          <h3>Shipping Details</h3>
          <form>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={orderDetails.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={orderDetails.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={orderDetails.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Address *</label>
              <textarea
                name="address"
                value={orderDetails.address}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={orderDetails.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={orderDetails.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={orderDetails.pincode}
                onChange={handleInputChange}
                required
              />
            </div>
          </form>
        </div>
      </div>

      <div className="checkout-actions">
        <button 
          className="pay-button" 
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
        </button>
      </div>
    </div>
  );
};

export default Checkout; 