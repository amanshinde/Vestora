import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  {
    stage: '01',
    title: 'INVEST',
    copy: 'Create and manage your investments through one streamlined platform.',
    visualText: 'Capital Allocation Engine',
    subText: 'Automated term execution with zero operational drag.',
  },
  {
    stage: '02',
    title: 'EARN',
    copy: 'Follow daily returns and understand how your portfolio is performing.',
    visualText: 'Daily Yield Distribution',
    subText: 'Precision midnight processing schedules.',
  },
  {
    stage: '03',
    title: 'GROW',
    copy: 'See your earnings accumulate through transparent investment activity.',
    visualText: 'Compounding Trajectory',
    subText: 'Real-time telemetry and ledger auditing.',
  },
  {
    stage: '04',
    title: 'CONNECT',
    copy: 'Build your referral network and understand how your connected ecosystem grows.',
    visualText: '5-Tier Network Synergy',
    subText: 'Connected structural yield propagation.',
  },
];

const GrowthStorySection = ({ reducedMotion }) => {
  const containerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=' + window.innerHeight * 2.5,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const index = Math.min(
            chapters.length - 1,
            Math.floor(progress * chapters.length)
          );
          setActiveIdx(index);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const current = chapters[activeIdx];

  return (
    <section className="growth-chapter" id="story" ref={containerRef}>
      <div className="growth-pin-container">
        {/* Left: Cinematic Abstract Evolving Art Stage */}
        <div className="growth-visual-stage">
          <div className="stage-art" key={current.stage}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#c5a059', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Stage {current.stage}
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', color: '#fbfaf6', margin: '0.5rem 0' }}>
                {current.visualText}
              </div>
              <p style={{ color: '#96969e', fontSize: '0.95rem', maxWidth: '320px', margin: '1rem auto 0' }}>
                {current.subText}
              </p>
              
              {/* Subtle visual geometry indicator */}
              <div style={{ width: '60px', height: '1px', background: '#c5a059', margin: '2.5rem auto 0', opacity: 0.5 }}></div>
            </div>
          </div>
        </div>

        {/* Right: Chapter Information with Vertical Indicator */}
        <div className="growth-info-panel">
          <div className="vertical-indicator">
            {chapters.map((ch, i) => (
              <span key={i} className={`indicator-num ${i === activeIdx ? 'active' : ''}`}>
                {ch.stage}
              </span>
            ))}
          </div>

          <span className="chapter-number">{current.stage}</span>
          <h3 className="chapter-title">{current.title}</h3>
          <p className="chapter-body">{current.copy}</p>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem' }}>
            {chapters.map((_, idx) => (
              <div 
                key={idx} 
                style={{
                  width: idx === activeIdx ? '40px' : '12px',
                  height: '2px',
                  background: idx === activeIdx ? '#c5a059' : 'rgba(255,255,255,0.15)',
                  transition: 'all 0.4s ease'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrowthStorySection;
