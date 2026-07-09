import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const faqs = [
  {
    question: 'How do I place an order?',
    answer: 'Browse our product catalog on the Shop page, click "Add to Cart" on items you want, then navigate to your Cart to review and submit your order. You will need to select a payment method before confirming.'
  },
  {
    question: 'How does the 10% discount work?',
    answer: 'A 10% discount is automatically applied to any order with a total exceeding $5,000. You don\'t need a coupon code — the discount is calculated and shown at checkout.'
  },
  {
    question: 'How can I track my orders?',
    answer: 'Go to "My Orders" from the sidebar navigation. You\'ll see all your orders along with their current status: Pending, Confirmed, Shipped, or Delivered.'
  },
  {
    question: 'What happens to stock when I add items to my cart?',
    answer: 'Stock is reserved in real-time when you add items to your cart. If you remove items or log out, the stock is automatically restored to ensure a fair shopping experience.'
  },
  {
    question: 'How do I contact support?',
    answer: 'For any issues or inquiries, please email us at support@sellvora.com. We typically respond within 24 hours.'
  },
  {
    question: 'Can I cancel or modify an order?',
    answer: 'Orders in "Pending" status can be modified. Once an order is "Confirmed" or beyond, please contact support for assistance with changes or cancellations.'
  }
];

export default function HelpCenter() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'var(--primary)', color: 'var(--on-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>help</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--on-surface)', margin: 0 }}>Help Center</h1>
        </div>
        <p className="text-muted" style={{ fontSize: '14px', marginBottom: '32px' }}>
          Find answers to frequently asked questions below.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                border: '1px solid var(--outline-variant)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.2s'
              }}
            >
              <button
                onClick={() => toggleFaq(index)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '16px 20px',
                  background: openIndex === index ? 'var(--primary-container)' : 'var(--surface)',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{
                  fontSize: '14px', fontWeight: '600',
                  color: openIndex === index ? 'var(--on-primary-container)' : 'var(--on-surface)'
                }}>
                  {faq.question}
                </span>
                <span className="material-symbols-outlined" style={{
                  fontSize: '20px',
                  color: openIndex === index ? 'var(--on-primary-container)' : 'var(--on-surface-variant)',
                  transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s'
                }}>
                  expand_more
                </span>
              </button>
              {openIndex === index && (
                <div style={{
                  padding: '16px 20px',
                  background: 'var(--surface)',
                  borderTop: '1px solid var(--outline-variant)'
                }}>
                  <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: '1.7', margin: 0 }}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '32px', padding: '24px',
          background: 'var(--surface)', borderRadius: '12px',
          border: '1px solid var(--outline-variant)', textAlign: 'center'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--primary)', marginBottom: '8px' }}>mail</span>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--on-surface)', margin: '8px 0 4px' }}>Still need help?</h3>
          <p style={{ fontSize: '13px', color: 'var(--on-surface-variant)', margin: 0 }}>
            Contact us at <strong>support@sellvora.com</strong> and we'll get back to you within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
