import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosClient';
import ErrorBanner from '../../components/ErrorBanner';

export default function PaymentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ paymentId: '', paymentType: 'CARD', accountNumber: '', expiryDate: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) api.get(`/payment-methods/${id}`).then((r) => setForm(r.data)).catch((e) => setError(e.message));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault(); setError('');
    const req = isEdit ? api.put(`/payment-methods/${id}`, form) : api.post('/payment-methods', form);
    req.then(() => navigate('/payments')).catch((e) => setError(e.message));
  };

  return (
    <>
      <div className="page-header"><div><h1>{isEdit ? 'Edit Payment Method' : 'Add Payment Method'}</h1></div></div>
      <ErrorBanner message={error} onClose={() => setError('')} />
      <div className="card" style={{ padding: 32, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label">Payment ID *</label><input className="form-input" value={form.paymentId || ''} onChange={(e) => setForm({ ...form, paymentId: e.target.value })} required /></div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payment Type *</label>
              <select className="form-select" value={form.paymentType || ''} onChange={(e) => setForm({ ...form, paymentType: e.target.value })}>
                <option value="CARD">CARD</option>
                <option value="WALLET">WALLET</option>
                <option value="BANK_TRANSFER">BANK_TRANSFER</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Expiry Date (MM/YY)</label><input className="form-input" placeholder="12/25" value={form.expiryDate || ''} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} /></div>
          </div>
          <div className="form-group"><label className="form-label">Account Number *</label><input className="form-input" value={form.accountNumber || ''} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} required /></div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/payments')}>Cancel</button>
            <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Save Payment Method'}</button>
          </div>
        </form>
      </div>
    </>
  );
}
