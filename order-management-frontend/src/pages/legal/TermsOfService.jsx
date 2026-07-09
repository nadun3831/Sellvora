import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
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
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>gavel</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--on-surface)', margin: 0 }}>Terms of Service</h1>
        </div>

        <p className="text-muted" style={{ fontSize: '13px', marginBottom: '28px' }}>Last updated: July 2026</p>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '10px' }}>1. Acceptance of Terms</h2>
          <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: '1.7' }}>
            By accessing and using Sellvora, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '10px' }}>2. User Accounts</h2>
          <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: '1.7' }}>
            Customers access the platform using their email address. Administrator accounts are restricted to authorized personnel only. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '10px' }}>3. Orders & Payments</h2>
          <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: '1.7' }}>
            All orders placed through the platform are subject to availability and confirmation. A 10% discount is automatically applied to orders exceeding $5,000. Prices are subject to change without prior notice. Stock is deducted in real-time upon adding items to your cart.
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '10px' }}>4. Product Information</h2>
          <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: '1.7' }}>
            We strive to display accurate product descriptions, pricing, and stock availability. However, we do not guarantee that all information is error-free. We reserve the right to correct any errors and update information at any time.
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '10px' }}>5. Limitation of Liability</h2>
          <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: '1.7' }}>
            Sellvora shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform. Our total liability is limited to the amount paid for the specific order in question.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '10px' }}>6. Changes to Terms</h2>
          <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: '1.7' }}>
            We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.
          </p>
        </section>
      </div>
    </div>
  );
}
