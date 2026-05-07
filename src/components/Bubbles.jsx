import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Bubbles({ count = 220 }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const dummy = useRef(new THREE.Object3D());
  const particles = useRef(null);

  if (!particles.current) {
    particles.current = [];
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x: (Math.random() - 0.5) * 16,
        y: (Math.random() - 0.5) * 12,
        z: (Math.random() - 0.5) * 8 - 2,
        speed: 0.005 + Math.random() * 0.012,
        scale: 0.15 + Math.random() * 0.85,
        wobbleSpeed: 0.5 + Math.random() * 2,
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleSize: 0.05 + Math.random() * 0.15,
      });
    }
  }

  useEffect(() => {
    const syncColor = () => {
      if (!materialRef.current) return;
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00d4aa';
      materialRef.current.color.set(accent);
      materialRef.current.emissive.set(accent);
      materialRef.current.emissiveIntensity = isLight ? 0.3 : 0.6;
      materialRef.current.opacity = isLight ? 0.4 : 0.7;
    };
    syncColor();
    const observer = new MutationObserver(syncColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'data-theme'] });
    return () => observer.disconnect();
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    particles.current.forEach((p, i) => {
      p.y += p.speed;
      if (p.y > 6) p.y = -6;
      const wobbleX = Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * p.wobbleSize;
      const wobbleZ = Math.cos(time * p.wobbleSpeed + p.wobbleOffset) * p.wobbleSize;
      dummy.current.position.set(p.x + wobbleX, p.y, p.z + wobbleZ);
      dummy.current.scale.setScalar(p.scale);
      dummy.current.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.current.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.03, 32, 32]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color="#00d4aa"
        emissive="#00d4aa"
        emissiveIntensity={0.6}
        metalness={0.2}
        roughness={0.1}
        clearcoat={1}
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
