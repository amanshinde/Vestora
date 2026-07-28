import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const securityItems = [
  {
    num: '01',
    title: 'Secure Authentication',
    body: 'Token-based identity verification managing access across public interfaces and protected member dashboards.',
  },
  {
    num: '02',
    title: 'Protected APIs',
    body: 'Hardened REST architecture utilizing strict schema validation, rate throttling, and authenticated route guards.',
  },
  {
    num: '03',
    title: 'Transaction History',
    body: 'ACID-compliant MongoDB transaction sessions ensuring idempotent ledger entries and zero record corruption.',
  },
  {
    num: '04',
    title: 'Reliable Processing',
    body: 'Automated scheduler execution verified through strict unique compound database indexes.',
  },
];

const SecuritySection = ({ reducedMotion }) => {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, idx) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="security-chapter" id="security" ref={containerRef}>
      <div className="security-container">
        {/* Left Heading */}
        <div>
          <span className="eyebrow">Built with Trust at the Core</span>
          <h2 className="font-display headline-sub">
            Designed around<br />
            clarity, security<br />
            and control.
          </h2>
          <p className="supporting-copy" style={{ marginTop: '1.5rem' }}>
            We rely on factual architectural resilience, strict state immutability, and verified operational protocols.
          </p>
        </div>

        {/* Right Editorial Architecture List */}
        <div className="security-diagram-list">
          {securityItems.map((sec, idx) => (
            <div key={idx} className="security-item" ref={(el) => (itemsRef.current[idx] = el)}>
              <span className="sec-num">{sec.num}</span>
              <div>
                <h3 className="sec-title">{sec.title}</h3>
                <p className="sec-body">{sec.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
