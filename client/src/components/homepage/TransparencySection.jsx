import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ledgerDays = [
  {
    day: 'TODAY',
    items: [
      { desc: 'Daily ROI Processing', sub: 'Starter & Growth Allocations', amount: '+ $120.00' },
      { desc: 'Level Income Credit', sub: 'Tier 2 Network Activity', amount: '+ $35.00' },
    ],
  },
  {
    day: 'YESTERDAY',
    items: [
      { desc: 'Daily ROI Processing', sub: 'Starter & Growth Allocations', amount: '+ $120.00' },
      { desc: 'Capital Term Allocation', sub: 'Growth Term initialized', amount: '- $5,000.00', isDebit: true },
      { desc: 'Level Income Credit', sub: 'Tier 1 Direct Activity', amount: '+ $75.00' },
    ],
  },
];

const TransparencySection = ({ reducedMotion }) => {
  const containerRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      rowsRef.current.forEach((row, idx) => {
        gsap.fromTo(
          row,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 85%',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  let rowCounter = 0;

  return (
    <section className="transparency-chapter" ref={containerRef}>
      <div className="transparency-container">
        {/* Left Info */}
        <div>
          <span className="eyebrow">Clarity by Design</span>
          <h2 className="font-display headline-sub">
            Every movement.<br />
            Accounted for.
          </h2>
          <p className="supporting-copy" style={{ marginTop: '1.5rem' }}>
            From automated daily ROI calculations to hierarchical referral credits, Vestora presents your financial history with uncompromising ledger clarity.
          </p>
        </div>

        {/* Right Flowing Ledger Stream */}
        <div className="ledger-stream">
          {ledgerDays.map((group, gIdx) => (
            <div key={gIdx} className="ledger-day-group">
              <span className="ledger-date-badge">{group.day}</span>
              {group.items.map((item, idx) => {
                const currentIndex = rowCounter++;
                return (
                  <div
                    key={idx}
                    className="ledger-row"
                    ref={(el) => (rowsRef.current[currentIndex] = el)}
                  >
                    <div>
                      <div className="ledger-desc-title">{item.desc}</div>
                      <div className="ledger-desc-sub">{item.sub}</div>
                    </div>
                    <span className="ledger-amount" style={item.isDebit ? { color: '#96969e' } : {}}>
                      {item.amount}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransparencySection;
