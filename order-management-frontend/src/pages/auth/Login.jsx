import { useState } from 'react';

export default function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('customer'); // 'customer' or 'admin'
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (selectedRole === 'customer') {
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      onLogin('customer', { email });
    } else {
      if (username === 'admin' && password === 'admin') {
        onLogin('admin', {});
      } else {
        setError('Invalid administrator credentials. Try admin/admin.');
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--primary-container) 0%, var(--surface) 100%)',
      padding: '24px'
    }}>
      <div className="card" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '40px',
        boxShadow: 'var(--shadow-lg)',
        borderRadius: '24px',
        background: 'var(--surface-high)',
        border: '1px solid var(--outline-variant)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'var(--primary)',
            color: 'var(--on-primary)',
            marginBottom: '16px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>eco</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--on-surface)' }}>EcoShop Portal</h1>
          <p className="text-muted" style={{ fontSize: '14px', marginTop: '6px' }}>Welcome back. Please choose your portal.</p>
        </div>

        {error && (
          <div className="error-banner" style={{ marginBottom: '20px', borderRadius: 'var(--radius)' }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Tab Selector */}
          <div style={{
            display: 'flex',
            background: 'var(--surface-low)',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '28px',
            border: '1px solid var(--outline-variant)'
          }}>
            <button
              type="button"
              onClick={() => { setSelectedRole('customer'); setError(''); }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                background: selectedRole === 'customer' ? 'var(--primary)' : 'transparent',
                color: selectedRole === 'customer' ? 'var(--on-primary)' : 'var(--on-surface-variant)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shopping_cart</span>
              Customer
            </button>
            <button
              type="button"
              onClick={() => { setSelectedRole('admin'); setError(''); }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                background: selectedRole === 'admin' ? 'var(--primary)' : 'transparent',
                color: selectedRole === 'admin' ? 'var(--on-primary)' : 'var(--on-surface-variant)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>admin_panel_settings</span>
              Admin
            </button>
          </div>

          {selectedRole === 'customer' ? (
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-muted text-xs" style={{ marginTop: '6px' }}>
                We'll use this email to associate your orders and track delivery.
              </p>
            </div>
          ) : (
            <>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {selectedRole === 'customer' ? 'Enter Customer Shop' : 'Authenticate as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
