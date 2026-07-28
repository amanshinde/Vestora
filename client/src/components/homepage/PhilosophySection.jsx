import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PhilosophySection = ({ reducedMotion }) => {
  const sectionRef = useRef(null);
  const textLinesRef = useRef([]);
  const descRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      textLinesRef.current.forEach((line, idx) => {
        gsap.fromTo(
          line,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 85%',
              end: 'top 60%',
              scrub: 1,
            },
          }
        );
      });

      gsap.fromTo(
        descRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: descRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="philosophy-chapter" id="philosophy" ref={sectionRef}>
      <div className="philosophy-container">
        <span className="eyebrow">A New Perspective on Growth</span>

        <h2 className="philosophy-statement">
          <span ref={(el) => (textLinesRef.current[0] = el)}>Your investments should</span>
          <span ref={(el) => (textLinesRef.current[1] = el)} className="statement-accent">work as intelligently</span>
          <span ref={(el) => (textLinesRef.current[2] = el)}>as you do.</span>
        </h2>

        <p className="supporting-copy" ref={descRef}>
          Vestora brings investments, returns, wallet activity and network growth into one clear experience.
        </p>
      </div>
    </section>
  );
};

export default PhilosophySection;
