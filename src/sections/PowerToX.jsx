import React, { useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CellStack } from './ElectrolyzerModel.jsx';

const NODES = [
  { id: 'wind',  x: 80,  y: 80,  label: 'Wind',             sub: '80 MW',       kind: 'src', detail: 'Offshore wind park providing volatile renewable electricity.' },
  { id: 'pv',    x: 80,  y: 250, label: 'Solar PV',         sub: '120 MWp',     kind: 'src', detail: 'Utility-scale solar tracking system for daytime baseload.' },
  { id: 'grid',  x: 80,  y: 420, label: 'Grid',             sub: 'balancing',   kind: 'src', detail: 'Grid connection for backup power and peak curtailment.' },
  { id: 'awe',   x: 380, y: 250, label: 'Alkaline Electrolyzer', sub: '50 MW · 30 bar', kind: 'core', detail: 'Core conversion unit: splits water into pressurized H₂ and O₂.' },
  { id: 'h2',    x: 660, y: 160, label: 'H₂',               sub: '950 kg/h',    kind: 'mid', detail: 'Intermediate buffer storage for high-purity hydrogen gas.' },
  { id: 'o2',    x: 660, y: 340, label: 'O₂',               sub: 'vented / sold', kind: 'mid', detail: 'Byproduct oxygen, either vented or sold to local industry.' },
  { id: 'meoh',  x: 920, y: 80,  label: 'Methanol Synth.',  sub: 'Cu/ZnO/Al₂O₃', kind: 'product', detail: 'Catalytic conversion of H₂ and captured CO₂ into liquid green methanol.' },
  { id: 'nh3',   x: 920, y: 250, label: 'Ammonia Synth.',   sub: 'Haber-Bosch', kind: 'product', detail: 'Haber-Bosch process reacting H₂ with atmospheric N₂ to form ammonia.' },
  { id: 'fuel',  x: 920, y: 420, label: 'Synthetic Fuels',  sub: 'Fischer-Tropsch', kind: 'product', detail: 'Fischer-Tropsch synthesis creating drop-in sustainable aviation fuels (SAF).' },
];
const EDGES = [
  ['pv', 'awe'], ['wind', 'awe'], ['grid', 'awe'],
  ['awe', 'h2'], ['awe', 'o2'],
  ['h2', 'meoh'], ['h2', 'nh3'], ['h2', 'fuel'],
];
const findNode = (id) => NODES.find(n => n.id === id);

export default function PowerToX() {
  const [hover, setHover] = useState(null);
  const W = 1040, H = 500;
  return (
    <section id="power-to-x" className="dark">
      <div className="container">
        <Reveal clip className="section-label"><span className="num">07</span><span>Power-to-X</span></Reveal>
        <Reveal clip as="h2" className="section-title">From <em>electrons</em> to <em>molecules</em>.</Reveal>
        <Reveal as="p" className="section-intro">A simplified flowsheet for an industrial Power-to-X plant. Renewable electrons drive the electrolyzer; the resulting hydrogen feeds three downstream synthesis routes. Hover any node for details.</Reveal>

        <Reveal className="card flow-card">
          <div className="flow-scroll">
            <svg viewBox={`0 0 ${W} ${H}`} className="flow-svg" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="edge-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="var(--indigo)" stopOpacity="0.8"/>
              </linearGradient>
              <linearGradient id="glass-grad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4"/>
                <stop offset="12%" stopColor="#ffffff" stopOpacity="0.1"/>
                <stop offset="30%" stopColor="#ffffff" stopOpacity="0.0"/>
                <stop offset="70%" stopColor="var(--indigo)" stopOpacity="0.0"/>
                <stop offset="88%" stopColor="var(--indigo)" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="var(--indigo)" stopOpacity="0.5"/>
              </linearGradient>
              <linearGradient id="glass-hl-left" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.0"/>
                <stop offset="5%" stopColor="#ffffff" stopOpacity="0.6"/>
                <stop offset="15%" stopColor="#ffffff" stopOpacity="0.0"/>
              </linearGradient>
              <linearGradient id="glass-hl-right" x1="0" x2="1" y1="0" y2="0">
                <stop offset="85%" stopColor="#ffffff" stopOpacity="0.0"/>
                <stop offset="95%" stopColor="#ffffff" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0"/>
              </linearGradient>
              <filter id="flow-glow">
                <feGaussianBlur stdDeviation="4" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0 L10 5 L0 10 z" fill="var(--fg)" opacity="0.8"/>
              </marker>
            </defs>
            {EDGES.map(([a, b], i) => {
              const A = findNode(a), B = findNode(b);
              const startX = A.x + 70;
              const startY = A.y + (A.id === 'awe' ? 65 : 0);
              const endX = B.x - 70;
              const endY = B.y + (B.id === 'awe' ? 65 : 0);
              const mx = (startX + endX) / 2;
              const d = `M${startX} ${startY} C ${mx} ${startY}, ${mx} ${endY}, ${endX} ${endY}`;
              return (
                <g key={i}>
                  <path d={d} stroke="var(--fg-soft)" strokeWidth="2.5" fill="none" opacity="0.65" markerEnd="url(#arr)"/>
                  <g>
                    <animateMotion dur={`${3 + (i % 2)}s`} repeatCount="indefinite" path={d} begin={`${i * -0.5}s`}/>
                    <circle r="3" fill="#ffffff" />
                    <circle r="8" fill="var(--accent)" opacity="0.4" filter="url(#flow-glow)" />
                  </g>
                </g>
              );
            })}
            {NODES.map(n => {
              if (n.id === 'awe') {
                return (
                  <g key={n.id} transform={`translate(${n.x}, ${n.y})`} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}>
                    <ellipse cx="0" cy="65" rx="70" ry="20" fill="url(#edge-grad)" opacity={hover === n.id ? 0.7 : 0.3} filter="url(#flow-glow)" style={{ transition: 'all 0.3s ease' }} pointerEvents="none"/>
                    <ellipse cx="0" cy="65" rx="70" ry="20" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.5" pointerEvents="none"/>
                    <ellipse cx="0" cy="65" rx="60" ry="15" fill="none" stroke="var(--indigo)" strokeWidth="1" opacity="0.3" pointerEvents="none"/>
                    
                    <foreignObject x="-80" y="-85" width="160" height="160">
                      <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: '100%', height: '100%', cursor: 'grab' }} title="Drag to orbit" onMouseEnter={() => setHover('awe')} onMouseLeave={() => setHover(null)}>
                        <Canvas camera={{ position: [6, 3, 6], fov: 40 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
                          <ambientLight intensity={0.5} />
                          <directionalLight position={[5, 8, 5]} intensity={1.2} color="#00d4aa" />
                          <directionalLight position={[-5, 3, -5]} intensity={0.6} color="#6366f1" />
                          <group scale={0.75} position={[0, -0.6, 0]}>
                            <CellStack onHover={() => {}} />
                          </group>
                          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2.5} />
                        </Canvas>
                      </div>
                    </foreignObject>
                    
                    <g pointerEvents="none">
                      <path d="M -70 -75 L -70 65 A 70 20 0 0 0 70 65 L 70 -75 A 70 20 0 0 0 -70 -75 Z" fill="url(#glass-grad)" opacity="0.85" />
                      <path d="M -70 -75 L -70 65 A 70 20 0 0 0 70 65 L 70 -75 A 70 20 0 0 0 -70 -75 Z" fill="url(#glass-hl-left)" />
                      <path d="M -70 -75 L -70 65 A 70 20 0 0 0 70 65 L 70 -75 A 70 20 0 0 0 -70 -75 Z" fill="url(#glass-hl-right)" />
                      <ellipse cx="0" cy="-75" rx="70" ry="20" fill="url(#glass-grad)" opacity="0.9" />
                      <ellipse cx="0" cy="-75" rx="70" ry="20" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.6"/>
                      <ellipse cx="0" cy="-25" rx="70" ry="18" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.15" />
                      <ellipse cx="0" cy="20" rx="70" ry="18" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.15" />
                      <path d="M -70 65 A 70 20 0 0 0 70 65" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.3"/>
                    </g>

                    <text x="0" y="110" textAnchor="middle" fontFamily="Playfair Display, serif" fontSize="16" fontWeight="600" fill="var(--fg)" pointerEvents="none">{n.label}</text>
                    <text x="0" y="130" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="var(--fg-soft)" letterSpacing="1" pointerEvents="none">{n.sub}</text>
                  </g>
                );
              }
              return (
                <g key={n.id} transform={`translate(${n.x}, ${n.y})`}
                   onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} style={{ cursor: 'pointer' }}>
                  <rect x="-70" y="-32" width="140" height="64" rx="6"
                  fill={hover === n.id ? 'color-mix(in oklab, var(--accent) 18%, var(--bg-alt))' : 'var(--bg-alt)'}
                  stroke={hover === n.id ? 'var(--accent)' : 'var(--card-bd)'}
                  strokeWidth="1.5"
                  style={{ transition: 'all 0.3s ease' }}
                  filter={hover === n.id ? 'url(#flow-glow)' : 'none'}
                  />
                  <path d={`M -70 -20 L -70 -26 A 6 6 0 0 1 -64 -32 L -50 -32`} stroke="var(--accent)" fill="none" strokeWidth="2" opacity="0.6" />
                  <path d={`M 70 20 L 70 26 A 6 6 0 0 1 64 32 L 50 32`} stroke="var(--indigo)" fill="none" strokeWidth="2" opacity="0.6" />
                  <text x="0" y="-2" textAnchor="middle" fontFamily="Playfair Display, serif" fontSize="15" fill="var(--fg)">{n.label}</text>
                  <text x="0" y="18" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="var(--fg-soft)" letterSpacing="1">{n.sub}</text>
              </g>
              );
            })}
          </svg>
          </div>
          <div className="flow-foot">
            <span className="mono small">{hover ? findNode(hover).detail : 'Hover any node to inspect the process details'}</span>
            <span className="mono small accent">η<sub>system</sub> ≈ 62 % HHV · LCOH ≈ €4.20 / kg</span>
          </div>
        </Reveal>
      </div>
      <style>{`
        .flow-card { padding: 24px; margin-top: 60px; overflow: hidden; background: var(--card); border: 1px solid var(--card-bd); border-radius: var(--radius); }
        .flow-scroll { overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; padding-bottom: 16px; margin-bottom: -4px; }
        .flow-scroll::-webkit-scrollbar { height: 6px; }
        .flow-scroll::-webkit-scrollbar-track { background: color-mix(in oklab, var(--rule-c) 50%, transparent); border-radius: 3px; }
        .flow-scroll::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 3px; }
        .flow-svg { min-width: 900px; width: 100%; height: auto; display: block; }
        .flow-foot { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--rule-c); display: flex; justify-content: space-between; }
        .small { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--fg-soft); }
        .accent { color: var(--accent); }
      `}</style>
    </section>
  );
}
