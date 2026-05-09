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
        sessionStorage.setItem('dj_portfolio_loaded', 'true');
        setTimeout(() => {
          setPhase('exiting');
          setTimeout(() => setPhase('hidden'), 1000); // Lightweight smooth fade out
        }, 1200); // Epic 1.2s granted pause to admire the unlock
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div id="preloader" ref={rootRef} className={`phase-${phase}`}>
        <div className="pl-content" ref={contentRef} style={{ '--p-bar': '0%', '--p-mask': '0%', '--flare-o': '0' }}>
          <div className="pl-brand" data-text="Darshan Jogani">Darshan Jogani</div>
          <div className="pl-bottom-wrap">
            <div className="pl-bottom">
              <span className="pl-status" style={{ minWidth: '120px', textAlign: 'left', whiteSpace: 'nowrap' }}>
                SYS.INIT{phase === 'loading' && <span className="pl-cursor">_</span>}
              </span>
              <div className="pl-bar"><div className="pl-bar-inner"></div></div>
              <span className="pl-percent" ref={percentRef}>000%</span>
            </div>
            <div className="pl-granted-msg">
              ACCESS GRANTED<span className="pl-cursor">_</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        body #preloader {
          position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center;
          background: radial-gradient(1200px 600px at 50% 30%, #15224b 0%, var(--navy, #0a1020) 60%);
          color: var(--fg);
          pointer-events: all;
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.8s;
          will-change: opacity, visibility;
        }
        html[data-theme="light"] body #preloader {
          background: radial-gradient(1200px 600px at 50% 30%, #e3ecff 0%, #fafafb 60%);
        }
        body #preloader.phase-exiting { opacity: 0; visibility: hidden; pointer-events: none; }
        body #preloader.phase-hidden { display: none; }
        
        .pl-content {
          display: flex; flex-direction: column; align-items: center; gap: 40px;
          transition: transform 0.8s cubic-bezier(0.5, 0, 0.2, 1), opacity 0.6s ease;
          will-change: transform, opacity;
        }
        .phase-exiting .pl-content {
          transform: scale(1.05) translateY(-10px);
          opacity: 0;
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
        clip-path: polygon(0 0, var(--p-mask) 0, var(--p-mask) 100%, 0 100%);
        -webkit-clip-path: polygon(0 0, var(--p-mask) 0, var(--p-mask) 100%, 0 100%);
          text-shadow: 0 0 20px color-mix(in oklab, var(--accent) 50%, transparent);
        }
        .pl-brand::after {
          content: "";
          position: absolute; left: var(--p-mask); top: -15%; bottom: -15%; width: 4px;
          background: #ffffff; border-radius: 4px;
          box-shadow: 0 0 16px 2px var(--accent), 0 0 40px 8px var(--accent);
          transform: translateX(-50%) rotate(12deg);
          opacity: var(--flare-o);
        }
        
        .pl-bottom {
          display: flex; align-items: center; gap: 24px;
          font-family: var(--mono); font-size: 11px; color: var(--fg-soft);
          letter-spacing: 2px; text-transform: uppercase;
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
        
        .pl-bottom-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .pl-granted-msg {
          position: absolute;
          top: 100%;
          margin-top: 24px;
          font-family: var(--mono);
          font-size: clamp(18px, 4vw, 28px);
          font-weight: 700;
          color: #10b981;
          letter-spacing: 24px;
          opacity: 0;
          filter: blur(8px);
          transform: translateY(-15px) scale(0.9);
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          white-space: nowrap;
          pointer-events: none;
          display: flex;
          align-items: center;
        }
        .phase-granted .pl-granted-msg, .phase-exiting .pl-granted-msg {
          opacity: 1;
          filter: blur(0);
          letter-spacing: 4px;
          transform: translateY(0) scale(1);
          animation: granted-glow 1.2s ease-out forwards;
        }
        
        .pl-granted-msg::before, .pl-granted-msg::after {
          content: "";
          position: absolute;
          top: 50%;
          width: clamp(20px, 8vw, 80px);
          height: 1px;
          background: #10b981;
          box-shadow: 0 0 10px 2px #10b981;
          transform: scaleX(0);
          transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s, opacity 0.3s;
          opacity: 0;
        }
        .pl-granted-msg::before { right: 100%; margin-right: 16px; transform-origin: right; }
        .pl-granted-msg::after { left: 100%; margin-left: 16px; transform-origin: left; }

        .phase-granted .pl-granted-msg::before, .phase-exiting .pl-granted-msg::before,
        .phase-granted .pl-granted-msg::after, .phase-exiting .pl-granted-msg::after {
          transform: scaleX(1);
          opacity: 1;
        }

        @media (max-width: 600px) { 
          .pl-content { gap: 24px; }
          .pl-brand { letter-spacing: 0px; }
          .pl-bottom { gap: 12px; font-size: 10px; }
          .pl-bar { width: 120px; } 
          .pl-granted-msg { margin-top: 16px; letter-spacing: 12px; }
          .phase-granted .pl-granted-msg, .phase-exiting .pl-granted-msg { letter-spacing: 2px; }
        }
        @keyframes brand-fade-in {
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes granted-glow {
          0% { text-shadow: 0 0 20px #fff, 0 0 40px #fff; color: #fff; }
          20% { text-shadow: 0 0 30px #10b981, 0 0 60px #10b981; color: #10b981; }
          100% { text-shadow: 0 0 16px rgba(16, 185, 129, 0.8), 0 0 32px rgba(16, 185, 129, 0.4); color: #10b981; }
        }
      `}</style>
    </>
  );
}
