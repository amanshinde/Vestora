import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FinalCTA = ({ reducedMotion }) => {
  const chapterRef = useRef(null);
  const titleRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { scale: 0.7, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: chapterRef.current,
            start: 'top 75%',
          },
        }
      );

      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
          },
        }
      );
    }, chapterRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="cta-chapter" ref={chapterRef}>
      <div className="cta-glow-bg" ref={bgRef}></div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '850px' }}>
        <h2 className="font-display headline-sub" ref={titleRef} style={{ marginBottom: '1.5rem' }}>
          Your next chapter<br />of growth starts here.
        </h2>
        <p className="supporting-copy" style={{ margin: '0 auto 3rem', maxWidth: '540px' }}>
          Experience investments, earnings and connected growth through Vestora.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn-vestora-primary">
            <span>Create Your Account</span>
          </Link>
          <Link to="/login" className="btn-vestora-secondary">
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
