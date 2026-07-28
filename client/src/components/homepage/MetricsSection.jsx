import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { num: '01', label: 'Unified Platform' },
  { num: '02', label: 'Income Streams' },
  { num: '05', label: 'Referral Levels' },
  { num: '24/7', label: 'Portfolio Visibility' },
];

const MetricsSection = ({ reducedMotion }) => {
  const containerRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      rowsRef.current.forEach((row, idx) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 88%',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="metrics-chapter" ref={containerRef}>
      <div className="metrics-container">
        {metrics.map((item, index) => (
          <div
            key={index}
            className="metrics-row"
            ref={(el) => (rowsRef.current[index] = el)}
          >
            <span className="metric-number">{item.num}</span>
            <span className="metric-label">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MetricsSection;
