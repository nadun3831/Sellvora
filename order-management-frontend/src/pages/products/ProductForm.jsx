import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosClient';
import ErrorBanner from '../../components/ErrorBanner';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ productId: '', productName: '', price: '', stock: 0, description: '', categoryId: '', imageUrl: '' });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data)).catch(() => {});
    if (isEdit) api.get(`/products/${id}`).then((r) => setForm(r.data)).catch((e) => setError(e.message));
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); setError('');
    const data = { ...form, price: Number(form.price), stock: Number(form.stock) };
    if (!isEdit) {
      delete data.productId; // Let backend generate auto-incremented ID
    }
    const req = isEdit ? api.put(`/products/${id}`, data) : api.post('/products', data);
    req.then(() => navigate('/products')).catch((e) => setError(e.message));
  };

  return (
    <>
      <div className="page-header"><div><h1>{isEdit ? 'Edit Product' : 'Add New Product'}</h1></div></div>
      <ErrorBanner message={error} onClose={() => setError('')} />
      <div className="card" style={{ padding: 32, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product ID</label>
            <input
              className="form-input"
              value={isEdit ? (form.productId || '') : 'Auto-generated'}
              disabled={true}
              style={{ background: 'var(--surface-high)', cursor: 'not-allowed' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input className="form-input" value={form.productName || ''} onChange={(e) => setForm({ ...form, productName: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price *</label>
              <input className="form-input" type="number" step="0.01" min="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Stock *</label>
              <input className="form-input" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.categoryId || ''} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">Select a category...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Product Image</label>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{
                width: 100,
                height: 100,
                borderRadius: 'var(--radius)',
                border: '1px solid var(--outline-variant)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: 'var(--surface-low)'
              }}>
                {form.imageUrl ? (
                  <img src={form.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--outline-variant)' }}>image</span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="product-image-upload"
                />
                <label htmlFor="product-image-upload" className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                  <span className="material-symbols-outlined">upload</span>
                  Upload Image
                </label>
                {form.imageUrl && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--error-red)' }}
                    onClick={() => setForm({ ...form, imageUrl: '' })}
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>Cancel</button>
            <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Save Product'}</button>
          </div>
        </form>
      </div>
    </>
  );
}
