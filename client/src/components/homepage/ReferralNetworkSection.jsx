import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ReferralNetworkSection = ({ reducedMotion }) => {
  const containerRef = useRef(null);
  const nodeRootsRef = useRef([]);

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      nodeRootsRef.current.forEach((el, index) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="network-chapter" id="network" ref={containerRef}>
      <div className="network-header">
        <span className="eyebrow">Connected Growth</span>
        <h2 className="font-display headline-sub">
          Growth is stronger<br />when it's connected.
        </h2>
        <p className="supporting-copy" style={{ margin: '1.5rem auto 0' }}>
          Our multi-tier synergy propagates returns naturally across up to five hierarchical levels whenever connected capital accumulates yield.
        </p>
      </div>

      <div className="network-tree-stage">
        {/* Central User Node */}
        <div className="tree-level" ref={(el) => (nodeRootsRef.current[0] = el)}>
          <div className="node-card node-root">
            <span className="node-dot"></span>
            <div className="node-info">
              <span className="node-title">Your Account</span>
              <span className="node-sub">Root Node (Level 0)</span>
            </div>
          </div>
        </div>

        {/* Level 01 */}
        <div className="tree-level" ref={(el) => (nodeRootsRef.current[1] = el)} style={{ marginTop: '1.5rem' }}>
          <div className="tree-connector"></div>
          <div className="node-card node-active">
            <span className="node-dot"></span>
            <div className="node-info">
              <span className="node-title">Level 01 Connects</span>
              <span className="node-sub">Direct Partner Yield</span>
            </div>
          </div>
          <div className="node-card node-active">
            <span className="node-dot"></span>
            <div className="node-info">
              <span className="node-title">Level 01 Connects</span>
              <span className="node-sub">Direct Partner Yield</span>
            </div>
          </div>
        </div>

        {/* Level 02 */}
        <div className="tree-level" ref={(el) => (nodeRootsRef.current[2] = el)} style={{ marginTop: '1.5rem' }}>
          <div className="tree-connector"></div>
          <div className="node-card">
            <span className="node-dot"></span>
            <div className="node-info">
              <span className="node-title">Level 02 Ecosystem</span>
              <span className="node-sub">Secondary Network Tier</span>
            </div>
          </div>
          <div className="node-card">
            <span className="node-dot"></span>
            <div className="node-info">
              <span className="node-title">Level 02 Ecosystem</span>
              <span className="node-sub">Secondary Network Tier</span>
            </div>
          </div>
          <div className="node-card">
            <span className="node-dot"></span>
            <div className="node-info">
              <span className="node-title">Level 02 Ecosystem</span>
              <span className="node-sub">Secondary Network Tier</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferralNetworkSection;
