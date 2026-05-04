import React, { useEffect, useState, useRef } from 'react';

export default function Preloader() {
  const [phase, setPhase] = useState('loading'); // 'loading', 'granted', 'exiting', 'hidden'
  const contentRef = useRef(null);
  const percentRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    let startTime;
    const duration = 2400; // Increased for a highly cinematic, silky smooth load
    let raf;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const p = Math.min((time - startTime) / duration, 1);
      
      // Quintic ease out: extremely smooth coasting tail
      const easeP = 1 - Math.pow(1 - p, 5); 

      if (contentRef.current) {
        contentRef.current.style.setProperty('--p-bar', `${easeP * 100}%`);
        contentRef.current.style.setProperty('--p-mask', `${easeP * 120}%`); // Overshoots to completely clear text
        
        // Flare opacity fades in at start, fades out gracefully at the end
        const flareOpacity = easeP < 0.05 ? easeP * 20 : (easeP > 0.95 ? (1 - easeP) * 20 : 1);
        contentRef.current.style.setProperty('--flare-o', flareOpacity);
      }
      if (percentRef.current) percentRef.current.textContent = `${Math.floor(easeP * 100).toString().padStart(3, '0')}%`;

      if (p < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setPhase('granted');
        setTimeout(() => {
          setPhase('exiting');
          setTimeout(() => setPhase('hidden'), 1500); // Wait for the 1.5s CSS exit animation
        }, 800); // Admire "ACCESS GRANTED" for 800ms
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div id="preloader" ref={rootRef} className={`phase-${phase}`}>
        <div className="quantum-flash"></div>
        <div className="orbital-wrap w1"><div className="orbital-ring"></div></div>
        <div className="orbital-wrap w2"><div className="orbital-ring"></div></div>
        <div className="orbital-wrap w3"><div className="orbital-ring"></div></div>
        <div className="pl-content" ref={contentRef} style={{ '--p-bar': '0%', '--p-mask': '0%', '--flare-o': '0' }}>
          <div className="pl-brand" data-text="Darshan Jogani">Darshan Jogani</div>
          <div className="pl-bottom">
            <span className="pl-status" style={{ minWidth: '120px', textAlign: 'left', whiteSpace: 'nowrap' }}>
              {phase === 'loading' ? 'SYS.INIT' : 'ACCESS GRANTED'}
              <span className="pl-cursor">_</span>
            </span>
            <div className="pl-bar"><div className="pl-bar-inner"></div></div>
            <span className="pl-percent" ref={percentRef}>000%</span>
          </div>
        </div>
      </div>
      <style>{`
        body #preloader {
          position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center;
          background-color: var(--bg); color: var(--fg);
          transition: background-color 1.2s ease;
        }
        body #preloader.phase-exiting { background-color: transparent; pointer-events: none; }
        body #preloader.phase-hidden { display: none; }
        
        .pl-content {
          display: flex; flex-direction: column; align-items: center; gap: 40px;
          transition: transform 1.5s cubic-bezier(0.5, 0, 0.2, 1), opacity 1.2s ease, filter 1.5s ease;
          will-change: transform, opacity, filter;
        }
        .phase-exiting .pl-content {
          transform: scale(4) translateZ(100px);
          opacity: 0;
          filter: blur(8px);
        }
        .pl-brand {
          font-family: var(--serif); font-size: clamp(36px, 10vw, 84px); font-weight: 600;
          color: transparent; -webkit-text-stroke: 1px color-mix(in oklab, var(--rule-c) 60%, transparent);
          position: relative; letter-spacing: -1px; display: inline-block;
          transform: scale(0.95); opacity: 0;
          animation: brand-fade-in 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .pl-brand::before {
          content: attr(data-text); position: absolute; left: 0; top: 0; bottom: 0;
          color: var(--fg); -webkit-text-stroke: 0;
          white-space: nowrap;
          mask-image: linear-gradient(to right, black calc(var(--p-mask) - 20%), transparent var(--p-mask));
          -webkit-mask-image: linear-gradient(to right, black calc(var(--p-mask) - 20%), transparent var(--p-mask));
          text-shadow: 0 0 20px color-mix(in oklab, var(--accent) 50%, transparent);
        }
        .pl-brand::after {
          content: "";
          position: absolute; left: var(--p-mask); top: -15%; bottom: -15%; width: 4px;
          background: #ffffff; border-radius: 4px;
          box-shadow: 0 0 16px 2px var(--accent), 0 0 40px 8px var(--accent);
          transform: translateX(-50%) rotate(12deg);
          opacity: var(--flare-o);
          mix-blend-mode: screen;
        }
        
        .pl-bottom {
          display: flex; align-items: center; gap: 24px;
          font-family: var(--mono); font-size: 11px; color: var(--fg-soft);
          letter-spacing: 2px; text-transform: uppercase;
        }
        .pl-status { transition: color 0.4s, text-shadow 0.4s; }
        .phase-granted .pl-status, .phase-exiting .pl-status {
          color: #10b981;
          text-shadow: 0 0 12px rgba(16, 185, 129, 0.8);
        }
        .pl-cursor { animation: blink 1s step-end infinite; }
        .pl-bar {
          width: 200px; height: 2px; background: color-mix(in oklab, var(--rule-c) 40%, transparent);
          position: relative; border-radius: 2px;
        }
        .pl-bar-inner {
          position: absolute; left: 0; top: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, var(--accent), #ffffff);
          width: var(--p-bar); border-radius: 2px;
          box-shadow: 0 0 12px var(--accent), 0 0 24px var(--accent);
          transition: background 0.4s, box-shadow 0.4s;
        }
        .phase-granted .pl-bar-inner, .phase-exiting .pl-bar-inner {
          background: linear-gradient(90deg, transparent, #10b981, #ffffff);
          box-shadow: 0 0 12px #10b981, 0 0 24px #10b981;
        }
        .pl-bar-inner::after {
          content: "";
          position: absolute; right: 0; top: 50%; transform: translateY(-50%);
          width: 8px; height: 8px; background: #ffffff; border-radius: 50%;
          box-shadow: 0 0 12px 3px var(--accent), 0 0 24px 6px var(--accent);
          transition: box-shadow 0.4s;
        }
        .phase-granted .pl-bar-inner::after, .phase-exiting .pl-bar-inner::after {
          box-shadow: 0 0 12px 3px #10b981, 0 0 24px 6px #10b981;
        }
        .pl-percent { width: 44px; text-align: right; font-weight: 500; color: var(--fg); text-shadow: 0 0 12px color-mix(in oklab, var(--accent) 40%, transparent); }
        .phase-granted .pl-percent, .phase-exiting .pl-percent {
          color: #10b981; text-shadow: 0 0 12px rgba(16, 185, 129, 0.8);
        }
        
        /* Atomic Warp Effects */
        .quantum-flash {
          position: absolute; inset: -50%;
          background: radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--accent) 60%, transparent) 0%, transparent 60%);
          opacity: 0; pointer-events: none; z-index: -1;
        }
        .phase-exiting .quantum-flash {
          animation: flash-bang 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes flash-bang {
          0% { opacity: 0; transform: scale(0.5); }
          20% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(2.5); }
        }

        .orbital-wrap {
          position: absolute; left: 50%; top: 50%;
          width: 240px; height: 240px; margin-left: -120px; margin-top: -120px;
          transform-style: preserve-3d; perspective: 800px; pointer-events: none;
        }
        .w1 { transform: rotateX(65deg) rotateY(35deg); }
        .w2 { transform: rotateX(55deg) rotateY(-45deg); }
        .w3 { transform: rotateX(80deg) rotateY(15deg); }

        .orbital-ring {
          width: 100%; height: 100%; border-radius: 50%;
          border: 1px solid var(--accent);
          box-shadow: 0 0 10px var(--accent), inset 0 0 10px var(--accent);
          opacity: 0; transform: scale(0);
        }
        .phase-exiting .w1 .orbital-ring { animation: q-expand 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .phase-exiting .w2 .orbital-ring { animation: q-expand 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards; }
        .phase-exiting .w3 .orbital-ring { animation: q-expand 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards; }

        @keyframes q-expand {
          0% { transform: scale(0.1) rotateZ(0deg); opacity: 1; }
          100% { transform: scale(20) rotateZ(90deg); opacity: 0; }
        }

        @media (max-width: 600px) { 
          .pl-content { gap: 24px; }
          .pl-brand { letter-spacing: 0px; }
          .pl-bottom { gap: 12px; font-size: 10px; }
          .pl-bar { width: 120px; } 
        }
        @keyframes brand-fade-in {
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </>
  );
}
