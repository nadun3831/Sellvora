import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import ErrorBanner from '../../components/ErrorBanner';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const load = () => api.get('/categories').then((r) => setCategories(r.data)).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const handleDelete = () => {
    api.delete(`/categories/${deleteId}`).then(() => { setDeleteId(null); load(); }).catch((e) => setError(e.message));
  };

  return (
    <>
      <div className="page-header">
        <div><h1>Categories</h1><p>Organize your products into categories.</p></div>
        <Link to="/categories/new" className="btn btn-primary"><span className="material-symbols-outlined">add</span>Add Category</Link>
      </div>
      <ErrorBanner message={error} onClose={() => setError('')} />
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Category ID</th><th>Name</th><th>Description</th><th>Primary Product</th><th className="text-center">Actions</th></tr></thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--on-surface-variant)' }}>No categories yet</td></tr>
            ) : categories.map((c) => (
              <tr key={c.id}>
                <td className="font-medium">{c.categoryId}</td>
                <td className="font-medium">{c.categoryName}</td>
                <td className="text-muted">{c.description || '—'}</td>
                <td className="text-muted text-sm">{c.primaryProductId || '—'}</td>
                <td className="text-center">
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                    <Link to={`/categories/${c.id}/edit`} className="icon-btn"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit</span></Link>
                    <button className="icon-btn" onClick={() => setDeleteId(c.id)}><span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--error-red)' }}>delete</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deleteId && <ConfirmDialog title="Delete Category" message="This will permanently remove this category." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
    </>
  );
}
