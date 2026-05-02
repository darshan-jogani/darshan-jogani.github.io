import React, { useEffect, useState, useRef } from 'react';

export default function Preloader() {
  const [hidden, setHidden] = useState(false);
  const contentRef = useRef(null);
  const percentRef = useRef(null);

  useEffect(() => {
    let startTime;
    const duration = 1200; // loading animation time
    let raf;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const p = Math.min((time - startTime) / duration, 1);
      const easeP = 1 - Math.pow(1 - p, 4); // Quartic ease out

      if (contentRef.current) contentRef.current.style.setProperty('--p', `${easeP * 100}%`);
      if (percentRef.current) percentRef.current.textContent = `${Math.floor(easeP * 100).toString().padStart(3, '0')}%`;

      if (p < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setTimeout(() => setHidden(true), 250); // brief pause at 100%
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div id="preloader" className={hidden ? 'hidden' : ''}>
        <div className="pl-content" ref={contentRef} style={{ '--p': '0%' }}>
          <div className="pl-brand">Darshan Jogani</div>
          <div className="pl-bottom">
            <span className="pl-status">SYS.INIT</span>
            <div className="pl-bar"><div className="pl-bar-inner"></div></div>
            <span className="pl-percent" ref={percentRef}>000%</span>
          </div>
        </div>
      </div>
      <style>{`
        body #preloader {
          position: fixed; inset: 0; z-index: 9999;
          background: var(--bg); display: flex; align-items: center; justify-content: center;
          transition: background-color .4s ease, opacity .8s cubic-bezier(0.7,0,0.3,1), visibility .8s;
        }
        body #preloader.hidden { opacity: 0; visibility: hidden; }
        body #preloader.hidden .pl-content { transform: scale(1.05); opacity: 0; }
        
        .pl-content {
          display: flex; flex-direction: column; align-items: center; gap: 40px;
          transition: transform .8s cubic-bezier(0.7,0,0.3,1), opacity .8s ease;
        }
        .pl-brand {
          font-family: var(--serif); font-size: 72px; font-weight: 700;
          color: transparent; -webkit-text-stroke: 1px var(--rule-c);
          position: relative; letter-spacing: -2px; display: inline-block;
        }
        .pl-brand::after {
          content: "Darshan Jogani"; position: absolute; left: 0; top: 0; bottom: 0;
          color: var(--fg); -webkit-text-stroke: 0;
          overflow: hidden; width: var(--p); white-space: nowrap;
          border-right: 2px solid var(--accent, var(--teal));
          filter: drop-shadow(0 0 16px color-mix(in oklab, var(--accent, var(--teal)) 40%, transparent));
        }
        
        .pl-bottom {
          display: flex; align-items: center; gap: 20px;
          font-family: var(--mono); font-size: 11px; color: var(--fg-soft);
          letter-spacing: 2px; text-transform: uppercase;
        }
        .pl-bar {
          width: 160px; height: 1px; background: var(--rule-c);
          position: relative;
        }
        .pl-bar-inner {
          position: absolute; left: 0; top: 0; bottom: 0;
          background: var(--accent, var(--teal)); width: var(--p);
          box-shadow: 0 0 12px var(--accent, var(--teal));
        }
        .pl-percent { width: 44px; text-align: right; font-weight: 500; color: var(--fg); }
        
        @media (max-width: 600px) { .pl-bar { width: 100px; } }
      `}</style>
    </>
  );
}
