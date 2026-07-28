import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = ({ reducedMotion }) => {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleLine1Ref = useRef(null);
  const titleLine2Ref = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollIndRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Cinematic Intro Loading Sequence (~1.8 seconds)
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(bgRef.current, { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1, duration: 1.6 })
        .fromTo(eyebrowRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=1.2')
        .fromTo(
          [titleLine1Ref.current, titleLine2Ref.current],
          { y: '110%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 1, stagger: 0.2, ease: 'power4.out' },
          '-=0.8'
        )
        .fromTo(descRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
        .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
        .fromTo(scrollIndRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.3');

      // 2. Continuous Hero Scroll Transition
      gsap.to(bgRef.current, {
        scale: 1.08,
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('.hero-content', {
        yPercent: -20,
        opacity: 0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: '20% top',
          end: '90% top',
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="hero-chapter" ref={containerRef}>
      {/* Background Abstract Financial Digital Architecture */}
      <div className="hero-background-media" ref={bgRef}>
        <div className="hero-abstract-art">
          <div className="light-thread thread-1"></div>
          <div className="light-thread thread-2"></div>
          <div className="light-thread thread-3"></div>
          <div className="light-thread thread-4"></div>
        </div>
      </div>

      <div className="hero-content">
        <span className="eyebrow" ref={eyebrowRef}>
          The Intelligent Way to Grow
        </span>

        <h1 className="font-display headline-hero">
          <span className="text-mask-wrapper">
            <span className="text-mask-line" ref={titleLine1Ref}>Build wealth.</span>
          </span>
          <span className="text-mask-wrapper">
            <span className="text-mask-line" ref={titleLine2Ref}>Grow together.</span>
          </span>
        </h1>

        <p className="supporting-copy" ref={descRef} style={{ marginTop: '2rem' }}>
          Track investments, monitor daily returns and grow through a connected referral network — all from one intelligent platform.
        </p>

        <div className="hero-ctas" ref={ctaRef}>
          <Link to="/register" className="btn-vestora-primary">
            <span>Start Your Journey</span>
          </Link>
          <a href="#philosophy" className="btn-vestora-secondary">
            <span>Explore Vestora</span>
          </a>
        </div>
      </div>

      <div className="scroll-indicator-wrap" ref={scrollIndRef}>
        <span className="scroll-text">Scroll to Discover</span>
        <div className="scroll-line-track">
          <div className="scroll-line-fill"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
