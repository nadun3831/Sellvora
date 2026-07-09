import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import ErrorBanner from '../../components/ErrorBanner';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function OrderDetails({ role = 'admin' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    api.get(`/orders/${id}`).then((r) => { setOrder(r.data); setNewStatus(r.data.status); }).catch((e) => setError(e.message));
  }, [id]);

  const handleStatusUpdate = () => {
    setError(''); setSuccess('');
    api.patch(`/orders/${id}`, { status: newStatus })
      .then((r) => { setOrder(r.data); setSuccess('Status updated successfully!'); })
      .catch((e) => setError(e.message));
  };

  const handleDelete = () => {
    api.delete(`/orders/${id}`).then(() => navigate('/orders')).catch((e) => setError(e.message));
  };

  if (!order) return <div className="text-muted" style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Order: {order.orderId}</h1>
          <p>Created {order.orderDate ? new Date(order.orderDate).toLocaleString() : '—'}</p>
        </div>
        <div className="page-actions">
          {role === 'admin' ? (
            <>
              <Link to={`/orders/${id}/edit`} className="btn btn-outline"><span className="material-symbols-outlined">edit</span>Edit</Link>
              <button className="btn btn-danger" onClick={() => setShowDelete(true)}><span className="material-symbols-outlined">delete</span>Delete</button>
            </>
          ) : (
            <Link to="/my-orders" className="btn btn-outline">
              <span className="material-symbols-outlined">arrow_back</span>
              Back to My Orders
            </Link>
          )}
        </div>
      </div>

      <ErrorBanner message={error} onClose={() => setError('')} />
      {success && <div className="success-banner"><span>{success}</span><button onClick={() => setSuccess('')}><span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span></button></div>}

      <div className={role === 'admin' ? 'grid-2' : ''}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Order Details</h3>
          <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px 16px', fontSize: 14 }}>
            <dt className="text-muted font-semibold">Order ID</dt><dd className="font-medium">{order.orderId}</dd>
            <dt className="text-muted font-semibold">Email</dt><dd>{order.customerEmail}</dd>
            <dt className="text-muted font-semibold">Date</dt><dd>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '—'}</dd>
            <dt className="text-muted font-semibold">Status</dt><dd><StatusBadge status={order.status} /></dd>
            <dt className="text-muted font-semibold">Total</dt><dd className="font-bold" style={{ fontSize: 18 }}>${order.totalAmount?.toFixed(2)}</dd>
            <dt className="text-muted font-semibold">Products</dt><dd>{order.productIds?.length || 0} items</dd>
            <dt className="text-muted font-semibold">Payments</dt><dd>{order.paymentMethodIds?.length || 0} methods</dd>
          </dl>
        </div>

        {role === 'admin' && (
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Update Status</h3>
            <div className="form-group">
              <label className="form-label">Current Status</label>
              <StatusBadge status={order.status} />
            </div>
            <div className="form-group">
              <label className="form-label">New Status</label>
              <select className="form-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={handleStatusUpdate} disabled={newStatus === order.status}>
              <span className="material-symbols-outlined">sync</span>Update Status
            </button>
          </div>
        )}
      </div>

      {showDelete && <ConfirmDialog title="Delete Order" message={`Permanently delete order ${order.orderId}?`} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />}
    </>
  );
}

function StatusBadge({ status }) {
  const s = (status || '').toUpperCase();
  const cls = s === 'PENDING' ? 'badge-pending' : s === 'CONFIRMED' ? 'badge-confirmed'
    : s === 'SHIPPED' ? 'badge-shipped' : s === 'DELIVERED' ? 'badge-delivered' : 'badge-cancelled';
  return <span className={`badge ${cls}`} style={{ marginTop: 4 }}><span className="badge-dot"></span>{status}</span>;
}
