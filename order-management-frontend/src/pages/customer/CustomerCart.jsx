import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import ErrorBanner from '../../components/ErrorBanner';

export default function CustomerCart({ cart, updateCartQty, removeFromCart, clearCart }) {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [email, setEmail] = useState(localStorage.getItem('customerEmail') || '');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/payment-methods')
      .then((res) => {
        setPayments(res.data);
        if (res.data.length > 0) {
          setSelectedPayment(res.data[0].id || res.data[0].paymentId);
        }
      })
      .catch((e) => setError(e.message));
  }, []);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const eligibleForDiscount = subtotal > 5000;
  const discount = eligibleForDiscount ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if (!email) {
      setError('Email is required.');
      return;
    }
    if (!selectedPayment) {
      setError('Please select a payment method.');
      return;
    }

    setLoading(true);
    setError('');

    // Flat list of product IDs matching quantities
    const productIds = [];
    cart.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        productIds.push(item.product.id || item.product.productId);
      }
    });

    const orderData = {
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customerEmail: email,
      productIds: productIds,
      paymentMethodIds: [selectedPayment],
      status: 'PENDING'
    };

    api.post('/orders', orderData)
      .then((res) => {
        // Save email for convenience
        localStorage.setItem('customerEmail', email);
        clearCart(true);
        navigate(`/orders/${res.data.id}`);
      })
      .catch((err) => {
        setError(err.message || 'Checkout failed.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Shopping Cart</h1>
          <p>Review items and check out.</p>
        </div>
      </div>

      <ErrorBanner message={error} onClose={() => setError('')} />

      {cart.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--outline-variant)', marginBottom: 16 }}>shopping_cart_off</span>
          <p className="text-muted" style={{ marginBottom: 20 }}>Your cart is currently empty.</p>
          <Link to="/" className="btn btn-primary">Go to Catalog</Link>
        </div>
      ) : (
        <div className="grid-3">
          {/* Cart items list */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Items in Cart</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.product.id}>
                    <td>
                      <div className="font-semibold">{item.product.productName}</div>
                      <div className="text-xs text-muted" style={{ marginTop: 2 }}>Unit Price: ${item.product.price?.toFixed(2)}</div>
                    </td>
                    <td className="text-center">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 8px' }}
                          onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span style={{ minWidth: 24, display: 'inline-block', fontWeight: 600 }}>{item.quantity}</span>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 8px' }}
                          onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-right font-medium">${item.product.price?.toFixed(2)}</td>
                    <td className="text-right font-bold">${(item.product.price * item.quantity).toFixed(2)}</td>
                    <td className="text-right">
                      <button
                        className="icon-btn"
                        style={{ color: 'var(--error-red)' }}
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Checkout sidebar */}
          <div className="card" style={{ padding: 24, height: 'fit-content' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Order Summary</h3>
            
            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--outline-variant)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span className="text-muted">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {eligibleForDiscount && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--status-delivered)', fontWeight: 600 }}>
                  <span>10% Order Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, paddingTop: 4 }}>
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
              {eligibleForDiscount && (
                <p className="text-xs text-muted" style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--status-delivered)' }}>sell</span>
                  10% discount applied for orders above $5000!
                </p>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleCheckout}>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method *</label>
                {payments.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span className="text-xs text-muted">No payment methods found.</span>
                    <Link to="/payments/new" className="btn btn-outline btn-sm text-center" style={{ display: 'block' }}>
                      Add Payment Method
                    </Link>
                  </div>
                ) : (
                  <select
                    className="form-select"
                    value={selectedPayment}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    required
                  >
                    {payments.map((p) => (
                      <option key={p.id} value={p.id || p.paymentId}>
                        {p.paymentType} ({p.accountNumber ? `*${p.accountNumber.slice(-4)}` : 'No Acct'})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
                disabled={loading || cart.length === 0 || !selectedPayment}
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
