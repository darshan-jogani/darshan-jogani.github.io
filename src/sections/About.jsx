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
    const ctx = gsap.context(() => {
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
    }, ref.current);
    return () => ctx.revert();
  }, [target]);
  return <><span ref={ref}>0</span><span className="suffix">{suffix}</span></>;
}

export default function About() {
  const trackGlow = (e) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    card.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * 20}deg) rotateY(${(x - 0.5) * 20}deg) scale3d(1.02, 1.02, 1.02)`;
  };
  const resetGlow = (e) => {
    e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <section id="about" className="dark">
      <div className="container">
        <Reveal clip className="section-label"><span className="num">01</span><span>About</span></Reveal>
        <Reveal clip as="h2" className="section-title">Bridging the lab and the <em>industrial deployment</em> of clean hydrogen.</Reveal>

        <div className="about-grid">
          <Reveal className="portrait-wrap">
            <div className="portrait" onMouseMove={trackGlow} onMouseLeave={resetGlow}><div className="portrait-mono">DJ</div></div>
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
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-style: preserve-3d; will-change: transform;
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
          color: #061a14; background: var(--accent); padding: 6px 12px; border-radius: 999px; white-space: nowrap;
          box-shadow: 0 4px 12px color-mix(in oklab, var(--accent) 40%, transparent); }
        .bio p { font-size: 17px; line-height: 1.75; color: var(--bio-text, var(--fg-soft)); margin: 0 0 20px; max-width: 60ch; }
        .bio p strong { color: var(--bio-strong, var(--fg)); font-weight: 600; position: relative; transition: color 0.3s; z-index: 1; display: inline-block; cursor: default; }
        .bio p strong:hover { color: var(--accent); }
        .bio p strong::after { content: ""; position: absolute; left: -2px; right: -2px; bottom: 0; height: 4px; background: color-mix(in oklab, var(--accent) 30%, transparent); z-index: -1; transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s; border-radius: 2px; }
        .bio p strong:hover::after { height: 100%; background: color-mix(in oklab, var(--accent) 15%, transparent); }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 20px; margin: 48px 0 40px; width: 100%; }
        .stat { position: relative; padding: 28px 24px; border-radius: 16px; background: var(--card); border: 1px solid var(--card-bd); overflow: hidden; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .stat::before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at top right, color-mix(in oklab, var(--accent) 15%, transparent), transparent 70%); opacity: 0; transition: opacity 0.4s; pointer-events: none; z-index: 0; }
        .stat > * { position: relative; z-index: 1; }
        .stat:hover { border-color: color-mix(in oklab, var(--accent) 40%, var(--card-bd)); transform: translateY(-6px); box-shadow: 0 16px 32px -16px color-mix(in oklab, var(--accent) 30%, transparent); }
        .stat:hover::before { opacity: 1; }
        .stat .num { font-family: var(--serif); font-size: clamp(32px, 5vw, 48px); line-height: 1; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          color: var(--fg); font-weight: 600; letter-spacing: -.02em; display: inline-flex; align-items: baseline; gap: 4px; font-variant-numeric: tabular-nums; transform-origin: left bottom; }
        .stat:hover .num { color: var(--accent); filter: drop-shadow(0 0 12px color-mix(in oklab, var(--accent) 40%, transparent)); transform: scale(1.05) translateX(2px); }
        .stat .num .suffix { font-size: .55em; color: var(--accent); }
        .stat .label { font-family: var(--mono); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; transition: color 0.3s;
          color: var(--fg-soft); margin-top: 12px; font-weight: 600; }
        .stat:hover .label { color: var(--fg); }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 24px; }
        .chip { padding: 6px 14px; border-radius: 999px; background: var(--bg-alt); border: 1px solid var(--rule-c); color: var(--fg-soft); font-family: var(--mono); font-size: 11px; letter-spacing: 1px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: default; }
        .chip:hover { background: color-mix(in oklab, var(--accent) 10%, transparent); border-color: var(--accent); color: var(--accent); transform: translateY(-4px); box-shadow: 0 6px 12px -4px color-mix(in oklab, var(--accent) 40%, transparent); }

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
