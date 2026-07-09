import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import ErrorBanner from '../../components/ErrorBanner';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);

  const load = () => api.get('/orders').then((r) => setOrders(r.data)).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const handleDelete = () => {
    api.delete(`/orders/${deleteId}`).then(() => { setDeleteId(null); load(); }).catch((e) => setError(e.message));
  };

  const filtered = orders.filter((o) => {
    const matchSearch = o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Manage and track customer orders.</p>
        </div>
        <Link to="/orders/new" className="btn btn-primary">
          <span className="material-symbols-outlined">add</span>New Order
        </Link>
      </div>

      <ErrorBanner message={error} onClose={() => setError('')} />

      <div className="filters-bar">
        <div className="filter-search">
          <span className="material-symbols-outlined">search</span>
          <input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 'auto' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
        </select>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Email</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right">Total Amount</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, color: 'var(--on-surface-variant)' }}>No orders found</td></tr>
              ) : filtered.map((order) => (
                <tr key={order.id}>
                  <td className="font-medium"><Link to={`/orders/${order.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{order.orderId}</Link></td>
                  <td className="text-muted">{order.customerEmail}</td>
                  <td className="text-muted">{order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td className="text-right font-medium">${order.totalAmount?.toFixed(2) || '0.00'}</td>
                  <td className="text-center">
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                      <Link to={`/orders/${order.id}`} className="icon-btn" title="View"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>visibility</span></Link>
                      <Link to={`/orders/${order.id}/edit`} className="icon-btn" title="Edit"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit</span></Link>
                      <button className="icon-btn" title="Delete" onClick={() => setDeleteId(order.id)}><span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--error-red)' }}>delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span>Showing {filtered.length} of {orders.length} results</span>
        </div>
      </div>

      {deleteId && <ConfirmDialog title="Delete Order" message="This action cannot be undone. Are you sure?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
    </>
  );
}

function StatusBadge({ status }) {
  const s = (status || '').toUpperCase();
  const cls = s === 'PENDING' ? 'badge-pending' : s === 'CONFIRMED' ? 'badge-confirmed'
    : s === 'SHIPPED' ? 'badge-shipped' : s === 'DELIVERED' ? 'badge-delivered' : 'badge-cancelled';
  return <span className={`badge ${cls}`}><span className="badge-dot"></span>{status}</span>;
}
