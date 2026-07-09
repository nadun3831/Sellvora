import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import ErrorBanner from '../../components/ErrorBanner';

export default function CustomerOrders() {
  const [email, setEmail] = useState(localStorage.getItem('customerEmail') || '');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (email) {
      fetchOrders(email);
    }
  }, []);

  const fetchOrders = (searchEmail) => {
    if (!searchEmail) return;
    setLoading(true);
    setError('');
    api.get(`/orders?email=${searchEmail}`)
      .then((res) => {
        setOrders(res.data);
        localStorage.setItem('customerEmail', searchEmail);
        setSearched(true);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(email);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>My Orders</h1>
          <p>Track your order status and view purchase history.</p>
        </div>
      </div>

      <ErrorBanner message={error} onClose={() => setError('')} />

      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Lookup Orders</h3>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: 240, marginBottom: 0 }}>
            <label className="form-label">Enter Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: 42 }} disabled={loading}>
            <span className="material-symbols-outlined">search</span>
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-muted" style={{ padding: 40, textAlign: 'center' }}>Loading orders...</div>
      ) : searched && orders.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--outline-variant)', marginBottom: 16 }}>receipt_long</span>
          <p className="text-muted">No orders found for this email address.</p>
        </div>
      ) : searched ? (
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right">Total Amount</th>
                <th className="text-right">Items</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="font-semibold">{order.orderId}</td>
                  <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '—'}</td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="text-right font-bold">${order.totalAmount?.toFixed(2)}</td>
                  <td className="text-right">{order.productIds?.length || 0}</td>
                  <td className="text-center">
                    <Link to={`/orders/${order.id}`} className="btn btn-outline btn-sm">
                      <span className="material-symbols-outlined">visibility</span>
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-muted" style={{ padding: 40, textAlign: 'center' }}>
          Enter your email above to fetch your order history.
        </div>
      )}
    </>
  );
}

function StatusBadge({ status }) {
  const s = (status || '').toUpperCase();
  const cls = s === 'PENDING' ? 'badge-pending' : s === 'CONFIRMED' ? 'badge-confirmed'
    : s === 'SHIPPED' ? 'badge-shipped' : s === 'DELIVERED' ? 'badge-delivered' : 'badge-cancelled';
  return <span className={`badge ${cls}`}><span className="badge-dot"></span>{status}</span>;
}
