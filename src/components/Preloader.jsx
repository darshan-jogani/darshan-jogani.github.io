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
        <div className="water-ripple r1"></div>
        <div className="water-ripple r2"></div>
        <div className="water-ripple r3"></div>
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
          transition: transform 1.5s cubic-bezier(0.7, 0, 0.2, 1), opacity 1.2s ease, filter 1.5s ease;
          will-change: transform, opacity, filter;
        }
        .phase-exiting .pl-content {
          transform: scale(2.5);
          opacity: 0;
          filter: blur(12px);
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
        
        /* Water Ripples */
        .water-ripple {
          position: absolute; left: 50%; top: 50%;
          width: 200px; height: 200px; margin-left: -100px; margin-top: -100px;
          border-radius: 50%;
          border: 2px solid var(--accent);
          box-shadow: inset 0 0 20px var(--accent), 0 0 20px var(--accent);
          opacity: 0; transform: scale(0);
          pointer-events: none;
          will-change: transform, opacity;
        }
        .phase-exiting .water-ripple.r1 { animation: ripple-wave 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .phase-exiting .water-ripple.r2 { animation: ripple-wave 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s forwards; }
        .phase-exiting .water-ripple.r3 { animation: ripple-wave 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s forwards; }

        @keyframes ripple-wave {
          0% { transform: scale(0.1); opacity: 1; border-width: 8px; }
          100% { transform: scale(25); opacity: 0; border-width: 1px; }
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
