import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DashboardShowcase = ({ reducedMotion }) => {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const labelsRef = useRef([]);

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // Scale and rotate dashboard from floating tilted state into prominent view
      gsap.fromTo(
        frameRef.current,
        {
          scale: 0.8,
          rotateX: 16,
          rotateY: -12,
          opacity: 0.6,
        },
        {
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'top 20%',
            scrub: true,
          },
        }
      );

      // Sequential appearance of floating telemetry labels
      labelsRef.current.forEach((lbl, index) => {
        gsap.fromTo(
          lbl,
          { opacity: 0, scale: 0.8, y: 15 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: frameRef.current,
              start: `top ${65 - index * 10}%`,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="dashboard-chapter" ref={sectionRef}>
      <div className="dashboard-heading-box">
        <span className="eyebrow">Interface Integrity</span>
        <h2 className="font-display headline-sub">
          Everything you earn.<br />
          Everything you grow.<br />
          One view.
        </h2>
      </div>

      <div className="dashboard-showcase-wrapper">
        {/* Sequential Floating Telemetry Labels */}
        <span className="dash-floating-label dash-lbl-1" ref={(el) => (labelsRef.current[0] = el)}>
          Portfolio Value
        </span>
        <span className="dash-floating-label dash-lbl-2" ref={(el) => (labelsRef.current[1] = el)}>
          Daily ROI
        </span>
        <span className="dash-floating-label dash-lbl-3" ref={(el) => (labelsRef.current[2] = el)}>
          Level Income
        </span>
        <span className="dash-floating-label dash-lbl-4" ref={(el) => (labelsRef.current[3] = el)}>
          Wallet Balance
        </span>

        {/* Mockup Frame */}
        <div className="dashboard-mockup-frame" ref={frameRef}>
          <div className="mockup-top-nav">
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em', fontWeight: 600, color: '#fbfaf6' }}>VESTORA TERMINAL</span>
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#10b981' }}>● LIVE TELEMETRY</span>
          </div>

          <div className="mockup-body">
            <div className="mockup-grid">
              <div className="mockup-card">
                <span className="mockup-card-label">Total Portfolio Value</span>
                <span className="mockup-card-value">$142,350.00</span>
                <span className="mockup-card-change">+ $2,135.00 today (1.5%)</span>
              </div>

              <div className="mockup-card">
                <span className="mockup-card-label">Cumulative ROI Generated</span>
                <span className="mockup-card-value">$28,470.50</span>
                <span className="mockup-card-change">Zero-truncation verified</span>
              </div>

              <div className="mockup-card">
                <span className="mockup-card-label">5-Tier Referral Earnings</span>
                <span className="mockup-card-value">$12,890.00</span>
                <span className="mockup-card-change">142 connected network nodes</span>
              </div>

              <div className="mockup-card">
                <span className="mockup-card-label">Active Wallet Balance</span>
                <span className="mockup-card-value">$4,520.00</span>
                <span className="mockup-card-change" style={{ color: '#c5a059' }}>Available for allocation</span>
              </div>
            </div>

            {/* Clean data distribution bar visualization */}
            <div style={{ padding: '1.5rem', background: '#0e0e10', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '1.2rem', color: '#96969e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span>30-Day Growth Distribution</span>
                <span>Idempotent Processing Record</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '110px' }}>
                {[35, 42, 45, 50, 48, 55, 60, 58, 65, 72, 70, 78, 85, 92].map((val, idx) => (
                  <div key={idx} style={{ flex: 1, height: `${val}%`, background: idx === 13 ? '#c5a059' : '#1a1a1f', border: '1px solid rgba(255,255,255,0.08)', transition: 'height 0.3s ease' }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardShowcase;
