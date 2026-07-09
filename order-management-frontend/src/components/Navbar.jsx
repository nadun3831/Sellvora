import { NavLink } from 'react-router-dom';

export default function Navbar({ role, cartCount }) {
  const adminLinks = [
    { to: '/', icon: 'dashboard', label: 'Dashboard' },
    { to: '/products', icon: 'inventory_2', label: 'Inventory' },
    { to: '/orders', icon: 'shopping_cart', label: 'Orders' },
    { to: '/categories', icon: 'category', label: 'Categories' },
    { to: '/payments', icon: 'payments', label: 'Payments' },
  ];

  const customerLinks = [
    { to: '/', icon: 'storefront', label: 'Shop Catalog' },
    { to: '/cart', icon: 'shopping_cart', label: 'Cart', badge: cartCount },
    { to: '/my-orders', icon: 'receipt_long', label: 'My Orders' },
  ];

  const links = role === 'admin' ? adminLinks : customerLinks;

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <h1>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          EcoShop
        </h1>
        <p>{role === 'admin' ? 'Management Suite' : 'Verdant Store'}</p>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            <span>{link.label}</span>
            {link.badge !== undefined && link.badge > 0 && (
              <span className="badge-count" style={{
                marginLeft: 'auto',
                background: 'var(--primary)',
                color: 'var(--on-primary)',
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '9999px'
              }}>
                {link.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

