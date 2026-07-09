import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosClient';
import ErrorBanner from '../../components/ErrorBanner';

export default function OrderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ orderId: '', customerEmail: '', productIds: [], paymentMethodIds: [] });
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [previewTotal, setPreviewTotal] = useState(0);

  useEffect(() => {
    api.get('/products').then((r) => setProducts(r.data)).catch(() => {});
    api.get('/payment-methods').then((r) => setPayments(r.data)).catch(() => {});
    if (isEdit) {
      api.get(`/orders/${id}`).then((r) => setForm(r.data)).catch((e) => setError(e.message));
    }
  }, [id]);

  useEffect(() => {
    const selected = products.filter((p) => form.productIds?.includes(p.id));
    let sum = selected.reduce((acc, p) => acc + (p.price || 0), 0);
    if (sum > 5000) sum *= 0.9;
    setPreviewTotal(Math.round(sum * 100) / 100);
  }, [form.productIds, products]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const req = isEdit ? api.put(`/orders/${id}`, form) : api.post('/orders', form);
    req.then(() => navigate('/orders')).catch((e) => setError(e.message));
  };

  const toggleProduct = (pid) => {
    setForm((f) => ({
      ...f,
      productIds: f.productIds?.includes(pid) ? f.productIds.filter((x) => x !== pid) : [...(f.productIds || []), pid],
    }));
  };

  const togglePayment = (pid) => {
    setForm((f) => ({
      ...f,
      paymentMethodIds: f.paymentMethodIds?.includes(pid) ? f.paymentMethodIds.filter((x) => x !== pid) : [...(f.paymentMethodIds || []), pid],
    }));
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{isEdit ? 'Edit Order' : 'Create New Order'}</h1>
          <p>{isEdit ? 'Update order details' : 'Fill in the details to create a new order.'}</p>
        </div>
      </div>
      <ErrorBanner message={error} onClose={() => setError('')} />
      <div className="card" style={{ padding: 32, maxWidth: 720 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Order ID *</label>
              <input className="form-input" value={form.orderId || ''} onChange={(e) => setForm({ ...form, orderId: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Customer Email *</label>
              <input className="form-input" type="email" value={form.customerEmail || ''} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Select Products</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {products.map((p) => (
                <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 'var(--radius)', border: form.productIds?.includes(p.id) ? '2px solid var(--primary)' : '1px solid var(--outline-variant)', background: form.productIds?.includes(p.id) ? 'var(--sage-wash)' : 'var(--surface-lowest)', cursor: 'pointer', fontSize: 14, transition: 'all 0.15s' }}>
                  <input type="checkbox" checked={form.productIds?.includes(p.id)} onChange={() => toggleProduct(p.id)} style={{ display: 'none' }} />
                  <span>{p.productName}</span>
                  <span className="text-muted">${p.price?.toFixed(2)}</span>
                </label>
              ))}
              {products.length === 0 && <span className="text-muted text-sm">No products available. Create products first.</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Payment Methods</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {payments.map((pm) => (
                <label key={pm.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 'var(--radius)', border: form.paymentMethodIds?.includes(pm.id) ? '2px solid var(--primary)' : '1px solid var(--outline-variant)', background: form.paymentMethodIds?.includes(pm.id) ? 'var(--sage-wash)' : 'var(--surface-lowest)', cursor: 'pointer', fontSize: 14, transition: 'all 0.15s' }}>
                  <input type="checkbox" checked={form.paymentMethodIds?.includes(pm.id)} onChange={() => togglePayment(pm.id)} style={{ display: 'none' }} />
                  <span>{pm.paymentType}</span>
                  <span className="text-muted">•••{pm.accountNumber?.slice(-4)}</span>
                </label>
              ))}
              {payments.length === 0 && <span className="text-muted text-sm">No payment methods. Create one first.</span>}
            </div>
          </div>

          <div className="card" style={{ padding: 16, marginBottom: 20, background: 'var(--sage-wash)', border: '1px solid var(--secondary-container)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-semibold">Estimated Total</span>
              <span style={{ fontSize: 24, fontWeight: 700 }}>${previewTotal.toFixed(2)}</span>
            </div>
            {previewTotal > 0 && products.filter((p) => form.productIds?.includes(p.id)).reduce((s, p) => s + p.price, 0) > 5000 && (
              <div className="text-sm" style={{ color: 'var(--status-delivered)', marginTop: 4 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle' }}>discount</span> 10% discount applied (total &gt; $5,000)
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/orders')}>Cancel</button>
            <button type="submit" className="btn btn-primary">{isEdit ? 'Update Order' : 'Create Order'}</button>
          </div>
        </form>
      </div>
    </>
  );
}
