import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import Reveal from '../components/Reveal.jsx';

function CellPlate({ originalY, color, onHover, idx, hoveredIdx, metalness, roughness, emissive, emissiveIntensity, transmission, opacity, transparent }) {
  const ref = useRef();
  useFrame((s, delta) => {
    if (!ref.current) return;
    
    // Exploded view logic
    let targetY = originalY;
    let targetScale = 1;

    if (hoveredIdx !== null) {
      if (idx < hoveredIdx) targetY = originalY + 0.65;
      else if (idx > hoveredIdx) targetY = originalY - 0.65;
      else {
        targetScale = 1.05; // Slightly enlarge the hovered plate
        targetY = originalY;
      }
    }

    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, delta * 8);
    const scale = THREE.MathUtils.lerp(ref.current.scale.x, targetScale, delta * 8);
    ref.current.scale.set(scale, scale, scale);

    // Pulsing gas generation glow
    if (emissive && ref.current.material) {
      const pulse = Math.sin(s.clock.elapsedTime * 4 + idx) * 0.3 + 0.7;
      const isHovered = hoveredIdx === idx;
      const targetEmissive = isHovered ? emissiveIntensity * 2.5 : emissiveIntensity * pulse;
      ref.current.material.emissiveIntensity = THREE.MathUtils.lerp(ref.current.material.emissiveIntensity, targetEmissive, delta * 5);
    }
  });

  return (
    <mesh
      ref={ref}
      position={[0, originalY, 0]}
      onPointerOver={(e) => { e.stopPropagation(); onHover(idx); }}
      onPointerOut={() => onHover(null)}
    >
      <RoundedBox args={[3.2, 0.22, 2.6]} radius={0.04} smoothness={4}>
        <meshPhysicalMaterial
          color={color}
          metalness={metalness ?? 0.5}
          roughness={roughness ?? 0.4}
          emissive={emissive || '#000000'}
          emissiveIntensity={emissiveIntensity || 0}
          transmission={transmission || 0}
          opacity={opacity || 1}
          transparent={transparent || false}
          clearcoat={0.3}
        />
      </RoundedBox>
    </mesh>
  );
}

function StackAccessories({ hovered }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (!ref.current) return;
    const targetOpacity = hovered ? 0 : 1;
    ref.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, targetOpacity, delta * 8);
      }
    });
  });

  return (
    <group ref={ref}>
      {[[-1.45, 1.15], [1.45, 1.15], [-1.45, -1.15], [1.45, -1.15]].map(([x, z], i) => (
        <mesh key={`tie-${i}`} position={[x, 0, z]}>
          <cylinderGeometry args={[0.06, 0.06, 3.4, 12]} />
          <meshStandardMaterial color="#8892b0" metalness={0.9} roughness={0.3} transparent />
        </mesh>
      ))}
      <mesh position={[0, 1.85, 0.8]}>
        <cylinderGeometry args={[0.15, 0.15, 0.5, 16]} />
        <meshStandardMaterial color="#00d4aa" emissive="#00d4aa" emissiveIntensity={0.6} transparent />
      </mesh>
      <mesh position={[0, 1.85, -0.8]}>
        <cylinderGeometry args={[0.15, 0.15, 0.5, 16]} />
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.6} transparent />
      </mesh>
    </group>
  );
}

export function CellStack({ onHover }) {
  const groupRef = useRef();
  const [localHover, setLocalHover] = useState(null);
  
  const handleHover = (idx) => {
    setLocalHover(idx);
    if (onHover) onHover(idx);
  };

  useFrame((s) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(s.clock.elapsedTime * 1.5) * 0.05;
  });

  const layers = [
    { y: 1.5, color: '#1e293b', label: 'End Plate', idx: 0, metalness: 0.9, roughness: 0.2 },
    { y: 1.2, color: '#64748b', label: 'Bipolar Plate', idx: 1, metalness: 0.8, roughness: 0.3 },
    { y: 0.9, color: '#0f172a', label: 'Anode', idx: 2, emissive: '#6366f1', emissiveIntensity: 0.8 },
    { y: 0.6, color: '#ffffff', label: 'Diaphragm', idx: 3, transmission: 0.8, opacity: 0.8, transparent: true },
    { y: 0.3, color: '#0f172a', label: 'Cathode', idx: 4, emissive: '#00d4aa', emissiveIntensity: 0.8 },
    { y: 0.0, color: '#64748b', label: 'Bipolar Plate', idx: 5, metalness: 0.8, roughness: 0.3 },
    { y: -0.3, color: '#0f172a', label: 'Anode', idx: 6, emissive: '#6366f1', emissiveIntensity: 0.8 },
    { y: -0.6, color: '#ffffff', label: 'Diaphragm', idx: 7, transmission: 0.8, opacity: 0.8, transparent: true },
    { y: -0.9, color: '#0f172a', label: 'Cathode', idx: 8, emissive: '#00d4aa', emissiveIntensity: 0.8 },
    { y: -1.2, color: '#64748b', label: 'Bipolar Plate', idx: 9, metalness: 0.8, roughness: 0.3 },
    { y: -1.5, color: '#1e293b', label: 'End Plate', idx: 10, metalness: 0.9, roughness: 0.2 },
  ];

  return (
    <group ref={groupRef} rotation={[0.1, 0.5, 0]}>
      {layers.map(l => (
        <CellPlate
          key={l.idx}
          originalY={l.y}
          color={l.color}
          onHover={handleHover}
          idx={l.idx}
          hoveredIdx={localHover}
          metalness={l.metalness}
          roughness={l.roughness}
          emissive={l.emissive}
          emissiveIntensity={l.emissiveIntensity}
          transmission={l.transmission}
          opacity={l.opacity}
          transparent={l.transparent}
        />
      ))}
      <StackAccessories hovered={localHover !== null} />
    </group>
  );
}

const HOTSPOT_INFO = [
  { title: 'End Plate', desc: 'Compresses the stack and distributes mechanical load uniformly across all cells.' },
  { title: 'Bipolar Plate', desc: 'Conducts current cell-to-cell and channels electrolyte (KOH 30 wt%) through serpentine flow fields.' },
  { title: 'Anode (OER)', desc: 'Ni-based catalyst where the oxygen evolution reaction takes place — typically the rate-limiting step.' },
  { title: 'Diaphragm', desc: 'Zirfon® or similar porous separator — keeps O₂/H₂ apart while permitting OH⁻ migration.' },
  { title: 'Cathode (HER)', desc: 'Hydrogen evolution reaction — Raney-Ni or NiMo catalyst on a porous substrate.' },
  { title: 'Bipolar Plate', desc: 'Same role as above; alternating layers build a series-connected stack.' },
  { title: 'Anode (OER)', desc: 'Second cell repeat — stack design lets you scale voltage by stacking cells in series.' },
  { title: 'Diaphragm', desc: 'Repeat unit — separator between adjacent cells.' },
  { title: 'Cathode (HER)', desc: 'Second HER electrode in the repeat unit.' },
  { title: 'Bipolar Plate', desc: 'Final bipolar plate before the bottom end plate.' },
  { title: 'End Plate', desc: 'Bottom end plate — closes the stack and anchors the tie rods.' },
];

export default function ElectrolyzerModel() {
  const [hover, setHover] = useState(null);
  return (
    <section id="electrolyzer" className="dark">
      <div className="container">
        <Reveal clip className="section-label"><span className="num">03</span><span>Alkaline Electrolyzer</span></Reveal>
        <Reveal clip as="h2" className="section-title">Inside the <em>cell stack</em>.</Reveal>
        <Reveal as="p" className="section-intro">An alkaline electrolyzer is a sandwich of repeat units. Hover any plate in the 3D model to see what it does. Drag to orbit — scroll to zoom.</Reveal>

        <div className="elec-grid">
          <Reveal className="elec-canvas">
            <Canvas camera={{ position: [6, 3, 6], fov: 40 }} dpr={[1, 2]}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 8, 5]} intensity={1.2} color="#00d4aa" />
              <directionalLight position={[-5, 3, -5]} intensity={0.6} color="#6366f1" />
              <CellStack onHover={setHover} />
              <OrbitControls enablePan={false} minDistance={5} maxDistance={12} />
            </Canvas>
          </Reveal>
          <Reveal className="elec-info card">
            <div className="ei-head">
              <span className="mono small">Layer Detail</span>
              <span className="mono small">{hover !== null ? `Layer ${hover + 1} / 11` : 'Hover a layer'}</span>
            </div>
            <h3>{hover !== null ? HOTSPOT_INFO[hover].title : 'Cell Stack'}</h3>
            <p>{hover !== null ? HOTSPOT_INFO[hover].desc : 'A 5-cell pressurized AWE stack. Two end plates compress 3 repeat units (anode / diaphragm / cathode), connected by 4 tie-rods. The teal tube is the H₂ outlet, the indigo tube the O₂ outlet.'}</p>
            <div className="ei-stats">
              <div><span className="k">Stack Pressure</span><span className="v">30 bar</span></div>
              <div><span className="k">Operating T</span><span className="v">70 °C</span></div>
              <div><span className="k">Electrolyte</span><span className="v">KOH 30 wt%</span></div>
              <div><span className="k">Active Area</span><span className="v">300 cm²</span></div>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        .elec-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 28px; margin-top: 60px; }
        @media (max-width: 900px) { .elec-grid { grid-template-columns: 1fr; } }
        .elec-canvas { aspect-ratio: 4/3; border: 1px solid var(--card-bd); border-radius: var(--radius); overflow: hidden;
          background: radial-gradient(800px 400px at 50% 40%, #15224b, var(--bg)); }
        .elec-info { padding: 28px; display: flex; flex-direction: column; gap: 14px; }
        .ei-head { display: flex; justify-content: space-between; }
        .small { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--fg-soft); }
        .elec-info h3 { font-family: var(--serif); font-size: 28px; font-weight: 500; margin: 0; color: var(--fg); }
        .elec-info p { color: var(--fg-soft); font-size: 15px; line-height: 1.65; margin: 0; }
        .ei-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: auto; padding-top: 16px; border-top: 1px solid var(--rule-c); }
        .ei-stats .k { font-family: var(--mono); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--fg-soft); display: block; margin-bottom: 2px; }
        .ei-stats .v { font-family: var(--serif); font-size: 18px; color: var(--fg); }
      `}</style>
    </section>
  );
}
