import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosClient';
import ErrorBanner from '../../components/ErrorBanner';

export default function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ categoryId: '', categoryName: '', description: '', primaryProductId: '' });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/products').then((r) => setProducts(r.data)).catch(() => {});
    if (isEdit) api.get(`/categories/${id}`).then((r) => setForm(r.data)).catch((e) => setError(e.message));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault(); setError('');
    const req = isEdit ? api.put(`/categories/${id}`, form) : api.post('/categories', form);
    req.then(() => navigate('/categories')).catch((e) => setError(e.message));
  };

  return (
    <>
      <div className="page-header"><div><h1>{isEdit ? 'Edit Category' : 'Add Category'}</h1></div></div>
      <ErrorBanner message={error} onClose={() => setError('')} />
      <div className="card" style={{ padding: 32, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Category ID *</label><input className="form-input" value={form.categoryId || ''} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required /></div>
            <div className="form-group"><label className="form-label">Category Name *</label><input className="form-input" value={form.categoryName || ''} onChange={(e) => setForm({ ...form, categoryName: e.target.value })} required /></div>
          </div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="form-group">
            <label className="form-label">Primary Product (1:1)</label>
            <select className="form-select" value={form.primaryProductId || ''} onChange={(e) => setForm({ ...form, primaryProductId: e.target.value })}>
              <option value="">None</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.productName}</option>)}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/categories')}>Cancel</button>
            <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Save Category'}</button>
          </div>
        </form>
      </div>
    </>
  );
}
