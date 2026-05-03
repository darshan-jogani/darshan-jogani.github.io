import React, { useState, useMemo, useEffect, useRef } from 'react';
import Reveal from '../components/Reveal.jsx';
import { efficiencyHHV, powerDensity, specificEnergy } from '../lib/electrolyzer-model.jsx';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const X0 = 80, X1 = 760, Y0 = 430, Y1 = 62;
const sx = j => X0 + (j / 1000) * (X1 - X0);
const sy = u => Y0 - ((u - 1.15) / 0.5) * (Y0 - Y1);
const dPath = pts => pts.map((p, i) => (i ? 'L' : 'M') + sx(p[0]).toFixed(1) + ' ' + sy(p[1]).toFixed(1)).join(' ');
const dFillBetween = (top, bottom) => {
  const topPath = top.map((p, i) => (i ? 'L' : 'M') + sx(p[0]).toFixed(1) + ' ' + sy(p[1]).toFixed(1)).join(' ');
  const bottomPath = [...bottom].reverse().map(p => 'L' + sx(p[0]).toFixed(1) + ' ' + sy(p[1]).toFixed(1)).join(' ');
  return `${topPath} ${bottomPath} Z`;
};

export default function PolarizationCurve() {
  const [pressure, setPressure] = useState(30);
  const [temp, setTemp] = useState(70);
  const [curr, setCurr] = useState(400);
  const curveRef = useRef(null);

  const getBreakdown = (j, T, p) => {
    const T_K = T + 273.15;
    const Urev = 1.229 - 0.0009 * (T - 25) + (8.314 * T_K / (2 * 96485)) * Math.log(p) * 0.5;
    const s = 0.16 - 0.015 * Math.log10(p) - (T - 25) * 0.0008;
    const tcoef = 25 + 5 * Math.log10(p) - (T - 25) * 0.15;
    const r = 0.00018 - (T - 25) * 0.0000010;
    
    const v_rev = Urev;
    const v_act = s * Math.log10(tcoef * j / 1000 + 1);
    const v_ohm = r * j;
    const v_con = 0.00003 * Math.pow(j / 100, 3);

    return { v_rev, v_act, v_ohm, v_con, total: v_rev + v_act + v_ohm + v_con };
  };

  const { pts_base, pts_rev, pts_act, pts_ohm, pts_tot } = useMemo(() => {
    const base=[], rev=[], act=[], ohm=[], tot=[];
    for (let j = 0; j <= 1000; j += 10) {
      const { v_rev, v_act, v_ohm, v_con, total } = getBreakdown(j, temp, pressure);
      base.push([j, 1.15]); // 1.15V is the bottom of the visible chart
      rev.push([j, v_rev]);
      act.push([j, v_rev + v_act]);
      ohm.push([j, v_rev + v_act + v_ohm]);
      tot.push([j, total]);
    }
    return { pts_base: base, pts_rev: rev, pts_act: act, pts_ohm: ohm, pts_tot: tot };
  }, [temp, pressure]);

  const { total: u } = getBreakdown(curr, temp, pressure);
  const eta = efficiencyHHV(u);
  const pd = powerDensity(u, curr);
  const se = specificEnergy(u);
  const lcoh = 1.6 + (u - 1.48) * 4.5 + (pressure > 1 ? 0.25 * Math.log10(pressure) : 0);
  const ox = sx(curr), oy = sy(u);

  useEffect(() => {
    if (!curveRef.current) return;
    const ctx = gsap.context(() => {
      const len = curveRef.current.getTotalLength?.() || 2000;
      curveRef.current.style.strokeDasharray = len;
      curveRef.current.style.strokeDashoffset = len;
      ScrollTrigger.create({
        trigger: curveRef.current, start: 'top 75%', once: true,
        onEnter: () => gsap.to(curveRef.current, { 
          strokeDashoffset: 0, 
          duration: 1.6, 
          ease: 'power2.out',
          onComplete: () => {
            if (curveRef.current) curveRef.current.style.strokeDasharray = 'none';
          }
        }),
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="polarization" className="alt">
      <div className="container">
        <Reveal clip className="section-label"><span className="num">04</span><span>Polarization Curve</span></Reveal>
        <Reveal clip as="h2" className="section-title">The <em>polarization curve</em>, interactively.</Reveal>
        <Reveal as="p" className="section-intro">A live single-cell model. Sweep current density, change pressure and temperature, and watch the operating point — and the resulting cost of hydrogen — move with you.</Reveal>

        <div className="viz-wrap">
          <Reveal className="card viz-card">
            <svg viewBox="0 0 800 500" className="viz-svg" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="grad-low" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="var(--accent)"/><stop offset="100%" stopColor="var(--accent-2)"/></linearGradient>
                <linearGradient id="grad-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18"/><stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/></linearGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <g stroke="currentColor" strokeOpacity=".25" strokeWidth="1">
                <line x1="80" y1="60" x2="80" y2="430"/><line x1="80" y1="430" x2="760" y2="430"/>
              </g>
              <g fontFamily="JetBrains Mono, monospace" fontSize="11" fill="currentColor" fillOpacity=".7">
                <text x="80" y="455" textAnchor="start">0</text>
                <text x="216" y="455" textAnchor="middle">200</text>
                <text x="352" y="455" textAnchor="middle">400</text>
                <text x="488" y="455" textAnchor="middle">600</text>
                <text x="624" y="455" textAnchor="middle">800</text>
                <text x="760" y="455" textAnchor="middle">1000</text>
                <text x="420" y="478" textAnchor="middle" letterSpacing="2">j / mA cm⁻²</text>
                <text x="72" y="430" textAnchor="end">1.15</text>
                <text x="72" y="356" textAnchor="end">1.25</text>
                <text x="72" y="283" textAnchor="end">1.35</text>
                <text x="72" y="209" textAnchor="end">1.45</text>
                <text x="72" y="136" textAnchor="end">1.55</text>
                <text x="72" y="62" textAnchor="end">1.65</text>
                <text x="30" y="245" textAnchor="middle" transform="rotate(-90 30 245)" letterSpacing="2">U / V</text>
              </g>
              <path d={dFillBetween(pts_rev, pts_base)} fill="var(--indigo)" fillOpacity="0.1" />
              <path d={dFillBetween(pts_act, pts_rev)} fill="var(--indigo)" fillOpacity="0.25" />
              <path d={dFillBetween(pts_ohm, pts_act)} fill="var(--accent)" fillOpacity="0.25" />
              <path d={dFillBetween(pts_tot, pts_ohm)} fill="var(--accent)" fillOpacity="0.5" />
              <path ref={curveRef} d={dPath(pts_tot)} fill="none" stroke="url(#grad-low)" strokeWidth="2.5" filter="url(#glow)" strokeLinecap="round"/>
              <line x1={ox} y1={oy} x2={ox} y2={Y0} stroke="var(--accent)" strokeOpacity=".4" strokeDasharray="3 4"/>
              <line x1={X0} y1={oy} x2={ox} y2={oy} stroke="var(--accent)" strokeOpacity=".4" strokeDasharray="3 4"/>
              <circle cx={ox} cy={oy} r="6" fill="var(--accent)" stroke="var(--bg)" strokeWidth="2" className="op-dot"/>
              <g fontFamily="JetBrains Mono, monospace" fontSize="11">
                <rect x={Math.min(ox + 14, X1 - 124)} y={Math.max(oy - 50, Y1 + 4)} width="120" height="44" rx="2" fill="var(--bg-alt)" stroke="var(--accent)" strokeOpacity=".5"/>
                <text x={Math.min(ox + 24, X1 - 114)} y={Math.max(oy - 32, Y1 + 22)} fill="var(--fg)">U = {u.toFixed(2)} V</text>
                <text x={Math.min(ox + 24, X1 - 114)} y={Math.max(oy - 16, Y1 + 38)} fill="var(--fg-soft)">j = {curr} mA·cm⁻²</text>
              </g>
              <g fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="1.5" fill="currentColor" fillOpacity=".6">
                <text x="92" y="50">Alkaline electrolyzer · single cell · KOH 30 wt%</text>
                <rect x="92" y="62" width="8" height="8" fill="var(--accent)" fillOpacity="0.5" />
                <text x="106" y="70">Concentration</text>
                <rect x="206" y="62" width="8" height="8" fill="var(--accent)" fillOpacity="0.25" />
                <text x="220" y="70">Ohmic</text>
                <rect x="276" y="62" width="8" height="8" fill="var(--indigo)" fillOpacity="0.25" />
                <text x="290" y="70">Activation</text>
                <rect x="372" y="62" width="8" height="8" fill="var(--indigo)" fillOpacity="0.1" />
                <text x="386" y="70">Reversible</text>
              </g>
            </svg>
          </Reveal>

          <div className="viz-controls">
            <Reveal className="card panel">
              <h4>Pressure</h4>
                <div className="slider-row">
                  <input type="range" className="slider" min="1" max="90" step="1" value={pressure} onChange={e => setPressure(+e.target.value)} />
                  <span className="val">{pressure} bar</span>
              </div>
            </Reveal>
            <Reveal className="card panel">
              <h4>Temperature</h4>
              <div className="slider-row">
                <input type="range" className="slider" min="40" max="90" step="1" value={temp} onChange={e => setTemp(+e.target.value)} />
                <span className="val">{temp} °C</span>
              </div>
            </Reveal>
            <Reveal className="card panel">
              <h4>Current Density</h4>
              <div className="slider-row">
                <input type="range" className="slider" min="0" max="1000" step="10" value={curr} onChange={e => setCurr(+e.target.value)} />
                <span className="val">{curr} mA·cm⁻²</span>
              </div>
            </Reveal>
            <Reveal className="card panel">
              <h4>Operating Readout</h4>
              <div className="readout">
                <span className="k">Cell Voltage</span><span className="v"><em>{u.toFixed(2)}</em> V</span>
                <span className="k">Efficiency (HHV)</span><span className="v"><em>{eta.toFixed(1)}</em> %</span>
                <span className="k">Power Density</span><span className="v"><em>{pd.toFixed(2)}</em> W·cm⁻²</span>
                <span className="k">Spec. Energy</span><span className="v"><em>{se.toFixed(2)}</em> kWh·m⁻³</span>
                <span className="k">~LCOH est.</span><span className="v"><em>{lcoh.toFixed(2)}</em> €·kg⁻¹</span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <style>{`
        .viz-wrap { margin-top: 60px; display: grid; grid-template-columns: 1fr 320px; gap: 28px; align-items: stretch; }
        @media (max-width: 1000px) { .viz-wrap { grid-template-columns: 1fr; } .viz-controls { display: grid; grid-template-columns: 1fr 1fr; } }
        @media (max-width: 600px) { .viz-controls { grid-template-columns: 1fr; } }
        .viz-card { overflow: hidden; position: relative; padding: 24px; display: flex; align-items: center; justify-content: center; }
        .viz-card::before { content: ""; position: absolute; inset: 0;
          background: radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--accent) 5%, transparent), transparent 70%);
          opacity: 0.5; pointer-events: none; animation: bg-spin 20s linear infinite; }
        @keyframes bg-spin { to { transform: rotate(360deg); } }
        .viz-svg { width: 100%; height: 100%; max-height: 480px; display: block; color: var(--fg); position: relative; z-index: 1; }
        .op-dot { animation: pulse-dot 1.5s infinite; }
        @keyframes pulse-dot { 0%, 100% { stroke-width: 2px; stroke-opacity: 1; } 50% { stroke-width: 8px; stroke-opacity: 0.4; } }
        .viz-controls { display: flex; flex-direction: column; gap: 14px; }
        .panel { padding: 22px; transition: border-color .3s; }
        .panel:hover { border-color: color-mix(in oklab, var(--accent) 40%, var(--card-bd)); }
        .panel h4 { font-family: var(--mono); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--fg-soft); margin: 0 0 14px; }
        
        /* Custom Glowing Sliders */
        .slider { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; background: color-mix(in oklab, var(--rule-c) 80%, transparent); border-radius: 3px; outline: none; transition: background 0.3s; }
        .slider:hover { background: color-mix(in oklab, var(--rule-c) 100%, transparent); }
        .slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--accent); cursor: pointer; box-shadow: 0 0 12px var(--accent); transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .slider::-webkit-slider-thumb:hover { transform: scale(1.3); }
        .slider::-moz-range-thumb { width: 18px; height: 18px; border: none; border-radius: 50%; background: var(--accent); cursor: pointer; box-shadow: 0 0 12px var(--accent); transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .slider::-moz-range-thumb:hover { transform: scale(1.3); }
        
        .slider-row { display: flex; align-items: center; gap: 12px; }
        .val { font-family: var(--mono); font-size: 12px; color: var(--fg); min-width: 80px; text-align: right; }
        .readout { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 16px; font-family: var(--mono); font-size: 12px; }
        .readout .k { color: var(--fg-soft); letter-spacing: .5px; }
        .readout .v { color: var(--fg); text-align: right; }
        .readout .v em { color: var(--accent); font-style: normal; }
      `}</style>
    </section>
  );
}
