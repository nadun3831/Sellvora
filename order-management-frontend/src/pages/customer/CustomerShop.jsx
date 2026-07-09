import { useState, useEffect } from 'react';
import api from '../../api/axiosClient';
import ErrorBanner from '../../components/ErrorBanner';

export default function CustomerShop({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/products'),
      api.get('/categories')
    ])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.data);
        setCategories(catRes.data);
      })
      .catch((e) => setError(e.message));
  }, []);

  const getCategoryName = (catId) => {
    const cat = categories.find((c) => c.id === catId || c.categoryId === catId);
    return cat ? cat.categoryName : 'Uncategorized';
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.productName.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    if (product.stock <= 0) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stock: p.stock - 1 } : p))
    );
    addToCart(product);
    setSuccessMsg(`Added "${product.productName}" to cart!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Verdant Catalog</h1>
          <p>Browse our handpicked organic and eco-friendly products.</p>
        </div>
      </div>

      <ErrorBanner message={error} onClose={() => setError('')} />
      {successMsg && (
        <div className="success-banner" style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 100, marginBottom: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="filters-bar">
        <div className="filter-search" style={{ maxWidth: 400 }}>
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, width: '100%' }}>
          <button
            className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`btn btn-sm ${selectedCategory === cat.id || selectedCategory === cat.categoryId ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedCategory(cat.id || cat.categoryId)}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-muted" style={{ padding: 40, textAlign: 'center' }}>
          No products match your criteria.
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((p) => {
            const isOutOfStock = p.stock <= 0;
            const isLowStock = p.stock > 0 && p.stock <= 5;
            return (
              <div key={p.id} className="card product-card">
                <span className={`stock-badge ${isOutOfStock ? 'stock-out' : isLowStock ? 'stock-low' : 'stock-in'}`}>
                  {isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${p.stock} left` : 'In Stock'}
                </span>
                <div className="product-img">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span className="material-symbols-outlined">eco</span>
                  )}
                </div>
                <div className="product-info">
                  <span className="product-category">{getCategoryName(p.categoryId)}</span>
                  <h3 className="product-name">{p.productName}</h3>
                  <p className="text-muted text-sm" style={{ marginBottom: 16 }}>{p.description || 'No description available.'}</p>
                  <div className="product-footer">
                    <div className="product-price">${p.price?.toFixed(2)}</div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddToCart(p)}
                      disabled={isOutOfStock}
                    >
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                      {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
