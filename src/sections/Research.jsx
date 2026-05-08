import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
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

const EQUATIONS = {
  0: [
    { label: 'Butler – Volmer', tex: "j = j_0 \\left[ \\exp\\!\\left(\\tfrac{\\alpha_a F \\eta}{RT}\\right) - \\exp\\!\\left(-\\tfrac{\\alpha_c F \\eta}{RT}\\right) \\right]", desc: "Charge-transfer kinetics at the electrode surface — sets the activation overpotential of the cell." },
    { label: 'Nernst', tex: "U_{rev} = U^\\circ - \\frac{RT}{2F}\\ln\\!\\left(\\frac{a_{H_2 O}}{a_{H_2} a_{O_2}^{1/2}}\\right)", desc: "Reversible cell voltage — the thermodynamic floor for water splitting at given T, p." },
    { label: 'Faraday Efficiency', tex: "\\eta_F = \\frac{2 F \\dot n_{H_2}}{I}", desc: "Coulombic yield — accounts for parasitic losses and crossover in the cell stack." }
  ],
  1: [
    { label: 'LCOH', tex: "\\mathrm{LCOH} = \\frac{\\mathrm{FCR}\\cdot\\mathrm{CAPEX} + \\mathrm{OPEX} + c_e \\cdot E}{\\dot m_{H_2}}", desc: "Levelized cost of hydrogen — the bottom line for any Power-to-X business case." },
    { label: 'Net Present Value', tex: "\\mathrm{NPV} = \\sum_{t=1}^{N} \\frac{R_t}{(1+i)^t} - \\mathrm{CAPEX}", desc: "Determines the profitability of the plant over its project lifetime." }
  ],
  2: [
    { label: 'MPC Objective', tex: "J = \\sum_{k=0}^{N_p-1} \\left( \\|y_{k+1|k} - r_{k+1}\\|_Q^2 + \\|\\Delta u_{k|k}\\|_R^2 \\right)", desc: "Minimizes the tracking error and control effort over the prediction horizon." },
    { label: 'System Dynamics', tex: "x_{k+1} = A x_k + B u_k", desc: "Discrete-time linear state-space model used for predicting future plant states." }
  ]
};

const LAB_LINKS = [
  { to: '/lab#lab-electrolyzer', label: 'Electrolyzer' },
  { to: '/lab#lab-tea', label: 'H2 Cost' },
  { to: '/lab#lab-mpc', label: 'MPC Demo' }
];

export default function Research() {
  const [activeEq, setActiveEq] = useState(null);

  useEffect(() => {
    if (activeEq !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [activeEq]);

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
          {pillars.map((p, i) => (
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
              <div className="pillar-actions">
                <button className="btn-eq" onClick={() => setActiveEq(i)} aria-label="View Equations">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 4H6l6 8-6 8h12"/></svg>
                  Equations
                </button>
                <Link to={LAB_LINKS[i].to} className="btn-lab-link" aria-label={`View Lab ${LAB_LINKS[i].label}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M10 2v7.31"/><path d="M14 9.31V2"/><path d="M8.5 2h7"/><path d="M14 9.31L20.3 21A1 1 0 0 1 19.45 22.5H4.55A1 1 0 0 1 3.7 21L10 9.31"/></svg>
                  {LAB_LINKS[i].label} ↗
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {activeEq !== null && (
        <div className="eq-modal-overlay" onClick={() => setActiveEq(null)}>
          <div className="eq-modal-content" onClick={e => e.stopPropagation()}>
            <button className="eq-modal-close" onClick={() => setActiveEq(null)} aria-label="Close">✕</button>
            <div className="eq-modal-header">
              <span className="eq-modal-eyebrow">Mathematical Formulation</span>
              <h3 className="eq-modal-title">{pillars[activeEq].title}</h3>
            </div>
            <div className="eq-modal-grid">
              {EQUATIONS[activeEq].map((eq, idx) => (
                <div className="eq-card" key={idx} onMouseMove={trackGlow} onMouseLeave={(e) => { e.currentTarget.style.setProperty('--mx', '50%'); e.currentTarget.style.setProperty('--my', '50%'); }}>
                  <span className="eq-label">{eq.label}</span>
                  <Equation tex={eq.tex} />
                  <p>{eq.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
          
        .pillar-actions {
          display: flex; flex-direction: column; gap: 12px; margin-top: 24px;
          transform: translateZ(30px); transition: transform 0.3s;
          position: relative; z-index: 10;
        }
        .btn-eq, .btn-lab-link {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 12px 10px; border-radius: 8px; font-family: var(--mono); font-size: 11px;
          text-transform: uppercase; letter-spacing: 1.2px; font-weight: 600; cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-decoration: none;
          white-space: nowrap;
        }
        .btn-eq {
          background: transparent; color: var(--accent); border: 1px solid color-mix(in oklab, var(--accent) 40%, transparent);
        }
        .btn-eq:hover {
          background: color-mix(in oklab, var(--accent) 10%, transparent); border-color: var(--accent); transform: translateY(-2px);
        }
        .btn-lab-link {
          background: var(--accent); color: #061a14; border: 1px solid var(--accent);
        }
        .btn-lab-link:hover {
          box-shadow: 0 8px 24px -6px color-mix(in oklab, var(--accent) 60%, transparent); transform: translateY(-2px) scale(1.02);
        }
        
        .eq-modal-overlay {
          position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center;
          background: rgba(10, 16, 32, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          padding: clamp(16px, 4vw, 24px); opacity: 0; animation: modal-fade-in 0.3s forwards;
        }
        .eq-modal-content {
          position: relative; background: color-mix(in oklab, var(--bg) 85%, transparent); border: 1px solid color-mix(in oklab, var(--accent) 30%, transparent);
          border-radius: 24px; padding: clamp(24px, 5vw, 40px); width: 100%; max-width: 900px;
          max-height: calc(100vh - 32px); overflow-y: auto;
          transform: translateY(20px) scale(0.98); animation: modal-slide-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          box-shadow: 0 24px 64px -12px rgba(0,0,0,0.6), 0 0 80px -10px color-mix(in oklab, var(--accent) 20%, transparent);
        }
        .eq-modal-content::-webkit-scrollbar { width: 4px; }
        .eq-modal-content::-webkit-scrollbar-track { background: transparent; }
        .eq-modal-content::-webkit-scrollbar-thumb { background: color-mix(in oklab, var(--accent) 50%, transparent); border-radius: 2px; }
        .eq-modal-close {
          position: absolute; top: 24px; right: 24px; background: color-mix(in oklab, var(--fg) 10%, transparent); border: none;
          color: var(--fg); width: 32px; height: 32px; border-radius: 50%; font-size: 14px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.3s;
        }
        .eq-modal-close:hover { background: var(--rose, #ef4444); color: white; transform: rotate(90deg); }
        .eq-modal-header { margin-bottom: 32px; text-align: center; }
        .eq-modal-eyebrow { font-family: var(--mono); font-size: 11px; letter-spacing: 2px; color: var(--accent); text-transform: uppercase; }
        .eq-modal-title { font-family: var(--serif); font-size: clamp(24px, 4vw, 32px); color: var(--fg); margin: 8px 0 0; font-weight: 500; }
        
        .eq-modal-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
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

        @keyframes modal-fade-in { to { opacity: 1; } }
        @keyframes modal-slide-up { to { transform: translateY(0) scale(1); } }
        
        /* Light Theme Overlay Tweaks */
        html[data-theme="light"] .eq-modal-overlay { background: rgba(250, 250, 251, 0.7); }
        html[data-theme="light"] .eq-modal-content { background: rgba(255, 255, 255, 0.95); box-shadow: 0 24px 64px -12px rgba(0,0,0,0.1), 0 0 80px -10px color-mix(in oklab, var(--accent) 20%, transparent); }
        html[data-theme="light"] .btn-lab-link { color: color-mix(in oklab, var(--accent) 45%, black); border-color: color-mix(in oklab, var(--accent) 45%, black); background: transparent; }
        html[data-theme="light"] .btn-lab-link:hover { background: color-mix(in oklab, var(--accent) 45%, black); color: #ffffff; }
        html[data-theme="light"] .eq-modal-close { background: rgba(0,0,0,0.05); color: #0f172a; }
        html[data-theme="light"] .eq-modal-close:hover { background: #ef4444; color: #ffffff; }
      `}</style>
    </section>
  );
}
