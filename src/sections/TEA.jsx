import React, { useState, useMemo } from 'react';
import Reveal from '../components/Reveal.jsx';
import { lcohBreakdown } from '../lib/tea-model.jsx';

export default function TEA() {
  const [capex, setCapex] = useState(1200);
  const [cf, setCf] = useState(0.55);
  const [elec, setElec] = useState(60);
  const [eff, setEff] = useState(0.62);

  const b = useMemo(() => lcohBreakdown({
    capex, capacityFactor: cf, electricityPrice: elec, efficiency: eff,
  }), [capex, cf, elec, eff]);

  const items = [
    { k: 'CAPEX', v: b.capex, c: 'var(--accent)' },
    { k: 'O&M', v: b.oam, c: '#a78bfa' },
    { k: 'Electricity', v: b.electricity, c: 'var(--accent-2)' },
    { k: 'Stack Repl.', v: b.stack, c: '#f59e0b' },
    { k: 'Water', v: b.water, c: '#06b6d4' },
  ];
  const max = Math.max(...items.map(i => i.v)) * 1.1 || 1;
  const total = b.total;

  return (
    <section id="tea" className="alt">
      <div className="container">
        <Reveal clip className="section-label"><span className="num">06</span><span>Techno-Economic Analysis</span></Reveal>
        <Reveal clip as="h2" className="section-title">What drives the <em>cost of green hydrogen</em>?</Reveal>
        <Reveal as="p" className="section-intro">A simplified LCOH waterfall. Drag the inputs to see which lever matters most. (Illustrative — not policy advice.)</Reveal>

        <div className="tea-grid">
          <Reveal className="card tea-chart">
            <div className="tea-total">
              <span className="mono small">LCOH</span>
              <h3>€ {total.toFixed(2)}<span className="unit">/ kg H₂</span></h3>
            </div>
            <div className="bars">
              {items.map(i => (
                <div className="bar-row" key={i.k}>
                  <span className="bar-label mono">{i.k}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ 
                      width: (i.v / max * 100) + '%', 
                      background: `linear-gradient(90deg, color-mix(in oklab, ${i.c} 10%, transparent), ${i.c})`,
                      borderRight: `2px solid color-mix(in oklab, ${i.c} 40%, #ffffff)`,
                      boxShadow: `2px 0 16px -2px ${i.c}`
                    }} />
                  </div>
                  <span className="bar-val mono">€ {i.v.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="tea-controls">
            <Reveal className="card panel">
              <h4>System CAPEX (€/kW)</h4>
              <div className="slider-row">
                <input className="slider" type="range" min="500" max="2500" step="50" value={capex} onChange={e => setCapex(+e.target.value)}/>
                <span className="val">{capex}</span>
              </div>
            </Reveal>
            <Reveal className="card panel">
              <h4>Capacity Factor</h4>
              <div className="slider-row">
                <input className="slider" type="range" min="0.2" max="0.95" step="0.01" value={cf} onChange={e => setCf(+e.target.value)}/>
                <span className="val">{(cf * 100).toFixed(0)} %</span>
              </div>
            </Reveal>
            <Reveal className="card panel">
              <h4>Electricity (€/MWh)</h4>
              <div className="slider-row">
                <input className="slider" type="range" min="20" max="180" step="1" value={elec} onChange={e => setElec(+e.target.value)}/>
                <span className="val">{elec}</span>
              </div>
            </Reveal>
            <Reveal className="card panel">
              <h4>System Efficiency (HHV)</h4>
              <div className="slider-row">
                <input className="slider" type="range" min="0.4" max="0.8" step="0.01" value={eff} onChange={e => setEff(+e.target.value)}/>
                <span className="val">{(eff * 100).toFixed(0)} %</span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
      <style>{`
        .tea-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 28px; margin-top: 60px; }
        @media (max-width: 1000px) { .tea-grid { grid-template-columns: 1fr; } }
        .tea-chart { padding: 32px; }
        .tea-total { margin-bottom: 28px; padding-bottom: 24px; border-bottom: 1px solid var(--rule-c); }
        .small { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--fg-soft); }
        .tea-total h3 { font-family: var(--serif); font-size: clamp(40px, 8vw, 64px); font-weight: 500; margin: 8px 0 0; line-height: 1; color: var(--fg); }
        .tea-total .unit { font-size: .35em; color: var(--fg-soft); margin-left: 8px; font-family: var(--mono); }
        .bars { display: flex; flex-direction: column; gap: 12px; }
        .bar-row { display: grid; grid-template-columns: 110px 1fr 90px; gap: 16px; align-items: center; }
        .bar-label { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--fg-soft); }
        .bar-track { height: 22px; background: color-mix(in oklab, var(--fg) 6%, transparent); border-radius: 4px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); }
        .bar-fill { height: 100%; transition: width .5s cubic-bezier(.34, 1.56, .64, 1); border-radius: 4px; position: relative; }
        .bar-val { font-size: 12px; color: var(--fg); text-align: right; }
        .tea-controls { display: flex; flex-direction: column; gap: 14px; }
        .panel { padding: 22px; transition: border-color .3s; }
        .panel:hover { border-color: color-mix(in oklab, var(--accent) 40%, var(--card-bd)); }
        .panel h4 { font-family: var(--mono); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--fg-soft); margin: 0 0 14px; }
        .slider-row { display: flex; align-items: center; gap: 12px; }
        .val { font-family: var(--mono); font-size: 12px; color: var(--fg); min-width: 60px; text-align: right; }

        /* Custom Glowing Sliders */
        .slider { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; background: color-mix(in oklab, var(--rule-c) 80%, transparent); border-radius: 3px; outline: none; transition: background 0.3s; }
        .slider:hover { background: color-mix(in oklab, var(--rule-c) 100%, transparent); }
        .slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--accent); cursor: pointer; box-shadow: 0 0 12px var(--accent); transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .slider::-webkit-slider-thumb:hover { transform: scale(1.3); }
        .slider::-moz-range-thumb { width: 18px; height: 18px; border: none; border-radius: 50%; background: var(--accent); cursor: pointer; box-shadow: 0 0 12px var(--accent); transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .slider::-moz-range-thumb:hover { transform: scale(1.3); }

        /* Mobile Responsiveness */
        @media (max-width: 600px) {
          .tea-chart { padding: 24px; }
          .bar-row { 
            grid-template-columns: 1fr auto; 
            grid-template-areas: "label val" "track track"; 
            gap: 8px; margin-bottom: 12px; 
          }
          .bar-label { grid-area: label; }
          .bar-val { grid-area: val; }
          .bar-track { grid-area: track; height: 14px; }
          .panel { padding: 18px; }
        }
      `}</style>
    </section>
  );
}
