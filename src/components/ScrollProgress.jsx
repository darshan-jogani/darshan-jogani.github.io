import React, { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const ref = useRef(null);

  useEffect(() => {
    let raf;
    const fn = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const pct = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100;
        
        if (ref.current) {
          ref.current.style.width = `${pct}%`;
          // Smoothly fade out when at the absolute top
          ref.current.style.opacity = pct > 0.5 ? '1' : '0';
        }
      });
    };

    window.addEventListener('scroll', fn, { passive: true });
    fn();
    
    return () => {
      window.removeEventListener('scroll', fn);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div id="scroll-prog" ref={ref}><div className="sp-glow"></div></div>
      <style>{`
        body #scroll-prog {
          position: fixed; left: 0; top: 0; height: 2px; z-index: 100;
          background: linear-gradient(90deg, transparent, var(--accent, #00d4aa));
          pointer-events: none; transition: opacity 0.3s ease; will-change: width;
        }
        .sp-glow {
          position: absolute; right: 0; top: 50%; transform: translateY(-50%);
          width: 8px; height: 8px; border-radius: 50%; background: #ffffff;
          box-shadow: 0 0 16px 4px var(--accent, #00d4aa);
        }
      `}</style>
    </>
  );
}
