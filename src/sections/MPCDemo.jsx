import React, { useState, useMemo, useRef, useEffect } from 'react';
import Reveal from '../components/Reveal.jsx';
import { simulateMPC } from '../lib/mpc-model.jsx';

export default function MPCDemo() {
  const [horizon, setHorizon] = useState(12);
  const [Q, setQ] = useState(1.0);
  const [Rc, setRc] = useState(0.05);
  const [running, setRunning] = useState(true);
  const [seed, setSeed] = useState(0);

  const sim = useMemo(() => simulateMPC({ horizon, Q, Rc }), [horizon, Q, Rc, seed]);
  const W = 800, H = 320, P = 40;
  const xs = i => P + (i / (sim.y.length - 1)) * (W - 2 * P);
  const ys = v => H - P - (v / 110) * (H - 2 * P);

  const [k, setK] = useState(0);
  useEffect(() => {
    if (!running) return;
    let id;
    const tick = () => {
      setK(prev => (prev + 1) % sim.y.length);
      id = requestAnimationFrame(tick);
    };
    let last = 0;
    const loop = (t) => {
      if (t - last > 30) { setK(prev => (prev + 1) % sim.y.length); last = t; }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [sim, running]);

  const yPath = sim.y.slice(0, k + 1).map((v, i) => (i ? 'L' : 'M') + xs(i) + ' ' + ys(v)).join(' ');
  const spPath = sim.sp.map((v, i) => (i ? 'L' : 'M') + xs(i) + ' ' + ys(v)).join(' ');
  const uPath = sim.u.slice(0, k + 1).map((v, i) => (i ? 'L' : 'M') + xs(i) + ' ' + ys(v)).join(' ');

  return (
    <section id="mpc" className="dark">
      <div className="container">
        <Reveal clip className="section-label"><span className="num">05</span><span>Model Predictive Control</span></Reveal>
        <Reveal clip as="h2" className="section-title">A receding-horizon controller, <em>live</em>.</Reveal>
        <Reveal as="p" className="section-intro">A 1st-order plant under MPC control. The controller looks ahead {horizon} steps, balances tracking error (Q) against control effort (R), and rejects a step disturbance. Adjust the weights and watch the closed-loop response change.</Reveal>

        <div className="mpc-grid">
          <Reveal className="card mpc-canvas">
            <svg viewBox={`0 0 ${W} ${H}`} className="mpc-svg">
              <g stroke="currentColor" strokeOpacity=".15">
                {[0, 25, 50, 75, 100].map(v => (
                  <g key={v}>
                    <line x1={P} x2={W - P} y1={ys(v)} y2={ys(v)} />
                    <text x={P - 8} y={ys(v) + 4} textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="currentColor" fillOpacity=".5">{v}</text>
                  </g>
                ))}
              </g>
              <path d={spPath} stroke="var(--accent-2)" strokeWidth="1.5" fill="none" strokeDasharray="6 4"/>
              <path d={uPath} stroke="var(--amber, #f59e0b)" strokeWidth="1.5" fill="none" opacity="0.8"/>
              <path d={yPath} stroke="var(--accent)" strokeWidth="2.5" fill="none"/>
              <circle cx={xs(k)} cy={ys(sim.y[k] || 0)} r="5" fill="var(--accent)" stroke="var(--bg)" strokeWidth="2"/>
              <g fontFamily="JetBrains Mono, monospace" fontSize="11" fill="currentColor">
                <text x={W - P} y={20} textAnchor="end" fillOpacity=".7">stack load %</text>
                <g transform={`translate(${P}, ${H - 8})`}>
                  <text fontSize="10" fillOpacity=".5">t →</text>
                </g>
              </g>
              <g transform="translate(60, 30)" fontFamily="JetBrains Mono, monospace" fontSize="10">
                <g><rect width="14" height="2" y="6" fill="var(--accent)"/><text x="20" y="10" fill="currentColor">y (output)</text></g>
                <g transform="translate(0, 16)"><rect width="14" height="2" y="6" fill="var(--accent-2)"/><text x="20" y="10" fill="currentColor">setpoint</text></g>
                <g transform="translate(0, 32)"><rect width="14" height="2" y="6" fill="#f59e0b"/><text x="20" y="10" fill="currentColor">u (control)</text></g>
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
                <button className="btn" onClick={() => { setSeed(s => s + 1); setK(0); }}>Reset</button>
              </div>
              <div className="small mono" style={{ marginTop: 14, color: 'var(--fg-soft)' }}>
                Step disturbance at t=90 · setpoint change at t=130
              </div>
            </Reveal>
          </div>
        </div>
      </div>
      <style>{`
        .mpc-grid { display: grid; grid-template-columns: 1fr 280px; gap: 28px; margin-top: 60px; }
        @media (max-width: 1000px) { .mpc-grid { grid-template-columns: 1fr; } }
        .mpc-canvas { padding: 16px; color: var(--fg); }
        .mpc-svg { width: 100%; height: auto; aspect-ratio: 5/2; }
        .mpc-controls { display: flex; flex-direction: column; gap: 14px; }
        .small { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; }
      `}</style>
    </section>
  );
}
