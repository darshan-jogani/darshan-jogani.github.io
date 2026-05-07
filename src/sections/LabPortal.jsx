import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Bubbles from '../components/Bubbles.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function LabPortal() {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const bodyRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Breathing ambient background — cycles between two deep navy tones
    el.style.setProperty('--lp-glow', '0.25');
    const breathe = gsap.to(el, {
      '--lp-glow': 0.55,
      duration: 6,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    // Scroll-entry stagger animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 70%',
          once: true,
        },
      });
      tl.from(eyebrowRef.current, { y: 20, opacity: 0, duration: 0.6, ease: 'expo.out' })
        .from('.lp-word', { y: 60, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out' }, '-=0.3')
        .from(bodyRef.current, { y: 20, opacity: 0, duration: 0.6, ease: 'expo.out' }, '-=0.4')
        .from(btnRef.current, { scale: 0.9, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.3');
    }, el);

    return () => {
      breathe.kill();
      ctx.revert();
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    sectionRef.current.style.setProperty('--mouse-x', `${x}px`);
    sectionRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
      <section ref={sectionRef} id="lab-portal" className="lab-portal" onMouseMove={handleMouseMove}>
      {/* Particle canvas — lives behind the text at reduced opacity */}
      <div className="lp-canvas" aria-hidden="true">
        <Canvas camera={{ position: [0, 0, 9], fov: 45 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.3} />
          <Bubbles count={160} />
        </Canvas>
      </div>

      <div className="lp-inner">
        <div ref={eyebrowRef} className="lp-eyebrow">// research.lab</div>
        <h2 className="lp-heading">
          <span className="lp-word">Explore</span>{' '}
          <span className="lp-word"><em>the</em></span>{' '}
          <span className="lp-word">models.</span>
        </h2>
        <p ref={bodyRef} className="lp-body">
          Interactive simulations built from the research.<br />
          Semi-empirical, educational, and open to exploration.
        </p>
        <Link ref={btnRef} to="/lab" className="lp-cta">
          Enter the Research Lab →
        </Link>
      </div>

      <style>{`
        .lab-portal {
          position: relative;
          min-height: 70vh;
          background: var(--navy);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: background 0.4s ease;
        }
        .lab-portal::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), #1e2d5c, transparent 70%);
          opacity: var(--lp-glow, 0.25);
          z-index: 1;
          pointer-events: none;
          transition: background 0.4s ease;
        }
        .lp-canvas {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0.35;
        }
        .lp-inner {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 720px;
          padding: 0 var(--pad);
        }
        .lp-eyebrow {
          font-family: var(--mono);
          font-size: 12px;
          letter-spacing: 2.5px;
          color: var(--accent);
          margin-bottom: 28px;
          text-transform: lowercase;
        }
        .lp-heading {
          font-family: var(--serif);
          font-size: clamp(44px, 8vw, 88px);
          font-weight: 500;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin: 0 0 28px;
          // color: var(--ink);
          color: #ffffff;
          text-shadow: 0 4px 24px rgba(0,0,0,0.5);
          transition: color 0.4s ease, text-shadow 0.4s ease;
        }
        .lp-heading em {
          font-style: italic;
          background: linear-gradient(120deg, var(--accent) 0%, var(--accent-2) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .lp-word { display: inline-block; }
        .lp-body {
          font-size: clamp(16px, 1.4vw, 19px);
          color: var(--muted);
          line-height: 1.7;
          margin: 0 0 40px;
          transition: color 0.4s ease;
        }
        .lp-cta {
          display: inline-block;
          font-family: var(--mono);
          font-size: 13px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 16px 36px;
          border-radius: 999px;
          border: 1px solid var(--accent);
          color: var(--accent);
          background: transparent;
          text-decoration: none;
          transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
        .lp-cta:hover {
          background: var(--accent);
          color: #061a14;
          transform: scale(1.04);
          box-shadow: 0 0 32px -8px var(--accent);
        }
        /* Light Theme Adjustments */
        html[data-theme="light"] .lab-portal {
          background: #e2e8f0;
        }
        html[data-theme="light"] .lab-portal::before {
          background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), #ffffff, transparent 70%);
        }
        html[data-theme="light"] .lp-heading {
          color: #0f172a;
          text-shadow: 0 4px 24px rgba(255,255,255,0.8);
        }
        html[data-theme="light"] .lp-body {
          color: #475569;
        }
      `}</style>
    </section>
  );
}