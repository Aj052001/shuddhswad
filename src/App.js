import React from 'react';
import './App.css';

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Layout from './layout/Layout';
import User from './pages/User';
import Cart from './pages/Cart';
import Caccount from './pages/Caccount';
import Orders from './pages/Orders';
import Track from './pages/Track';

import { CartProvider } from './pages/CartContext';
import { AuthProvider } from './context/AuthContext';
import CartPopup from './components/CartPopup';

// 👇 Create Routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="orders" element={<Orders />} />
      <Route path="track" element={<Track />} />
      <Route path="user" element={<User />} />
      <Route path="cart" element={<Cart />} />
      <Route path="caccount" element={<Caccount />} />
    </Route>
  )
);

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
