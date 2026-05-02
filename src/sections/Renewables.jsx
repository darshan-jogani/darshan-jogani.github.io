import React, { useState, useMemo, useEffect } from 'react';
import Reveal from '../components/Reveal.jsx';

// Simulated 24-hour profiles (normalized).
const hours = Array.from({ length: 24 }, (_, i) => i);
const pvProfile  = h => Math.max(0, Math.sin((h - 6) / 12 * Math.PI)) * (0.85 + 0.1 * Math.sin(h));
const windProfile = h => 0.45 + 0.35 * Math.sin((h + 3) / 6) + 0.1 * Math.sin(h * 1.7);
const demand = () => 0.7;

export default function Renewables() {
  const [pvCap, setPvCap] = useState(120);   // MWp
  const [windCap, setWindCap] = useState(80); // MW
  const [stackCap, setStackCap] = useState(50); // MW
  const [batt, setBatt] = useState(40); // MWh

  const data = useMemo(() => {
    let soc = batt / 2;
    const rows = hours.map(h => {
      const pv = Math.max(0, pvProfile(h)) * pvCap;
      const wd = Math.max(0, windProfile(h)) * windCap;
      const supply = pv + wd;
      let toAwe = Math.min(supply, stackCap);
      let surplus = supply - toAwe;
      // charge battery with surplus
      const charge = Math.min(surplus, Math.max(0, batt - soc));
      soc = Math.min(batt, soc + charge);
      const curtail = surplus - charge;
      // discharge if AWE underfed
      let dis = 0;
      if (toAwe < stackCap && soc > 0) {
        dis = Math.min(stackCap - toAwe, soc);
        soc -= dis;
        toAwe += dis;
      }
      return { h, pv, wd, toAwe, curtail, soc, dis };
    });
    const totalH2 = rows.reduce((a, r) => a + r.toAwe, 0) * 18; // approx kg/MWh
    const totalCurtail = rows.reduce((a, r) => a + r.curtail, 0);
    return { rows, totalH2, totalCurtail };
  }, [pvCap, windCap, stackCap, batt]);

  const W = 800, H = 320, P = 44;
  const xs = h => P + (h / 23) * (W - 2 * P);
  const maxY = Math.max(pvCap + windCap, 200);
  const ys = v => H - P - (v / maxY) * (H - 2 * P);

  const stackPath = (key) => {
    const top = data.rows.map(r => `${xs(r.h)},${ys(r[key === 'pv' ? 'pv' : key === 'wd' ? r.pv + r.wd : 0])}`);
    return top;
  };

  // build stacked area: pv + wind
  const pvArea = `M${xs(0)},${ys(0)} ` + data.rows.map(r => `L${xs(r.h)},${ys(r.pv)}`).join(' ') + ` L${xs(23)},${ys(0)} Z`;
  const wdArea = `M${xs(0)},${ys(data.rows[0].pv)} ` + data.rows.map(r => `L${xs(r.h)},${ys(r.pv + r.wd)}`).join(' ') +
                 ' ' + data.rows.slice().reverse().map(r => `L${xs(r.h)},${ys(r.pv)}`).join(' ') + ' Z';
  const aweLine = data.rows.map((r, i) => (i ? 'L' : 'M') + xs(r.h) + ',' + ys(r.toAwe)).join(' ');
  const socLine = data.rows.map((r, i) => (i ? 'L' : 'M') + xs(r.h) + ',' + (H - P - (r.soc / batt) * (H - 2 * P))).join(' ');

  return (
    <section id="renewables" className="alt">
      <div className="container">
        <Reveal clip className="section-label"><span className="num">08</span><span>Renewables Coupling</span></Reveal>
        <Reveal clip as="h2" className="section-title">A 24-hour <em>day-in-the-life</em>.</Reveal>
        <Reveal as="p" className="section-intro">Solar + wind feeding a 50 MW alkaline electrolyzer with a battery buffer. Tweak the sizing — watch curtailment, hydrogen output and battery state-of-charge respond.</Reveal>

        <div className="ren-grid">
          <Reveal className="card ren-chart">
            <svg viewBox={`0 0 ${W} ${H}`} className="ren-svg">
              <g stroke="currentColor" strokeOpacity=".15">
                <line x1={P} x2={W - P} y1={ys(0)} y2={ys(0)}/>
                {[0, 6, 12, 18, 23].map(h => (
                  <g key={h}>
                    <line x1={xs(h)} x2={xs(h)} y1={P} y2={H - P}/>
                    <text x={xs(h)} y={H - P + 14} fontFamily="JetBrains Mono, monospace" fontSize="10" textAnchor="middle" fill="currentColor" fillOpacity=".5">{h}h</text>
                  </g>
                ))}
                {[0, maxY * 0.5, maxY].map(v => (
                  <text key={v} x={P - 8} y={ys(v) + 4} textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="currentColor" fillOpacity=".5">{v.toFixed(0)} MW</text>
                ))}
              </g>
              <path d={pvArea} fill="var(--accent-2)" opacity="0.55"/>
              <path d={wdArea} fill="var(--accent)" opacity="0.45"/>
              <path d={aweLine} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="0"/>
              <path d={socLine} fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 3"/>
              <g transform={`translate(${P + 8}, ${P + 4})`} fontFamily="JetBrains Mono, monospace" fontSize="10">
                <g><rect width="14" height="2" y="6" fill="var(--accent-2)" opacity=".7"/><text x="20" y="10" fill="currentColor" fillOpacity=".8">PV</text></g>
                <g transform="translate(0,16)"><rect width="14" height="2" y="6" fill="var(--accent)" opacity=".7"/><text x="20" y="10" fill="currentColor" fillOpacity=".8">Wind</text></g>
                <g transform="translate(0,32)"><rect width="14" height="2" y="6" fill="#f59e0b"/><text x="20" y="10" fill="currentColor" fillOpacity=".8">to AWE</text></g>
                <g transform="translate(0,48)"><rect width="14" height="2" y="6" fill="#a78bfa"/><text x="20" y="10" fill="currentColor" fillOpacity=".8">Battery SOC</text></g>
              </g>
            </svg>
            <div className="ren-summary">
              <div><span className="k">H₂ produced</span><span className="v">{(data.totalH2 / 1000).toFixed(1)} t/day</span></div>
              <div><span className="k">Curtailment</span><span className="v">{data.totalCurtail.toFixed(0)} MWh</span></div>
              <div><span className="k">Stack util.</span><span className="v">{(data.rows.reduce((a, r) => a + r.toAwe, 0) / (stackCap * 24) * 100).toFixed(0)} %</span></div>
            </div>
          </Reveal>
          <div className="ren-controls">
            <Reveal className="card panel">
              <h4>PV (MWp)</h4>
              <div className="slider-row"><input type="range" className="slider" min="0" max="300" value={pvCap} onChange={e => setPvCap(+e.target.value)}/><span className="val">{pvCap}</span></div>
            </Reveal>
            <Reveal className="card panel">
              <h4>Wind (MW)</h4>
              <div className="slider-row"><input type="range" className="slider" min="0" max="300" value={windCap} onChange={e => setWindCap(+e.target.value)}/><span className="val">{windCap}</span></div>
            </Reveal>
            <Reveal className="card panel">
              <h4>Stack (MW)</h4>
              <div className="slider-row"><input type="range" className="slider" min="10" max="200" value={stackCap} onChange={e => setStackCap(+e.target.value)}/><span className="val">{stackCap}</span></div>
            </Reveal>
            <Reveal className="card panel">
              <h4>Battery (MWh)</h4>
              <div className="slider-row"><input type="range" className="slider" min="0" max="200" value={batt} onChange={e => setBatt(+e.target.value)}/><span className="val">{batt}</span></div>
            </Reveal>
          </div>
        </div>
      </div>
      <style>{`
        .ren-grid { display: grid; grid-template-columns: 1fr 280px; gap: 28px; margin-top: 60px; }
        @media (max-width: 1000px) { .ren-grid { grid-template-columns: 1fr; } }
        .ren-chart { padding: 16px; color: var(--fg); }
        .ren-svg { width: 100%; height: auto; aspect-ratio: 5/2; }
        .ren-summary { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--rule-c); display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .ren-summary .k { display: block; font-family: var(--mono); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--fg-soft); margin-bottom: 4px; }
        .ren-summary .v { font-family: var(--serif); font-size: 22px; color: var(--accent); }
        .ren-controls { display: flex; flex-direction: column; gap: 14px; }
        .panel { padding: 22px; }
        .panel h4 { font-family: var(--mono); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--fg-soft); margin: 0 0 14px; }
        .slider-row { display: flex; align-items: center; gap: 12px; }
        .val { font-family: var(--mono); font-size: 12px; color: var(--fg); min-width: 50px; text-align: right; }
      `}</style>
    </section>
  );
}
