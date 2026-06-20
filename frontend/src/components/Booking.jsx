import { useRef } from 'react';
import { videoTypes, durations, sliderPositions } from '../data/funnelData';

// PAGE 2 — details form + video type + duration picker (chips + visual slider).
// All selections live in App's `booking` state so Payment/Confirm reflect them.
export default function Booking({ booking, update, errors = {}, clearError, onProceed }) {
  const { name, phone, typeIdx, durationIdx } = booking;
  const d = durations[durationIdx];
  const pos = sliderPositions[durationIdx];

  // Drag the slider thumb (touch + mouse) — snaps to the nearest duration.
  const trackRef = useRef(null);
  const draggingRef = useRef(false);
  const idxRef = useRef(durationIdx);
  idxRef.current = durationIdx;

  const setFromX = (clientX) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const idx = Math.round(frac * (durations.length - 1));
    if (idx !== idxRef.current) update({ durationIdx: idx });
  };

  const onPointerDown = (e) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setFromX(e.clientX);
  };
  const onPointerMove = (e) => {
    if (draggingRef.current) setFromX(e.clientX);
  };
  const endDrag = (e) => {
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  return (
    <section className="funnel-section" id="page2">
      <div className="page-header">
        <h2 className="page-title">Book Your <em>Video</em></h2>
        <p className="page-sub">Tell us about your moment and choose your duration.</p>
      </div>

      <div className="booking-grid">
        {/* Left: Personal Info */}
        <div className="card-panel">
          <h3>Your Details</h3>

          <div className="form-group">
            <label className="form-label">Full Name <span className="req">*</span></label>
            <input className={`form-input${errors.name ? ' invalid' : ''}`} type="text" placeholder="e.g. Arjun Sharma"
              value={name} onChange={(e) => { update({ name: e.target.value }); clearError?.('name'); }} />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number <span className="req">*</span></label>
            <input className={`form-input${errors.phone ? ' invalid' : ''}`} type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile number"
              value={phone} onChange={(e) => { update({ phone: e.target.value.replace(/\D/g, '').slice(0, 10) }); clearError?.('phone'); }} />
            {errors.phone && <div className="field-error">{errors.phone}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Video Type</label>
            <div className="type-grid">
              {videoTypes.map((t, i) => (
                <div key={t} className={`type-chip${typeIdx === i ? ' selected' : ''}`}
                  onClick={() => update({ typeIdx: i })}>{t}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Duration Picker */}
        <div className="card-panel">
          <h3>Choose Duration</h3>

          <div className="duration-chips">
            {durations.map((dur, i) => (
              <div key={dur.label} className={`dur-chip${durationIdx === i ? ' active' : ''}`}
                onClick={() => update({ durationIdx: i })}>{dur.label}</div>
            ))}
          </div>

          {/* Slider Visual */}
          <div style={{ marginBottom: '24px' }}>
            <div className="slider-labels">
              {durations.map((dur, i) => (
                <span key={dur.short} className={`slider-label${durationIdx === i ? ' active' : ''}`}>{dur.short}</span>
              ))}
            </div>
            <div
              className="slider-track"
              ref={trackRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              <div className="slider-fill" style={{ width: `${pos}%` }} />
              <div className="slider-thumb" style={{ left: `${pos}%` }} />
            </div>
            <div className="slider-stops">
              {durations.map((dur, i) => (
                <div key={dur.label}
                  className={`slider-stop${durationIdx === i ? ' active' : ''}${i < durationIdx ? ' passed' : ''}`}
                  onClick={() => update({ durationIdx: i })} />
              ))}
            </div>
          </div>

          {/* Price Display */}
          <div className="price-display">
            <div className="price-col">
              <div className="price-label">Original</div>
              <div className="price-original">{d.original}</div>
            </div>
            <div className="price-divider" />
            <div className="price-col">
              <div className="price-label">Discount</div>
              <div className="price-discount">{d.discount}</div>
            </div>
            <div className="price-divider" />
            <div className="price-col">
              <div className="price-label">You Pay</div>
              <div className="price-final">{d.final}</div>
            </div>
          </div>
        </div>

        {/* Proceed Button */}
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', paddingTop: '8px' }}>
          <button type="button" className="btn-primary" style={{ fontSize: '16px', padding: '18px 56px' }} onClick={onProceed}>
            Proceed to Payment →
          </button>
          <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--grey)' }}>🔒 Secure checkout — Your data is safe with us</p>
        </div>
      </div>

      <div style={{ height: '80px' }} />
    </section>
  );
}
