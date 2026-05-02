import React, { useEffect, useRef } from 'react';
import Reveal from '../components/Reveal.jsx';
import { skills } from '../data/skills.jsx';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const STATS = [
  { num: 3, suffix: '+', label: 'Years Research' },
  { num: 1, suffix: '', label: 'Patent Pending' },
  { num: 2026, suffix: '', label: 'DECHEMA Speaker' },
];

function StatNum({ target, suffix }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 88%', once: true,
      onEnter: () => {
        gsap.to({ v: 0 }, {
          v: target, duration: target > 100 ? 2 : 1.4, ease: 'power2.out',
          onUpdate() { if (ref.current) ref.current.textContent = Math.floor(this.targets()[0].v); },
        });
      },
    });
  }, [target]);
  return <><span ref={ref}>0</span><span className="suffix">{suffix}</span></>;
}

export default function About() {
  return (
    <section id="about" className="dark">
      <div className="container">
        <Reveal clip className="section-label"><span className="num">01</span><span>About</span></Reveal>
        <Reveal clip as="h2" className="section-title">Bridging the lab and the <em>industrial deployment</em> of clean hydrogen.</Reveal>

        <div className="about-grid">
          <Reveal className="portrait-wrap">
            <div className="portrait"><div className="portrait-mono">DJ</div></div>
            <span className="portrait-tag">Stuttgart · Germany</span>
          </Reveal>
          <div className="bio">
            <Reveal as="p">I'm a doctoral researcher at the <strong>German Aerospace Center (DLR)</strong>, working on next-generation hydrogen production systems. My focus: <strong>alkaline water electrolysis</strong>, process optimization, and the economic viability of sustainable fuel pathways.</Reveal>
            <Reveal as="p">My work sits at the intersection of <strong>electrochemistry</strong>, <strong>process systems engineering</strong>, and <strong>energy system integration</strong> — turning lab-scale results into models, control strategies, and cost analyses that hold up at industrial scale.</Reveal>

            <Reveal className="stats">
              {STATS.map((s, i) => (
                <div className="stat" key={i}>
                  <div className="num"><StatNum target={s.num} suffix={s.suffix} /></div>
                  <div className="label">{s.label}</div>
                </div>
              ))}
            </Reveal>

            <div className="section-label" style={{ marginBottom: 12 }}><span>Toolkit</span></div>
            <Reveal className="skills">
              {skills.map(s => <span className="chip" key={s}>{s}</span>)}
            </Reveal>
          </div>
        </div>
      </div>
      <style>{`
        .about-grid { display: grid; grid-template-columns: 380px 1fr; gap: 80px; align-items: start; margin-top: 60px; }
        @media (max-width: 900px) { .about-grid { grid-template-columns: 1fr; gap: 48px; } }
        .portrait-wrap { position: relative; width: 100%; max-width: 380px; }
        .portrait { position: relative; width: 100%; aspect-ratio: 1; border-radius: 50%;
          background: var(--bg-alt); overflow: hidden; isolation: isolate;
          border: 2px solid color-mix(in oklab, var(--accent) 40%, transparent);
          box-shadow: inset 0 0 40px color-mix(in oklab, var(--accent) 10%, transparent); }
        .portrait::before { content: ""; position: absolute; inset: 0; border-radius: 50%;
          background: linear-gradient(90deg, transparent 49.5%, color-mix(in oklab, var(--accent) 20%, transparent) 50%, transparent 50.5%),
                      linear-gradient(0deg, transparent 49.5%, color-mix(in oklab, var(--accent) 20%, transparent) 50%, transparent 50.5%),
                      repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 18%, color-mix(in oklab, var(--accent) 15%, transparent) 19%, transparent 20%);
          z-index: 1; }
        .portrait::after { content: ""; position: absolute; inset: 0; border-radius: 50%;
          background: conic-gradient(from 0deg, transparent 0deg, transparent 280deg, color-mix(in oklab, var(--accent) 50%, transparent) 359deg, var(--accent) 360deg);
          z-index: 2; animation: rotate 4s linear infinite; }
        @keyframes rotate { to { transform: rotate(360deg); } }
        .portrait-mono { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          font-family: var(--mono); font-weight: 700; font-size: 80px; color: var(--accent);
          letter-spacing: -4px; z-index: 3; text-shadow: 0 0 16px color-mix(in oklab, var(--accent) 50%, transparent); }
        .portrait-tag { position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%);
          font-family: var(--mono); font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
          color: #061a14; background: var(--accent); padding: 6px 12px; border-radius: 999px; white-space: nowrap; }
        .bio p { font-size: 17px; line-height: 1.75; color: var(--bio-text, var(--fg-soft)); margin: 0 0 20px; max-width: 60ch; }
        .bio p strong { color: var(--bio-strong, var(--fg)); font-weight: 600; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin: 48px 0 40px; max-width: 640px; }
        @media (max-width: 600px) { .stats { grid-template-columns: 1fr; } }
        .stat { padding: 24px 0; border-top: 1px solid var(--stat-border, var(--rule-c)); }
        .stat .num { font-family: var(--serif); font-size: clamp(36px, 4vw, 52px); line-height: 1;
          color: var(--fg); font-weight: 500; letter-spacing: -.02em; display: inline-flex; align-items: baseline; gap: 4px; }
        .stat .num .suffix { font-size: .55em; color: var(--accent); }
        .stat .label { font-family: var(--mono); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--fg-soft); margin-top: 12px; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 24px; }

        /* Light Theme Variable Overrides (Applies globally to prevent specificity bugs) */
        html[data-theme="light"] {
          --portrait-bg: linear-gradient(140deg, #e1e6f1, #c8d0e5);
          --portrait-bd: #cdd2dc;
          --portrait-text: rgba(0,0,0,.6);
          --bio-text: #2a3142;
          --bio-strong: var(--section-light-fg, #1a1a2e);
          --stat-border: var(--section-light-rule, #d8dbe2);
        }
      `}</style>
    </section>
  );
}
