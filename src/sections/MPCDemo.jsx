import React, { useState, useMemo, useRef, useEffect } from 'react';
import Reveal from '../components/Reveal.jsx'; 
import { simulateMPC } from '../lib/mpc-model.jsx';

export default function MPCDemo() {
  const [horizon, setHorizon] = useState(12);
  const [Q, setQ] = useState(1.0);
  const [Rc, setRc] = useState(0.05);
  const [running, setRunning] = useState(true);
  const [seed, setSeed] = useState(0); 
  const [hoveredLine, setHoveredLine] = useState(null);

  const sim = useMemo(() => simulateMPC({ horizon, Q, Rc }), [horizon, Q, Rc, seed]);
  const W = 800, H = 320, P = 40;
  const xs = i => P + (i / (sim.y.length - 1)) * (W - 2 * P);
  const ys = v => H - P - (v / 110) * (H - 2 * P);

  const yPathRef = useRef(null);
  const uPathRef = useRef(null);
  const dotRef = useRef(null);
  const kRef = useRef(0);

  // Reset animation step when simulation parameters change
  useEffect(() => {
    kRef.current = 0;
  }, [sim]);

  useEffect(() => {
    if (!running) return;
    let id;
    let last = 0;
    const loop = (t) => {
      // Throttle updates to roughly 30fps to control simulation speed
      if (t - last > 33) { 
        kRef.current = (kRef.current + 1) % sim.y.length; 
        last = t; 
        
        // Bypass React and manipulate the DOM directly for lag-free performance
        if (yPathRef.current) yPathRef.current.setAttribute('d', sim.y.slice(0, kRef.current + 1).map((v, i) => (i ? 'L' : 'M') + xs(i) + ' ' + ys(v)).join(' '));
        if (uPathRef.current) uPathRef.current.setAttribute('d', sim.u.slice(0, kRef.current + 1).map((v, i) => (i ? 'L' : 'M') + xs(i) + ' ' + ys(v)).join(' '));
        if (dotRef.current) {
          dotRef.current.setAttribute('cx', xs(kRef.current));
          dotRef.current.setAttribute('cy', ys(sim.y[kRef.current] || 0));
        }
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [sim, running]);

  const spPath = useMemo(() => sim.sp.map((v, i) => (i ? 'L' : 'M') + xs(i) + ' ' + ys(v)).join(' '), [sim]);

  return (
    <section id="mpc" className="dark">
      <div className="container">
        <Reveal clip className="section-label"><span className="num">05</span><span>Model Predictive Control</span></Reveal>
        <Reveal clip as="h2" className="section-title">A receding-horizon controller, <em>live</em>.</Reveal>
        <Reveal as="p" className="section-intro">A 1st-order plant under MPC control. The controller looks ahead {horizon} steps, balances tracking error (Q) against control effort (R), and rejects a step disturbance. Adjust the weights and watch the closed-loop response change.</Reveal>

        <div className="mpc-grid">
          <Reveal className="card mpc-canvas">
            <svg viewBox={`0 0 ${W} ${H}`} className="mpc-svg" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.15" />
                </pattern>
                <linearGradient id="y-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor={hoveredLine === 'y' || !hoveredLine ? 'var(--accent)' : 'var(--accent-2)'} />
                </linearGradient>
                <linearGradient id="u-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--amber, #f59e0b)" />
                  <stop offset="100%" stopColor={hoveredLine === 'u' || !hoveredLine ? 'var(--amber, #f59e0b)' : 'var(--accent-2)'} />
                </linearGradient>
              </defs>
              <rect width={W} height={H} fill="url(#dot-grid)" />
              <g stroke="currentColor" strokeOpacity=".1">
                {[0, 25, 50, 75, 100].map(v => (
                  <g key={v}>
                    <line x1={P} x2={W - P} y1={ys(v)} y2={ys(v)} />
                    <text x={P - 8} y={ys(v) + 4} textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="currentColor" fillOpacity=".4">{v}</text>
                  </g>
                ))}
              </g>
              <path d={spPath} stroke="var(--accent-2)" strokeWidth="2" fill="none" strokeDasharray="6 4" opacity={hoveredLine && hoveredLine !== 'sp' ? 0.3 : 0.7} style={{ transition: 'opacity 0.3s' }} />
              <path ref={uPathRef} d={sim.u.slice(0, kRef.current + 1).map((v, i) => (i ? 'L' : 'M') + xs(i) + ' ' + ys(v)).join(' ')} stroke="url(#u-grad)" strokeWidth="2" fill="none" opacity={hoveredLine && hoveredLine !== 'u' ? 0.3 : 1} style={{ transition: 'opacity 0.3s' }} />
              <path ref={yPathRef} d={sim.y.slice(0, kRef.current + 1).map((v, i) => (i ? 'L' : 'M') + xs(i) + ' ' + ys(v)).join(' ')} stroke="url(#y-grad)" strokeWidth="3" fill="none" filter="url(#glow)" opacity={hoveredLine && hoveredLine !== 'y' ? 0.3 : 1} style={{ transition: 'opacity 0.3s' }} />
              <circle ref={dotRef} cx={xs(kRef.current)} cy={ys(sim.y[kRef.current] || 0)} r="6" fill="var(--accent)" stroke="var(--bg)" strokeWidth="2" className="mpc-dot" />
              <g fontFamily="JetBrains Mono, monospace" fontSize="11" fill="currentColor">
                <text x={W - P} y={20} textAnchor="end" fillOpacity=".7">stack load %</text>
                <g transform={`translate(${P}, ${H - 8})`}>
                  <text fontSize="10" fillOpacity=".5">t →</text>
                </g>
              </g>
              <g transform="translate(60, 30)" fontFamily="JetBrains Mono, monospace" fontSize="10" className="legend">
                <g className="legend-item" onMouseEnter={() => setHoveredLine('y')} onMouseLeave={() => setHoveredLine(null)}>
                  <rect width="24" height="20" y="-4" fill="transparent" /><rect width="14" height="3" y="5" fill="var(--accent)"/><text x="20" y="10" fill="currentColor">y (output)</text>
                </g>
                <g className="legend-item" transform="translate(0, 18)" onMouseEnter={() => setHoveredLine('sp')} onMouseLeave={() => setHoveredLine(null)}>
                  <rect width="24" height="20" y="-4" fill="transparent" /><rect width="14" height="3" y="5" fill="var(--accent-2)"/><text x="20" y="10" fill="currentColor">setpoint</text>
                </g>
                <g className="legend-item" transform="translate(0, 36)" onMouseEnter={() => setHoveredLine('u')} onMouseLeave={() => setHoveredLine(null)}>
                  <rect width="24" height="20" y="-4" fill="transparent" /><rect width="14" height="3" y="5" fill="#f59e0b"/><text x="20" y="10" fill="currentColor">u (control)</text>
                </g>
              </g>
            </svg>
          </Reveal>
          <div className="mpc-controls">
            <Reveal className="card panel">
              <h4>Horizon (N)</h4>
              <div className="slider-row">
                <input className="slider" type="range" min="3" max="30" value={horizon} onChange={e => setHorizon(+e.target.value)}/>
                <span className="val">{horizon}</span>
              </div>
            </Reveal>
            <Reveal className="card panel">
              <h4>Tracking Weight (Q)</h4>
              <div className="slider-row">
                <input className="slider" type="range" min="0.1" max="3" step="0.1" value={Q} onChange={e => setQ(+e.target.value)}/>
                <span className="val">{Q.toFixed(1)}</span>
              </div>
            </Reveal>
            <Reveal className="card panel">
              <h4>Control Weight (R)</h4>
              <div className="slider-row">
                <input className="slider" type="range" min="0.01" max="1" step="0.01" value={Rc} onChange={e => setRc(+e.target.value)}/>
                <span className="val">{Rc.toFixed(2)}</span>
              </div>
            </Reveal>
            <Reveal className="card panel">
              <h4>Simulation</h4>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Play'}</button>
                <button className="btn" onClick={() => { setSeed(s => s + 1); kRef.current = 0; }}>Reset</button>
              </div>
              <div className="small mono" style={{ marginTop: 14, color: 'var(--fg-soft)' }}>
                Step disturbance at t=90 · setpoint change at t=130
              </div>
            </Reveal>
          </div>
        </div>
      </div>
      <style>{`
        .mpc-grid { display: grid; grid-template-columns: 1fr 280px; gap: 28px; margin-top: 60px; align-items: stretch; }
        @media (max-width: 1000px) { .mpc-grid { grid-template-columns: 1fr; } .mpc-controls { display: grid; grid-template-columns: 1fr 1fr; } }
        @media (max-width: 600px) { .mpc-controls { grid-template-columns: 1fr; } }
        .mpc-canvas { padding: 24px; color: var(--fg); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .mpc-canvas::before { content: ""; position: absolute; inset: 0;
          background: radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--accent) 5%, transparent), transparent 70%);
          opacity: 0.5; pointer-events: none; animation: bg-spin 20s linear infinite; }
        @keyframes bg-spin { to { transform: rotate(360deg); } }
        .mpc-svg { width: 100%; height: 100%; max-height: 420px; display: block; }
        .mpc-dot { animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { filter: drop-shadow(0 0 3px var(--accent)); } 50% { filter: drop-shadow(0 0 8px var(--accent)); } }
        .legend .legend-item { cursor: pointer; transition: opacity 0.3s; }
        .legend:hover .legend-item:not(:hover) { opacity: 0.4; }
        .mpc-controls { display: flex; flex-direction: column; gap: 14px; }
        .small { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; }
      `}</style>
    </section>
  );
}
