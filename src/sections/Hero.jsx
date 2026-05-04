import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

function WaterMolecule() {
  const group = useRef();
  const oMat = useRef();
  const oCoreMat = useRef();
  const hMats = useRef([]);
  const bondMats = useRef([]);
  const rings = useRef([]);
  const { viewport } = useThree();
  
  // Automatically scales down the 3D model gracefully on mobile devices
  const responsiveScale = Math.min(1, viewport.width / 6.5);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    
    // Base floating animation
    const baseY = Math.sin(t * 0.8) * 0.2;
    
    // Interactive mouse tracking
    const targetX = (state.pointer.y * Math.PI) / 6;
    const targetY = (state.pointer.x * Math.PI) / 6;

    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, (t * 0.2) + targetY, delta * 3);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, Math.sin(t * 0.4) * 0.15 + targetX, delta * 3);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, baseY, delta * 3);

    // Animate electron orbital rings
    rings.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.x = t * (0.5 + i * 0.2);
        ring.rotation.y = t * (0.3 + i * 0.3);
      }
    });
  });

  useEffect(() => {
    const syncColor = () => {
      if (!oMat.current || !oCoreMat.current) return;
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00d4aa';
      
      oMat.current.color.set(isLight ? '#ffffff' : '#0a1020');
      oCoreMat.current.color.set(accent);
      oCoreMat.current.emissive.set(accent);
      oCoreMat.current.emissiveIntensity = isLight ? 0.6 : 1.5;

      hMats.current.forEach(mat => {
        if (mat) mat.color.set(isLight ? '#ffffff' : '#0a1020');
      });
      bondMats.current.forEach(mat => {
        if (mat) {
          mat.color.set(accent);
          mat.emissive.set(accent);
          mat.emissiveIntensity = isLight ? 0.5 : 1.5;
        }
      });
    };
    syncColor();
    const observer = new MutationObserver(syncColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] });
    return () => observer.disconnect();
  }, []);

  const angle = (104.5 * Math.PI) / 180;
  const hPos = [
    [Math.sin(angle / 2) * 2.4, Math.cos(angle / 2) * 1.2, 0],
    [-Math.sin(angle / 2) * 2.4, Math.cos(angle / 2) * 1.2, 0],
  ];
  return (
      <group ref={group} scale={responsiveScale}>
        {/* Oxygen Glass Shell */}
        <mesh>
          <sphereGeometry args={[1.1, 64, 64]} />
          <meshPhysicalMaterial ref={oMat} transmission={1} ior={1.33} thickness={2} roughness={0.1} metalness={0.1} transparent />
        </mesh>
        {/* Oxygen Glowing Core */}
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial ref={oCoreMat} toneMapped={false} />
        </mesh>

        {hPos.map((p, i) => {
          const v = new THREE.Vector3(...p);
          const dist = v.length();
          const mid = v.clone().multiplyScalar(0.5);
          const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize());
          return (
              <group key={i}>
                {/* Hydrogen Glass Shell */}
                <mesh position={p}>
                  <sphereGeometry args={[0.55, 48, 48]} />
                  <meshPhysicalMaterial ref={el => hMats.current[i] = el} transmission={1} ior={1.33} thickness={1} roughness={0.1} metalness={0.1} transparent />
                </mesh>
                {/* Hydrogen Glowing Core */}
                <mesh position={p}>
                  <sphereGeometry args={[0.2, 32, 32]} />
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} toneMapped={false} />
                </mesh>
                {/* Bonding Tube */}
                <mesh position={mid.toArray()} quaternion={q.toArray()}>
                  <cylinderGeometry args={[0.08, 0.08, dist, 16]} />
                  <meshStandardMaterial ref={el => bondMats.current[i] = el} transparent opacity={0.8} toneMapped={false} />
                </mesh>
              </group>
          );
        })}

        {/* Advanced Electron Orbitals */}
        {[2.8, 3.2, 3.6].map((radius, i) => (
           <mesh key={i} ref={el => rings.current[i] = el}>
              <torusGeometry args={[radius, 0.015, 64, 100]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
           </mesh>
        ))}
      </group>
  );
}

// function Bubbles({ count = 220 }) {
//   const meshRef = useRef();
//   const materialRef = useRef();
//   const dummy = useRef(new THREE.Object3D());
//   const particles = useRef(null);
//
//   if (!particles.current) {
//     particles.current = [];
//     for (let i = 0; i < count; i++) {
//       particles.current.push({
//         x: (Math.random() - 0.5) * 16,
//         y: (Math.random() - 0.5) * 12,
//         z: (Math.random() - 0.5) * 8 - 2,
//         speed: 0.005 + Math.random() * 0.012,
//         scale: 0.15 + Math.random() * 0.85,
//         wobbleSpeed: 0.5 + Math.random() * 2,
//         wobbleOffset: Math.random() * Math.PI * 2,
//         wobbleSize: 0.05 + Math.random() * 0.15,
//       });
//     }
//   }
//
//   useEffect(() => {
//     const syncColor = () => {
//       if (!materialRef.current) return;
//       const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00d4aa';
//       materialRef.current.color.set(accent);
//       materialRef.current.emissive.set(accent);
//     };
//     syncColor();
//     const observer = new MutationObserver(syncColor);
//     observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'data-theme'] });
//     return () => observer.disconnect();
//   }, []);
//
//   useFrame((state) => {
//     if (!meshRef.current) return;
//     const time = state.clock.elapsedTime;
//     particles.current.forEach((p, i) => {
//       p.y += p.speed;
//       if (p.y > 6) p.y = -6;
//       const wobbleX = Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * p.wobbleSize;
//       const wobbleZ = Math.cos(time * p.wobbleSpeed + p.wobbleOffset) * p.wobbleSize;
//       dummy.current.position.set(p.x + wobbleX, p.y, p.z + wobbleZ);
//       dummy.current.scale.setScalar(p.scale);
//       dummy.current.updateMatrix();
//       meshRef.current.setMatrixAt(i, dummy.current.matrix);
//     });
//     meshRef.current.instanceMatrix.needsUpdate = true;
//   });
//
//   return (
//     <instancedMesh ref={meshRef} args={[null, null, count]}>
//       <sphereGeometry args={[0.03, 32, 32]} />
//       <meshPhysicalMaterial
//         ref={materialRef}
//         color="#00d4aa"
//         emissive="#00d4aa"
//         emissiveIntensity={0.6}
//         metalness={0.2}
//         roughness={0.1}
//         clearcoat={1}
//         transparent opacity={0.7}
//         depthWrite={false}
//       />
//     </instancedMesh>
//   );
// }

// function FireParticles({ count = 80 }) {
//   const meshRef = useRef();
//   const glowRef = useRef();
//   const materialRef = useRef();
//   const glowMatRef = useRef();
//   const dummy = useRef(new THREE.Object3D());
//   const particles = useRef(null);
//
//   if (!particles.current) {
//     particles.current = [];
//     for (let i = 0; i < count; i++) {
//       particles.current.push({
//         x: (Math.random() - 0.5) * 16,
//         y: (Math.random() - 0.5) * 12,
//         z: (Math.random() - 0.5) * 8 - 2,
//         speed: 0.001 + Math.random() * 0.003, // Very slow, gentle float
//         scale: 0.004 + Math.random() * 0.012, // Tiny, elegant sparks
//         wobbleSpeed: 0.2 + Math.random() * 1.0,
//         wobbleOffset: Math.random() * Math.PI * 2,
//         wobbleSize: 0.01 + Math.random() * 0.02,
//         tailLength: 2 + Math.random() * 4,    // Short, soft tails
//       });
//     }
//   }
//
//   useEffect(() => {
//     const syncColor = () => {
//       if (!materialRef.current || !glowMatRef.current) return;
//       const isLight = document.documentElement.getAttribute('data-theme') === 'light';
//       const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00d4aa';
//
//       materialRef.current.color.set(isLight ? accent : '#ffffff');
//       materialRef.current.emissive.set(isLight ? accent : '#ffffff');
//       materialRef.current.emissiveIntensity = isLight ? 0.8 : 1.5;
//
//       glowMatRef.current.color.set(accent);
//       glowMatRef.current.emissive.set(accent);
//     };
//     syncColor();
//     const observer = new MutationObserver(syncColor);
//     observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'data-theme'] });
//     return () => observer.disconnect();
//   }, []);
//
//   useFrame((state) => {
//     if (!meshRef.current || !glowRef.current) return;
//     const time = state.clock.elapsedTime;
//     particles.current.forEach((p, i) => {
//       p.y += p.speed;
//       if (p.y > 6) {
//         p.y = -6;
//         p.x = (Math.random() - 0.5) * 16;
//       }
//
//       const wobbleX = Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * p.wobbleSize;
//       const wobbleZ = Math.cos(time * p.wobbleSpeed + p.wobbleOffset) * p.wobbleSize;
//       const windX = Math.sin(time * 0.2 + p.y * 0.2) * 0.1;
//
//       const lifeProgress = Math.max(0, (p.y + 6) / 12);
//       const currentScale = p.scale * (1 - lifeProgress);
//       const flicker = 0.8 + Math.sin(time * 8 + p.wobbleOffset) * 0.2;
//
//       const posX = p.x + wobbleX + windX;
//       const posY = p.y;
//       const posZ = p.z + wobbleZ;
//
//       dummy.current.position.set(posX, posY, posZ);
//       dummy.current.scale.setScalar(currentScale * flicker);
//       dummy.current.updateMatrix();
//       meshRef.current.setMatrixAt(i, dummy.current.matrix);
//
//       const tailStretch = p.tailLength * flicker;
//       dummy.current.position.set(posX, posY - (currentScale * tailStretch * 0.5), posZ);
//       dummy.current.scale.set(currentScale * 1.5, currentScale * tailStretch, currentScale * 1.5);
//       dummy.current.updateMatrix();
//       glowRef.current.setMatrixAt(i, dummy.current.matrix);
//     });
//     meshRef.current.instanceMatrix.needsUpdate = true;
//     glowRef.current.instanceMatrix.needsUpdate = true;
//   });
//
//   return (
//     <group>
//       <instancedMesh ref={glowRef} args={[null, null, count]}>
//         <sphereGeometry args={[1, 16, 16]} />
//         <meshStandardMaterial ref={glowMatRef} emissiveIntensity={1} transparent opacity={0.15} depthWrite={false} />
//       </instancedMesh>
//       <instancedMesh ref={meshRef} args={[null, null, count]}>
//         <sphereGeometry args={[1, 16, 16]} />
//         <meshStandardMaterial ref={materialRef} transparent opacity={0.9} depthWrite={false} />
//       </instancedMesh>
//     </group>
//   );
// }

const TOPICS = ['Alkaline Electrolysis',
                        'Power-to-X',
                        'Techno-Economic Analysis',
                        'Model Predictive Control',
                        'Hydrogen Systems',
                        'Python Programming'
                      ];

export default function Hero() {
  const titleRef = useRef(null);
  const topicsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.4 });
      tl.from('.hero .eyebrow', { y: 18, opacity: 0, duration: 0.8 })
        .from('.hero .word', { y: 80, opacity: 0, duration: 1.1, stagger: 0.08 }, '-=0.5')
        .from('.hero .role', { y: 18, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.scroll-cue, .hero-meta', { y: 12, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4');
    });

    let alive = true;
    let i = 0;
    const cursor = '<span class="cursor"></span>';
    (async () => {
      while (alive) {
        const word = TOPICS[i % TOPICS.length];
        for (let n = 0; n <= word.length; n++) {
          if (!alive) return;
          if (topicsRef.current) topicsRef.current.innerHTML = word.slice(0, n) + cursor;
          await new Promise(r => setTimeout(r, 55));
        }
        await new Promise(r => setTimeout(r, 1700));
        for (let n = word.length; n >= 0; n--) {
          if (!alive) return;
          if (topicsRef.current) topicsRef.current.innerHTML = word.slice(0, n) + cursor;
          await new Promise(r => setTimeout(r, 30));
        }
        i++;
      }
    })();
    return () => { 
      alive = false; 
      ctx.revert();
    };
  }, []);

  return (
    <header id="top" className="hero">
      <div className="hero-canvas">
        <Canvas camera={{ position: [0, 0, 9], fov: 45 }} dpr={[1, 1.5]}>
          <Environment preset="city" />
          <ambientLight intensity={0.4} color="#4060a0" />
          <directionalLight position={[5, 5, 5]} intensity={1.2} color="#00d4aa" />
          <directionalLight position={[-5, -3, 4]} intensity={0.8} color="#6366f1" />
          <pointLight position={[0, 0, -6]} intensity={0.4} />
          <WaterMolecule />
          {/*<Bubbles />*/}
          {/*<FireParticles />*/}
        </Canvas>
      </div>
      <div className="hero-grid" />
      <div className="hero-inner">
        <div className="eyebrow">DLR · Stuttgart</div>
        <h1 ref={titleRef} className="hero-title">
          <span className="word">Hydrogen</span>{' '}
          <span className="word"><em>at</em></span>{' '}
          <span className="word">scale.</span>
        </h1>
        <div className="role">
          Doctoral Researcher
          <span className="dot" />
          German Aerospace Center (DLR)
          <span className="dot" />
          He / Him
        </div>
        <div className="topics" ref={topicsRef}><span className="cursor" /></div>
      </div>
      <div className="hero-meta">
        <span className="live">Now researching</span>
        <span>Alkaline electrolyzer system performance</span>
        <span>48° 44′ N · 9° 6′ E</span>
      </div>
      <a href="#about" className="scroll-cue" onClick={(e) => { e.preventDefault(); document.querySelector('#about').scrollIntoView({ behavior: 'smooth' }); }}>
        <span className="text">Scroll</span><span className="line" />
      </a>
      <style>{`
        .hero { position: relative; min-height: 100vh; height: 100vh;
          display: flex; align-items: center; justify-content: center; overflow: hidden;
          background: radial-gradient(1200px 600px at 50% 30%, #15224b 0%, var(--navy) 60%); color: var(--ink); }
        html[data-theme="light"] .hero { background: radial-gradient(1200px 600px at 50% 30%, #e3ecff 0%, #fafafb 60%); color: #0e1426; }
        .hero-canvas { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .hero-grid { position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background-image: linear-gradient(to right, color-mix(in oklab, var(--fg) 6%, transparent) 1px, transparent 1px),
                            linear-gradient(to bottom, color-mix(in oklab, var(--fg) 6%, transparent) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%); }
        .hero-inner { position: relative; z-index: 3; text-align: center; max-width: 1100px; padding: 0 var(--pad); }
        .eyebrow { font-family: var(--mono); font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
          color: var(--accent); margin-bottom: 28px; display: inline-flex; align-items: center; gap: 12px; }
        .eyebrow::before, .eyebrow::after { content: ""; display: inline-block; width: 32px; height: 1px; background: var(--accent); opacity: .6; }
        .hero-title { font-family: var(--serif); font-weight: 500; font-size: clamp(48px, 9vw, 112px);
          line-height: 1; letter-spacing: -.02em; margin: 0; color: inherit;
          text-shadow: 0 4px 32px rgba(0,0,0,0.6), 0 0 16px rgba(0,0,0,0.4); }
        .word { display: inline-block; }
        .hero-title em { font-style: italic; font-weight: 400;
          background: linear-gradient(120deg, var(--accent) 0%, var(--accent-2) 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent; }
        .role { margin-top: 24px; font-size: clamp(15px, 1.4vw, 18px); color: var(--fg-soft); text-shadow: 0 0 12px rgba(0,0,0,0.8); }
        .role .dot { display: inline-block; width: 4px; height: 4px; border-radius: 50%; background: var(--accent);
          margin: 0 12px; vertical-align: middle; transform: translateY(-2px); }
        .topics { margin-top: 18px; font-family: var(--mono); font-size: 13px; letter-spacing: 1px;
          text-transform: uppercase; color: var(--fg-soft); min-height: 18px; text-shadow: 0 0 12px rgba(0,0,0,0.8); }
        .cursor { display: inline-block; width: 8px; height: 20px; background: var(--accent);
          margin-left: 6px; vertical-align: middle; border-radius: 2px;
          box-shadow: 0 0 12px 2px color-mix(in oklab, var(--accent) 70%, transparent);
          animation: blink 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; transform: scaleY(1); } 50% { opacity: 0.3; transform: scaleY(0.8); } }
        .hero-meta { position: absolute; left: var(--pad); bottom: 28px; z-index: 3;
          font-family: var(--mono); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--fg-soft); display: flex; flex-direction: column; gap: 4px; text-shadow: 0 0 12px rgba(0,0,0,0.8); }
        .hero-meta .live { color: var(--accent); display: inline-flex; align-items: center; gap: 10px; }
        .hero-meta .live::before { content: ""; width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent); box-shadow: 0 0 8px var(--accent); animation: pulse 1.6s infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
        .scroll-cue { position: absolute; right: var(--pad); bottom: 28px; z-index: 3;
          font-family: var(--mono); font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
          color: var(--fg-soft); display: flex; align-items: center; gap: 12px;
          transition: color 0.3s ease; cursor: pointer; text-shadow: 0 0 12px rgba(0,0,0,0.8); }
        .scroll-cue:hover { color: var(--accent); }
        .scroll-cue .line { position: relative; width: 2px; height: 64px; border-radius: 2px;
          background: color-mix(in oklab, var(--rule-c) 80%, transparent); overflow: hidden; transition: background 0.3s ease; }
        .scroll-cue:hover .line { background: color-mix(in oklab, var(--accent) 25%, transparent); }
        .scroll-cue .line::after { content: ""; position: absolute; left: 0; top: -40px; width: 2px; height: 40px; border-radius: 2px;
          background: linear-gradient(to bottom, transparent, var(--accent)); box-shadow: 0 4px 10px 1px var(--accent);
          animation: scrollDown 1.8s cubic-bezier(0.7,0,0.3,1) infinite; }
        @keyframes scrollDown { 0% { top: -40px; } 100% { top: 64px; } }
        
        @media (max-width: 768px) { 
          .scroll-cue .text { display: none; } 
          .hero-meta { max-width: calc(100vw - 80px); } 
        }
        
        /* Light Theme Overrides */
        [data-theme="light"] .hero-title { color: #0f172a; }
        [data-theme="light"] .hero-title .word {
          text-shadow: 0 4px 32px rgba(255,255,255,1), 0 0 16px rgba(255,255,255,0.9);
        }
        [data-theme="light"] .hero-title .word:not(:nth-child(2)) {
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.8);
        }
        [data-theme="light"] .hero .role,
        [data-theme="light"] .hero .topics,
        [data-theme="light"] .hero .hero-meta,
        [data-theme="light"] .scroll-cue {
          color: #475569;
          text-shadow: 0 0 12px rgba(255, 255, 255, 0.9), 0 0 24px rgba(255, 255, 255, 0.6);
          font-weight: 500;
        }
        [data-theme="light"] .eyebrow {
          text-shadow: 0 0 12px rgba(255, 255, 255, 0.9);
        }
      `}</style>
    </header>
  );
}
