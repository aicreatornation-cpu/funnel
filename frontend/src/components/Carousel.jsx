import { useState } from 'react';
import { testimonials, AVATAR_FALLBACK } from '../data/funnelData';
import TestimonialVideo from './TestimonialVideo';

// Coverflow 3D-fan carousel: the active card sits centre/front, the rest fan out
// behind it on each side. Prev/next arrows (and clicking a side card) move focus.
export default function Carousel() {
  const n = testimonials.length;
  const [active, setActive] = useState(Math.floor(n / 2));

  const prev = () => setActive((a) => Math.max(0, a - 1));
  const next = () => setActive((a) => Math.min(n - 1, a + 1));

  // 3D transform per card based on its distance from the active index.
  const styleFor = (i) => {
    const off = i - active;
    const abs = Math.abs(off);
    const sign = Math.sign(off);
    const hidden = abs > 2;
    return {
      transform: `translateX(${off * 150}px) translateZ(${-abs * 130}px) rotateY(${-sign * 24}deg) scale(${abs === 0 ? 1 : 0.85})`,
      zIndex: 100 - abs,
      opacity: hidden ? 0 : 1,
      filter: abs === 0 ? 'none' : `brightness(${1 - Math.min(abs, 2) * 0.2})`,
      pointerEvents: hidden ? 'none' : 'auto',
    };
  };

  return (
    <div className="carousel-section">
      <div className="carousel-header">
        <h2>CLIENT TESTIMONIALS</h2>
      </div>

      <div className="cf-stage">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className={`cf-item${i === active ? ' cf-center' : ''}`}
            style={styleFor(i)}
            onClick={() => i !== active && setActive(i)}
          >
            <div className="tc-card">
              <div className="tc-avatars">
                {t.avatars.map((src, j) => (
                  <img
                    key={j}
                    className="tc-avatar"
                    src={src}
                    alt={t.name}
                    draggable="false"
                    onError={(e) => { e.currentTarget.src = AVATAR_FALLBACK; }}
                  />
                ))}
              </div>

              <div className="tc-badge">
                <div className="tc-name">{t.name}</div>
                <div className="tc-desig">{t.designation}</div>
              </div>

              {t.videoId ? (
                <TestimonialVideo videoId={t.videoId} />
              ) : (
                <div className="tc-video">
                  <div className="tc-play">
                    <svg viewBox="0 0 20 20"><path d="M6 4l12 6-12 6V4z" /></svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="cf-nav">
        <button className="cf-arrow" onClick={prev} disabled={active === 0} aria-label="Previous">
          <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button className="cf-arrow" onClick={next} disabled={active === n - 1} aria-label="Next">
          <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  );
}
