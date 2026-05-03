import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Reveal from '../components/Reveal.jsx';
import Equation from '../components/Equation.jsx';
import { pillars } from '../data/skills.jsx';

function FloatingShape({ position, rotation, type }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.4 + position[0]) * 0.4;
    ref.current.rotation.x = rotation[0] + t * 0.1;
    ref.current.rotation.y = rotation[1] + t * 0.15;
  });
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      {type === 'icosahedron' && <icosahedronGeometry args={[1.2, 0]} />}
      {type === 'torus' && <torusGeometry args={[0.9, 0.25, 16, 64]} />}
      {type === 'octahedron' && <octahedronGeometry args={[1.2, 0]} />}
      <meshBasicMaterial color="#00d4aa" wireframe transparent opacity={0.12} />
    </mesh>
  );
}

function FloatingScene() {
  return (
    <>
      <FloatingShape position={[-4, 1.5, -2]} rotation={[0.2, 0.5, 0]} type="icosahedron" />
      <FloatingShape position={[4, -1, -3]} rotation={[-0.2, -0.4, 0.1]} type="torus" />
      <FloatingShape position={[0, -2.5, -4]} rotation={[0.5, 0.1, 0.2]} type="octahedron" />
    </>
  );
}

const ICONS = {
  bolt: <path d="M13 2L3 14h7v8l10-12h-7z" strokeLinecap="round" strokeLinejoin="round" />,
  chart: <path d="M3 21V3M3 21h18M7 16l4-6 4 3 5-8" strokeLinecap="round" strokeLinejoin="round" />,
  gear: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
};

export default function Research() {
  const tilt = (e) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    card.style.setProperty('--mx', x * 100 + '%');
    card.style.setProperty('--my', y * 100 + '%');
    card.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * 12}deg) rotateY(${(x - 0.5) * 12}deg) scale3d(1.02, 1.02, 1.02)`;
  };
  const reset = (e) => { 
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
  };
  
  const trackGlow = (e) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <section id="research" className="alt" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="res-bg" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
          <FloatingScene />
        </Canvas>
      </div>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <Reveal clip className="section-label"><span className="num">02</span><span>Research</span></Reveal>
        <Reveal clip as="h2" className="section-title">Three <em>pillars</em> of my work — and the <em>equations</em> behind them.</Reveal>
        <Reveal as="p" className="section-intro">From electron transport at the catalyst surface to the levelized cost of hydrogen at the plant gate — same problem, three lenses.</Reveal>

        <div className="pillars">
          {pillars.map(p => (
            <article className="pillar" key={p.n} onMouseMove={tilt} onMouseLeave={reset}>
              <div className="pillar-num">{p.n}</div>
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{ICONS[p.icon]}</svg>
              </div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
              <div className="pillar-tags">
                {p.tags.map(t => <span key={t}>{t}</span>)}
              </div>
            </article>
          ))}
        </div>

        <div className="eq-grid">
          <Reveal className="eq-card" onMouseMove={trackGlow} onMouseLeave={(e) => { e.currentTarget.style.setProperty('--mx', '50%'); e.currentTarget.style.setProperty('--my', '50%'); }}>
            <span className="eq-label">Butler – Volmer</span>
            <Equation tex={"j = j_0 \\left[ \\exp\\!\\left(\\tfrac{\\alpha_a F \\eta}{RT}\\right) - \\exp\\!\\left(-\\tfrac{\\alpha_c F \\eta}{RT}\\right) \\right]"} />
            <p>Charge-transfer kinetics at the electrode surface — sets the activation overpotential of the cell.</p>
          </Reveal>
          <Reveal className="eq-card" onMouseMove={trackGlow} onMouseLeave={(e) => { e.currentTarget.style.setProperty('--mx', '50%'); e.currentTarget.style.setProperty('--my', '50%'); }}>
            <span className="eq-label">Nernst</span>
            <Equation tex={"U_{rev} = U^\\circ - \\frac{RT}{2F}\\ln\\!\\left(\\frac{a_{H_2 O}}{a_{H_2} a_{O_2}^{1/2}}\\right)"} />
            <p>Reversible cell voltage — the thermodynamic floor for water splitting at given T, p.</p>
          </Reveal>
          <Reveal className="eq-card" onMouseMove={trackGlow} onMouseLeave={(e) => { e.currentTarget.style.setProperty('--mx', '50%'); e.currentTarget.style.setProperty('--my', '50%'); }}>
            <span className="eq-label">Faraday Efficiency</span>
            <Equation tex={"\\eta_F = \\frac{n_{H_2,\\,actual}}{n_{H_2,\\,theoretical}} = \\frac{2 F \\dot n_{H_2}}{I}"} />
            <p>Coulombic yield — accounts for parasitic losses and crossover in the cell stack.</p>
          </Reveal>
          <Reveal className="eq-card" onMouseMove={trackGlow} onMouseLeave={(e) => { e.currentTarget.style.setProperty('--mx', '50%'); e.currentTarget.style.setProperty('--my', '50%'); }}>
            <span className="eq-label">LCOH</span>
            <Equation tex={"\\mathrm{LCOH} = \\frac{\\mathrm{FCR}\\cdot\\mathrm{CAPEX} + \\mathrm{OPEX} + c_e \\cdot E}{\\dot m_{H_2}}"} />
            <p>Levelized cost of hydrogen — the bottom line for any Power-to-X business case.</p>
          </Reveal>
        </div>
      </div>

      <style>{`
        .pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; margin-top: 60px; }
        @media (max-width: 900px) { .pillars { grid-template-columns: 1fr; } }
        .pillar { position: relative; padding: 36px 32px; border-radius: var(--radius);
          background: var(--card); border: 1px solid var(--card-bd);
          transition: border-color .3s, transform .3s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-style: preserve-3d; will-change: transform;
          min-height: 280px; display: flex; flex-direction: column; 
          --mx: 50%; --my: 50%; }
        .pillar > * { position: relative; z-index: 2; }
        .pillar::before { content: ""; position: absolute; inset: 0; border-radius: var(--radius);
          background: radial-gradient(400px 200px at var(--mx, 50%) var(--my, 0%), color-mix(in oklab, var(--accent) 12%, transparent), transparent 60%);
          opacity: 0; transition: opacity .3s; pointer-events: none; z-index: 0; }
        .pillar::after { content: ""; position: absolute; inset: -1px; border-radius: calc(var(--radius) + 1px);
          background: radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), var(--accent), transparent 40%);
          opacity: 0; transition: opacity .3s; pointer-events: none; z-index: 1;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude; }
        .pillar:hover::before, .pillar:hover::after { opacity: 1; }
        .pillar:hover { border-color: transparent; }
        .pillar .icon { width: 48px; height: 48px; border-radius: 8px;
          background: var(--teal-soft); color: var(--accent);
          display: flex; align-items: center; justify-content: center; margin-bottom: 24px; 
          transform: translateZ(40px); transition: transform 0.3s; }
        .pillar .icon svg { width: 24px; height: 24px; }
        .pillar h3 { font-family: var(--serif); font-size: 26px; font-weight: 500; line-height: 1.2; margin: 0 0 12px; color: var(--fg); 
          transform: translateZ(30px); transition: transform 0.3s; }
        .pillar p { font-size: 15px; line-height: 1.65; color: var(--fg-soft); margin: 0; 
          transform: translateZ(20px); transition: transform 0.3s; }
        .pillar-num { position: absolute; top: 24px; right: 28px;
          font-family: var(--mono); font-size: 11px; color: var(--fg-soft); letter-spacing: 1px; 
          transform: translateZ(15px); transition: transform 0.3s; }
        .pillar-tags { margin-top: auto; padding-top: 20px; display: flex; flex-wrap: wrap; gap: 6px; 
          transform: translateZ(25px); transition: transform 0.3s; }
        .pillar-tags span { font-family: var(--mono); font-size: 10px; letter-spacing: 1px; text-transform: uppercase;
          padding: 4px 8px; border-radius: 4px;
          background: color-mix(in oklab, var(--fg) 6%, transparent); color: var(--fg-soft); }

        .eq-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 60px; }
        @media (max-width: 800px) { .eq-grid { grid-template-columns: 1fr; } }
        .eq-card { background: var(--card); border: 1px solid var(--card-bd); border-radius: var(--radius); padding: 28px;
          display: flex; flex-direction: column; gap: 14px; position: relative; overflow: hidden;
          transition: all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          --mx: 50%; --my: 50%; }
        .eq-card::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: var(--accent); opacity: 0; transition: opacity 0.3s; z-index: 2; }
        .eq-card::after { content: ""; position: absolute; inset: -1px; border-radius: calc(var(--radius) + 1px);
          background: radial-gradient(400px circle at var(--mx) var(--my), color-mix(in oklab, var(--accent) 80%, transparent), transparent 40%);
          opacity: 0; transition: opacity .3s; pointer-events: none; z-index: 1;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
        .eq-card:hover::before, .eq-card:hover::after { opacity: 1; }
        .eq-card:hover::before { box-shadow: 0 0 20px 2px var(--accent); }
        .eq-card:hover { border-color: color-mix(in oklab, var(--accent) 40%, var(--card-bd)); transform: translateY(-4px) scale(1.01); 
          box-shadow: 0 16px 32px -16px color-mix(in oklab, var(--accent) 30%, transparent); }
        .eq-label { font-family: var(--mono); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); }
        .eq-card p { font-size: 14px; color: var(--fg-soft); margin: 0; line-height: 1.6; }
      `}</style>
    </section>
  );
}
