import React, { useEffect, useRef, useState } from 'react';
import katex from 'katex';

export default function Equation({ tex, display = true, className = '' }) {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    katex.render(tex, ref.current, { displayMode: display, throwOnError: false, output: 'html' });
  }, [tex, display]);

  const handleCopy = () => {
    navigator.clipboard.writeText(tex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`eq-wrapper ${className}`} onClick={handleCopy}>
      <div ref={ref} className="eq-content" />
      <div className={`eq-toast ${copied ? 'show' : ''}`}>
        {copied ? 'Copied!' : 'Copy LaTeX'}
      </div>
      
      <style>{`
        .eq-wrapper {
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 8px;
          padding: 12px 8px;
          margin: -12px -8px; /* Offset padding so it doesn't shift layout */
        }
        .eq-wrapper:hover {
          background: color-mix(in oklab, var(--accent) 5%, transparent);
        }
        .eq-wrapper:active {
          transform: scale(0.98);
        }
        .eq-content {
          transition: filter 0.3s ease;
          opacity: 0; filter: blur(8px);
          animation: holo-boot 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s forwards;
        }
        @keyframes holo-boot {
          0% { opacity: 0; filter: blur(8px); transform: scale(0.98); }
          100% { opacity: 1; filter: blur(0); transform: scale(1); }
        }
        .eq-wrapper:hover .eq-content {
          filter: drop-shadow(0 0 8px color-mix(in oklab, var(--accent) 40%, transparent));
        }
        .eq-toast {
          position: absolute; top: -12px; right: 8px;
          font-family: var(--mono); font-size: 10px; font-weight: 600;
          letter-spacing: 1px; text-transform: uppercase;
          background: var(--accent); color: var(--bg);
          padding: 4px 8px; border-radius: 4px;
          opacity: 0; transform: translateY(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none; z-index: 10;
        }
        .eq-wrapper:hover .eq-toast { opacity: 1; transform: translateY(0); }
        .eq-toast.show { opacity: 1; transform: translateY(-4px); background: #10b981; color: #ffffff; box-shadow: 0 0 12px #10b981; }
        
        /* Prevent long equations from breaking mobile viewports */
        .katex-display { overflow-x: auto; overflow-y: hidden; padding-bottom: 4px; }
        .katex-display::-webkit-scrollbar { height: 4px; }
        .katex-display::-webkit-scrollbar-track { background: transparent; }
        .katex-display::-webkit-scrollbar-thumb { background: color-mix(in oklab, var(--accent) 30%, transparent); border-radius: 2px; }
      `}</style>
    </div>
  );
}
