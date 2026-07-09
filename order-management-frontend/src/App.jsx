import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/dashboard/Dashboard';
import OrderList from './pages/orders/OrderList';
import OrderForm from './pages/orders/OrderForm';
import OrderDetails from './pages/orders/OrderDetails';
import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';
import CategoryList from './pages/categories/CategoryList';
import CategoryForm from './pages/categories/CategoryForm';
import PaymentList from './pages/payments/PaymentList';
import PaymentForm from './pages/payments/PaymentForm';

// Customer Pages
import CustomerShop from './pages/customer/CustomerShop';
import CustomerCart from './pages/customer/CustomerCart';
import CustomerOrders from './pages/customer/CustomerOrders';

// Auth Page
import Login from './pages/auth/Login';
import api from './api/axiosClient';

// Legal Pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import HelpCenter from './pages/legal/HelpCenter';

export default function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [role, setRole] = useState(() => localStorage.getItem('role') || 'customer');
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleLogin = (selectedRole, data) => {
    setRole(selectedRole);
    localStorage.setItem('role', selectedRole);
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    if (selectedRole === 'customer' && data.email) {
      localStorage.setItem('customerEmail', data.email);
    }
    navigate('/');
  };

  const handleLogout = () => {
    // Restore cart items' stock back to the DB before logging out
    clearCart(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('customerEmail');
    setIsLoggedIn(false);
    navigate('/');
  };

  const addToCart = (product) => {
    if (product.stock <= 0) return;
    const newStock = product.stock - 1;

    api.patch(`/products/${product.id}`, { stock: newStock })
      .then(() => {
        setCart((prev) => {
          const existing = prev.find((item) => item.product.id === product.id);
          if (existing) {
            return prev.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1, product: { ...item.product, stock: newStock } }
                : item
            );
          }
          return [...prev, { product: { ...product, stock: newStock }, quantity: 1 }];
        });
      })
      .catch((err) => console.error("Failed to update stock:", err));
  };

  const updateCartQty = (productId, qty) => {
    setCart((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (!item) return prev;

      const oldQty = item.quantity;
      const newQty = Math.max(1, qty);
      const delta = newQty - oldQty;
      if (delta === 0) return prev;

      const currentStock = item.product.stock;
      const newStock = currentStock - delta;
      if (newStock < 0) return prev; // Not enough stock

      api.patch(`/products/${productId}`, { stock: newStock })
        .then(() => {
          setCart((currentCart) =>
            currentCart.map((i) =>
              i.product.id === productId
                ? { ...i, quantity: newQty, product: { ...i.product, stock: newStock } }
                : i
            )
          );
        })
        .catch((err) => console.error("Failed to update stock:", err));

      return prev;
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (!item) return prev;

      const restoredStock = item.product.stock + item.quantity;

      api.patch(`/products/${productId}`, { stock: restoredStock })
        .then(() => {
          setCart((currentCart) => currentCart.filter((i) => i.product.id !== productId));
        })
        .catch((err) => console.error("Failed to restore stock:", err));

      return prev;
    });
  };

  const clearCart = (isCheckout = false) => {
    if (isCheckout) {
      setCart([]);
      return;
    }

    setCart((prev) => {
      if (prev.length === 0) return prev;
      const promises = prev.map((item) => {
        const restoredStock = item.product.stock + item.quantity;
        return api.patch(`/products/${item.product.id}`, { stock: restoredStock });
      });

      Promise.all(promises)
        .then(() => {
          setCart([]);
        })
        .catch((err) => console.error("Failed to restore stock:", err));

      return prev;
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-layout">
      <Navbar role={role} cartCount={cartCount} />
      <div className="app-main">
        <header className="app-header">
          <div className="header-search">
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder={role === 'admin' ? "Search orders, products..." : "Search shop catalog..."} />
          </div>
          <div className="header-actions">
            {/* Elegant Role Badge */}
            <span style={{
              background: role === 'admin' ? 'var(--primary-container)' : 'var(--secondary-container)',
              color: role === 'admin' ? 'var(--on-primary-container)' : 'var(--on-secondary-container)',
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: '600',
              marginRight: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                {role === 'admin' ? 'admin_panel_settings' : 'person'}
              </span>
              {role === 'admin' ? 'Administrator' : 'Customer'}
            </span>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid var(--outline)',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--on-surface)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginRight: '16px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--error-red)'; e.currentTarget.style.color = 'var(--error-red)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--outline)'; e.currentTarget.style.color = 'var(--on-surface)'; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>logout</span>
              Logout
            </button>

            <div ref={notifRef} style={{ position: 'relative' }}>
              <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
                <span className="material-symbols-outlined">notifications</span>
              </button>
              {showNotifications && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                  width: '280px', background: 'var(--surface-high)',
                  border: '1px solid var(--outline-variant)', borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)', zIndex: 1000, overflow: 'hidden',
                  animation: 'fadeIn 0.15s ease-out'
                }}>
                  <div style={{
                    padding: '14px 16px', borderBottom: '1px solid var(--outline-variant)',
                    fontWeight: '600', fontSize: '14px', color: 'var(--on-surface)'
                  }}>
                    Notifications
                  </div>
                  <div style={{
                    padding: '32px 16px', textAlign: 'center'
                  }}>
                    <span className="material-symbols-outlined" style={{
                      fontSize: '40px', color: 'var(--on-surface-variant)', opacity: 0.4, marginBottom: '8px'
                    }}>notifications_off</span>
                    <p style={{ fontSize: '13px', color: 'var(--on-surface-variant)', margin: '8px 0 0' }}>
                      No new notifications
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="avatar">{role === 'admin' ? 'A' : 'C'}</div>
          </div>
        </header>

        <main className="app-content">
          <Routes>
            {role === 'admin' ? (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/orders" element={<OrderList />} />
                <Route path="/orders/new" element={<OrderForm />} />
                <Route path="/orders/:id" element={<OrderDetails role={role} />} />
                <Route path="/orders/:id/edit" element={<OrderForm />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/new" element={<ProductForm />} />
                <Route path="/products/:id/edit" element={<ProductForm />} />
                <Route path="/categories" element={<CategoryList />} />
                <Route path="/categories/new" element={<CategoryForm />} />
                <Route path="/categories/:id/edit" element={<CategoryForm />} />
                <Route path="/payments" element={<PaymentList />} />
                <Route path="/payments/new" element={<PaymentForm />} />
                <Route path="/payments/:id/edit" element={<PaymentForm />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/help-center" element={<HelpCenter />} />
              </>
            ) : (
              <>
                <Route path="/" element={<CustomerShop addToCart={addToCart} />} />
                <Route path="/cart" element={<CustomerCart cart={cart} updateCartQty={updateCartQty} removeFromCart={removeFromCart} clearCart={clearCart} />} />
                <Route path="/my-orders" element={<CustomerOrders />} />
                <Route path="/orders/:id" element={<OrderDetails role={role} />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/help-center" element={<HelpCenter />} />
              </>
            )}
          </Routes>
        </main>

        <footer className="app-footer">
          <span>© 2026 Sellvora Order Management. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link to="/privacy-policy" className="text-muted">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-muted">Terms of Service</Link>
            <Link to="/help-center" className="text-muted">Help Center</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

