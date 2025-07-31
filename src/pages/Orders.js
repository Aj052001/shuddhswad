import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Order.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#28a745';
      case 'processing':
        return '#ffc107';
      case 'shipped':
        return '#17a2b8';
      case 'delivered':
        return '#28a745';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="orders-container">
        <h2>My Orders</h2>
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <h2>My Orders</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/')}>Start Shopping</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderId}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="order-items">
                <h4>Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h5>{item.name}</h5>
                      <p>Quantity: {item.qty}</p>
                      <p>₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <div className="shipping-address">
                  <h4>Shipping Address:</h4>
                  <p>{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                </div>
                
                <div className="order-total">
                  <h4>Total: ₹{order.totalAmount}</h4>
                  <p>Payment ID: {order.paymentId}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;