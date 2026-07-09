import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import ErrorBanner from '../../components/ErrorBanner';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const load = () => api.get('/payment-methods').then((r) => setPayments(r.data)).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const handleDelete = () => {
    api.delete(`/payment-methods/${deleteId}`).then(() => { setDeleteId(null); load(); }).catch((e) => setError(e.message));
  };

  return (
    <>
      <div className="page-header">
        <div><h1>Payment Methods</h1><p>Manage available payment methods.</p></div>
        <Link to="/payments/new" className="btn btn-primary"><span className="material-symbols-outlined">add</span>Add Payment Method</Link>
      </div>
      <ErrorBanner message={error} onClose={() => setError('')} />
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Payment ID</th><th>Type</th><th>Account Number</th><th>Expiry</th><th className="text-center">Actions</th></tr></thead>
          <tbody>
            {payments.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--on-surface-variant)' }}>No payment methods yet</td></tr>
            ) : payments.map((pm) => (
              <tr key={pm.id}>
                <td className="font-medium">{pm.paymentId}</td>
                <td><span className="badge badge-confirmed">{pm.paymentType}</span></td>
                <td className="text-muted">•••• {pm.accountNumber?.slice(-4)}</td>
                <td className="text-muted">{pm.expiryDate || '—'}</td>
                <td className="text-center">
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                    <Link to={`/payments/${pm.id}/edit`} className="icon-btn"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit</span></Link>
                    <button className="icon-btn" onClick={() => setDeleteId(pm.id)}><span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--error-red)' }}>delete</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deleteId && <ConfirmDialog title="Delete Payment Method" message="This will permanently remove this payment method." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
    </>
  );
}
