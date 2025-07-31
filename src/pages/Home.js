import React, { useEffect, useState } from 'react';
import './Home.css';
import { useCart } from './CartContext';

const products = [
  {
    id: 1,
    title: "Traditional Thekua",
    price: 1,
    originalPrice: 599,
    image: "/images/product1.jpeg",
    sale: true,
  },
  {
    id: 2,
    title: "Jaggery Thekua",
    price: 299,
    originalPrice: 599,
    image: "/images/product2.jpeg",
    sale: true,
  },
  {
    id: 3,
    title: "Traditional Thekua 3 Combo",
    price: 799,
    originalPrice: 1799,
    image: "/images/product3.jpeg",
    sale: true,
    tag: "PACK OF 3",
  },
  {
    id: 4,
    title: "Jaggery Thekua 3 Combo",
    price: 799,
    originalPrice: 1799,
    image: "/images/product4.jpeg",
    sale: true,
    tag: "PACK OF 3",
  },
];

const Home = () => {
  const { addToCart } = useCart();
  const images = [
    '/images/tranding01.png',
    '/images/tranding01.png',
    '/images/tranding01.png',
    '/images/tranding01.png',
    '/images/tranding01.png',
    '/images/tranding01.png',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <div className="full-width-slider-wrapper">
        <div
          className="full-width-slider-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <div className="full-width-slide" key={index}>
              <img src={src} alt={`Slide ${index}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="home-container">
        <h2 className="section-title">Our Products</h2>
        <div className="product-grid">
          {products.map((item) => (
            <div className="product-card" key={item.id}>
              <div className="image-container">
                <img src={item.image} alt={item.title} />
                {item.sale && <span className="sale-badge">Sale</span>}
                {item.tag && <span className="combo-tag">{item.tag}</span>}
              </div>
              <div className="product-info">
                <p className="product-title">{item.title}</p>
                <p className="product-price">
                  <span className="original-price">Rs. {item.originalPrice}.00</span>
                  <span className="discounted-price">Rs. {item.price}.00</span>
                </p>
                <button className="add-to-cart-btn" onClick={() => addToCart(item)}>
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="review-wrapper">
        <h2>What Our Customers Say</h2>
        <div className="review-list">
          {/* Sample Reviews */}
          <div className="review-card">
            <div className="review-card-header">
              <div className="review-name">Ravindra Singh</div>
              <div className="review-date">24 July 2025</div>
            </div>
            <div className="review-rating">★★★★★</div>
            <p className="review-text">Absolutely fantastic product! Build quality is premium and the packaging was excellent. Delivered on time. Highly recommend it!</p>
          </div>

          <div className="review-card">
            <div className="review-card-header">
              <div className="review-name">Priya Sharma</div>
              <div className="review-date">22 July 2025</div>
            </div>
            <div className="review-rating">★★★★☆</div>
            <p className="review-text">Loved the design and overall experience. Customer support was responsive. Slight improvement needed in delivery time.</p>
          </div>

          <div className="review-card">
            <div className="review-card-header">
              <div className="review-name">Ankit Verma</div>
              <div className="review-date">20 July 2025</div>
            </div>
            <div className="review-rating">★★★☆☆</div>
            <p className="review-text">Product is okay for the price. Quality is average, but not disappointed. Could be better with sturdier material.</p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <h3>Shuddh Swad</h3>
            <p>Authentic and pure products delivered to your doorstep. <br />Experience the true taste of tradition.</p>
            <div className="footer-social-icons">
              <a href="#"><i className="fa-brands fa-instagram"></i></a>
              <a href="#"><i className="fa-brands fa-youtube"></i></a>
              <a href="#"><i className="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Track Order</a></li>
              <li><a href="#">Return & Refund Policy</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Get in Touch</h4>
            <p><i className="fa-solid fa-location-dot"></i> Adra, Near DVC More, West Bengal 723121, India.</p>
            <p><i className="fa-solid fa-phone"></i> +91 8016380734<br /><span>Mon - Fri, 10am - 6:30pm</span></p>
            <p><i className="fa-solid fa-envelope"></i> contact@shuddhswad.shop</p>
          </div>
        </div>
        <hr />
        <p className="footer-bottom">&copy; 2025 Shuddh Swad. All Rights Reserved.</p>
      </footer>
    </>
  );
};

export default Home;
