import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'transparent', border: '1px solid var(--outline-variant)',
          borderRadius: '8px', padding: '8px 16px', fontSize: '13px',
          fontWeight: '600', color: 'var(--on-surface)', cursor: 'pointer',
          marginBottom: '24px', transition: 'all 0.2s'
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
        Back
      </button>

      <div style={{
        background: 'var(--surface-high)', borderRadius: '16px',
        border: '1px solid var(--outline-variant)', padding: '40px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'var(--primary)', color: 'var(--on-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>shield</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--on-surface)', margin: 0 }}>Privacy Policy</h1>
        </div>

        <p className="text-muted" style={{ fontSize: '13px', marginBottom: '28px' }}>Last updated: July 2026</p>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '10px' }}>1. Information We Collect</h2>
          <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: '1.7' }}>
            We collect your email address when you sign in as a customer. For administrators, login credentials are used solely for authentication. We also collect order details, product selections, and cart information to process your transactions.
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '10px' }}>2. How We Use Your Information</h2>
          <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: '1.7' }}>
            Your information is used to process and manage orders, maintain your shopping cart, provide customer support, and improve our services. We do not sell or share your personal information with third parties for marketing purposes.
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '10px' }}>3. Data Storage & Security</h2>
          <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: '1.7' }}>
            Your data is stored securely in our MongoDB database. Cart data is stored locally on your device using browser local storage. We implement industry-standard security measures to protect your information from unauthorized access.
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '10px' }}>4. Your Rights</h2>
          <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: '1.7' }}>
            You have the right to access, update, or delete your personal information at any time. To exercise these rights, please contact our support team through the Help Center.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '10px' }}>5. Contact Us</h2>
          <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: '1.7' }}>
            If you have any questions about this Privacy Policy, please contact us at <strong>support@sellvora.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
