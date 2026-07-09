import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosClient';

export default function Dashboard() {
  const [stats, setStats] = useState({ orders: 0, products: 0, categories: 0, payments: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/orders').catch(() => ({ data: [] })),
      api.get('/products').catch(() => ({ data: [] })),
      api.get('/categories').catch(() => ({ data: [] })),
      api.get('/payment-methods').catch(() => ({ data: [] })),
    ]).then(([o, p, c, pm]) => {
      setStats({ orders: o.data.length, products: p.data.length, categories: c.data.length, payments: pm.data.length });
      setRecentOrders(o.data.slice(-5).reverse());
    });
  }, []);

  const revenue = recentOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pending = recentOrders.filter((o) => o.status === 'PENDING').length;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome back. Here's what's happening with your store today.</p>
        </div>
        <div className="page-actions">
          <Link to="/orders" className="btn btn-outline">
            <span className="material-symbols-outlined">visibility</span>
            View Orders
          </Link>
          <Link to="/orders/new" className="btn btn-primary">
            <span className="material-symbols-outlined">add</span>
            New Order
          </Link>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="card kpi-card">
          <span className="material-symbols-outlined kpi-bg-icon">shopping_bag</span>
          <div className="kpi-icon-wrap">
            <div className="kpi-icon">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_mall</span>
            </div>
            <span className="kpi-label">Total Orders</span>
          </div>
          <div className="kpi-value">{stats.orders.toLocaleString()}</div>
          <div className="kpi-trend up">
            <span className="material-symbols-outlined">trending_up</span>
            Live count
          </div>
        </div>

        <div className="card kpi-card">
          <span className="material-symbols-outlined kpi-bg-icon">payments</span>
          <div className="kpi-icon-wrap">
            <div className="kpi-icon">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
            </div>
            <span className="kpi-label">Revenue</span>
          </div>
          <div className="kpi-value">${revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="kpi-trend up">
            <span className="material-symbols-outlined">trending_up</span>
            From recent orders
          </div>
        </div>

        <div className="card kpi-card">
          <span className="material-symbols-outlined kpi-bg-icon" style={{ color: 'var(--status-pending)' }}>local_shipping</span>
          <div className="kpi-icon-wrap">
            <div className="kpi-icon" style={{ background: 'var(--error-container)' }}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: '#93000a' }}>inventory</span>
            </div>
            <span className="kpi-label">Pending Orders</span>
          </div>
          <div className="kpi-value">{pending}</div>
          <div className="kpi-trend" style={{ color: 'var(--on-surface-variant)' }}>Requires action</div>
        </div>

        <div className="card kpi-card">
          <span className="material-symbols-outlined kpi-bg-icon" style={{ color: 'var(--status-delivered)' }}>inventory_2</span>
          <div className="kpi-icon-wrap">
            <div className="kpi-icon">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
            </div>
            <span className="kpi-label">Products</span>
          </div>
          <div className="kpi-value">{stats.products}</div>
          <div className="kpi-trend up">
            <span className="material-symbols-outlined">trending_up</span>
            Active listings
          </div>
        </div>
      </div>

      <div className="grid-3">
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600 }}>Recent Orders</h3>
            <Link to="/orders" className="text-primary text-sm font-semibold" style={{ textDecoration: 'none' }}>View All</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-muted text-sm">No orders yet. Create your first order to get started.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium">{order.orderId}</td>
                    <td className="text-muted">{order.customerEmail}</td>
                    <td><StatusBadge status={order.status} /></td>
                    <td className="text-right font-medium">${order.totalAmount?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600 }}>Quick Links</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { to: '/products/new', icon: 'add_circle', label: 'Add New Product', color: 'var(--primary)' },
              { to: '/categories/new', icon: 'create_new_folder', label: 'Add Category', color: 'var(--status-confirmed)' },
              { to: '/payments/new', icon: 'add_card', label: 'Add Payment Method', color: 'var(--status-pending)' },
              { to: '/orders', icon: 'list_alt', label: 'Manage Orders', color: 'var(--status-delivered)' },
            ].map((item) => (
              <Link key={item.to} to={item.to} className="activity-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="activity-icon" style={{ background: 'var(--surface-high)', color: item.color }}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div>
                  <div className="activity-text font-semibold">{item.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function StatusBadge({ status }) {
  const s = (status || '').toUpperCase();
  const cls = s === 'PENDING' ? 'badge-pending' : s === 'CONFIRMED' ? 'badge-confirmed'
    : s === 'SHIPPED' ? 'badge-shipped' : s === 'DELIVERED' ? 'badge-delivered' : 'badge-cancelled';
  return <span className={`badge ${cls}`}><span className="badge-dot"></span>{status}</span>;
}
