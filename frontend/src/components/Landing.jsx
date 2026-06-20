import Carousel from './Carousel';
import HeroVideo from './HeroVideo';
import { heroStats } from '../data/funnelData';

// PAGE 1 — hero + sample-works carousel + CTA band.
export default function Landing({ onNext }) {
  return (
    <section className="funnel-section" id="page1">
      <div className="hero">
        <h1 className="hero-headline">
          We Turn <em>Memories</em><br />
          Into A Video
        </h1>

        <p className="hero-sub">Cinematic quality. Personal stories. Every moment preserved forever.</p>

        <HeroVideo />

        <button type="button" className="btn-primary" onClick={onNext}>
          <svg viewBox="0 0 18 18" fill="none"><path d="M9 2v14M2 9h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          Book Your Video
        </button>

        <div className="hero-stats">
          {heroStats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <Carousel />

      <div className="cta-band">
        <div>
          <h3>READY TO CAPTURE YOUR STORY?</h3>
          <p>Starting from just ₹799 — Delivered in 48 hours</p>
        </div>
        <button type="button" className="btn-dark" onClick={onNext}>Book Now →</button>
      </div>
      <div style={{ height: '80px' }} />
    </section>
  );
}
