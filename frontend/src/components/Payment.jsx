import { videoTypes, durations, whatsappNumber } from '../data/funnelData';

// PAGE 3 — order summary (reflects booking). Tapping Pay sends all the booking
// details to the business WhatsApp, then moves to confirmation.
export default function Payment({ booking, onPay }) {
  const { name, phone, typeIdx, durationIdx } = booking;
  const d = durations[durationIdx];
  const customer = name.trim() || 'Arjun Sharma';
  const contact = phone.trim() || '+91 98765 43210';

  // Booking details pre-filled into the WhatsApp message sent to the business.
  const message =
    `🎬 *New Booking — Time To Shoot*\n\n` +
    `👤 Name: ${customer}\n` +
    `📞 Phone: ${contact}\n` +
    `🎀 Video Type: ${videoTypes[typeIdx]}\n` +
    `⏱ Duration: ${d.long}\n` +
    `💰 Amount: ${d.final}`;

  // With a number → opens that chat directly; without → lets the user pick a chat.
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <section className="funnel-section" id="page3">
      <div className="page-header">
        <h2 className="page-title">Review Your <em>Order</em></h2>
        <p className="page-sub">Confirm your details and send your booking on WhatsApp.</p>
      </div>

      <div className="payment-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '560px' }}>
        {/* Order Review */}
        <div className="order-review-card">
          <h3 className="section-title">Order Summary<span /></h3>

          <div className="order-row"><span className="order-key">Customer</span><span className="order-val">{customer}</span></div>
          <div className="order-row"><span className="order-key">Phone</span><span className="order-val">{contact}</span></div>
          <div className="order-row"><span className="order-key">Video Type</span><span className="order-val">{videoTypes[typeIdx]}</span></div>
          <div className="order-row"><span className="order-key">Duration</span><span className="order-val gold">{d.long}</span></div>
          <div className="order-row"><span className="order-key">Original Price</span><span className="order-val strike">{d.original}</span></div>
          <div className="order-row"><span className="order-key">Discount Applied</span><span className="order-val green">{d.saved}</span></div>

          <div className="delivery-note">
            <p>📦 <strong>Estimated Delivery:</strong> 48 hours after booking confirmation</p>
          </div>

          <div className="security-note">🔐 Your details are sent securely to our team on WhatsApp.</div>

          <a
            className="pay-btn"
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onPay()}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" />
              <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
            </svg>
            <span>Pay {d.final} Securely</span>
            <span className="pay-arrow">→</span>
          </a>
        </div>
      </div>

      <div style={{ height: '80px' }} />
    </section>
  );
}
