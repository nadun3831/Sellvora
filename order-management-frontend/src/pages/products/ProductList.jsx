import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import ErrorBanner from '../../components/ErrorBanner';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [catFilter, setCatFilter] = useState('all');

  const load = () => {
    api.get('/products').then((r) => setProducts(r.data)).catch((e) => setError(e.message));
    api.get('/categories').then((r) => setCategories(r.data)).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const handleDelete = () => {
    api.delete(`/products/${deleteId}`).then(() => { setDeleteId(null); load(); }).catch((e) => setError(e.message));
  };

  const getCatName = (cid) => categories.find((c) => c.id === cid)?.categoryName || '';
  const filtered = catFilter === 'all' ? products : products.filter((p) => p.categoryId === catFilter);

  const stockBadge = (stock) => {
    if (stock === 0) return <span className="stock-badge stock-out">Out of Stock</span>;
    if (stock <= 10) return <span className="stock-badge stock-low">Low Stock ({stock})</span>;
    return <span className="stock-badge stock-in">In Stock ({stock})</span>;
  };

  return (
    <>
      <div className="page-header">
        <div><h1>Products</h1><p>Manage your inventory and product listings.</p></div>
        <Link to="/products/new" className="btn btn-primary"><span className="material-symbols-outlined">add</span>Add New Product</Link>
      </div>
      <ErrorBanner message={error} onClose={() => setError('')} />
      <div className="filters-bar">
        <select className="form-select" style={{ width: 'auto' }} value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
        </select>
        <span className="text-muted text-sm">Showing {filtered.length} of {products.length} products</span>
      </div>
      <div className="product-grid">
        {filtered.map((p) => (
          <div className="card product-card" key={p.id}>
            {stockBadge(p.stock)}
            <div className="product-img">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span className="material-symbols-outlined">inventory_2</span>
              )}
            </div>
            <div className="product-info">
              <div className="product-category">{getCatName(p.categoryId) || 'Uncategorized'}</div>
              <h3 className="product-name">{p.productName}</h3>
              <div className="product-footer">
                <span className="product-price">${p.price?.toFixed(2)}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <Link to={`/products/${p.id}/edit`} className="icon-btn"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit</span></Link>
                  <button className="icon-btn" onClick={() => setDeleteId(p.id)}><span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--error-red)' }}>delete</span></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-muted">No products found. Add your first product!</p>}
      </div>
      {deleteId && <ConfirmDialog title="Delete Product" message="This will permanently remove this product." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
    </>
  );
}
