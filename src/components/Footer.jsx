import React, { useState, useEffect } from 'react';

export default function Footer() {
  const [visits, setVisits] = useState('...');

  useEffect(() => {
    // Intelligently check if we've already incremented in this session
    const hasVisited = sessionStorage.getItem('dj_visited');
    const action = hasVisited ? '' : '/up';
    
    fetch(`https://api.counterapi.dev/v1/darshanjogani/portfolio${action}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.count) {
          setVisits(data.count.toLocaleString());
          sessionStorage.setItem('dj_visited', 'true');
        }
      })
      .catch(() => {
        setVisits('Online'); // Safe fallback if API is temporarily unreachable
      });
  }, []);

  return (
    <footer className="foot">
      <div className="foot-flare"></div>
      <div className="container">
        <div className="foot-content">
          <div className="foot-brand">
            <h3>Darshan Jogani</h3>
            <p className="mono">Engineering the transition to sustainable energy.</p>
            
            <div className="visit-counter" title="Total Website Views">
              <div className="vc-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <div className="vc-info">
                <span className="vc-label mono">Total Explorers</span>
                <span className="vc-count mono">{visits}</span>
              </div>
            </div>
          </div>
          
          <div className="foot-nav">
            <div className="nav-col">
              <span className="mono small heading">Index</span>
              <a href="#about">About</a>
              <a href="#research">Research</a>
              <a href="/lab">Research Lab ↗</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="nav-col">
              <span className="mono small heading">Connect</span>
              <a href="https://github.com/darshan-jogani" target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href="https://www.linkedin.com/in/darshan-jogani/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href="https://orcid.org/0009-0007-8954-4934" target="_blank" rel="noreferrer">ORCID ↗</a>
            </div>
          </div>
        </div>
        
        <div className="foot-base">
          <div className="base-left">
            <span className="mono small copy-text">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M14.83 14.83a4 4 0 1 1 0-5.66"/></svg>
              {new Date().getFullYear()} Darshan Jogani.
            </span>
            <span className="mono small status-wrap">
              <span className="status-dot-foot"></span> All systems nominal
            </span>
          </div>
          <button className="top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="mono small">Back to top</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          </button>
        </div>
      </div>
      <style>{`
        .foot { position: relative; padding: 80px 0 40px; background: var(--bg); color: var(--fg); overflow: hidden; border-top: 1px solid var(--rule-c); }
        .foot .container { position: relative; z-index: 2; }
        
        .foot-flare { position: absolute; top: -1px; left: 50%; transform: translateX(-50%); width: 60vw; height: 2px; background: radial-gradient(circle, var(--accent) 0%, transparent 100%); box-shadow: 0 0 24px 4px var(--accent); opacity: 0.6; }

        .foot-content { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 40px; margin-bottom: 80px; }
        .foot-brand h3 { font-family: var(--serif); font-size: clamp(24px, 5vw, 32px); font-weight: 500; margin: 0 0 16px; color: var(--fg); letter-spacing: -0.02em; }
        .foot-brand p { color: var(--fg-soft); font-size: 15px; line-height: 1.6; max-width: 320px; margin: 0; }
        
        .visit-counter {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-top: 32px;
          padding: 8px 16px 8px 8px;
          background: color-mix(in oklab, var(--accent) 10%, transparent);
          border: 1px solid color-mix(in oklab, var(--accent) 30%, transparent);
          border-radius: 999px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: default;
        }
        .visit-counter:hover {
          background: color-mix(in oklab, var(--accent) 15%, transparent);
          border-color: var(--accent);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 24px -6px color-mix(in oklab, var(--accent) 50%, transparent);
        }
        .vc-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--accent);
          color: #061a14;
          border-radius: 50%;
          box-shadow: 0 0 12px color-mix(in oklab, var(--accent) 80%, transparent);
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .visit-counter:hover .vc-icon {
          transform: scale(1.1);
        }
        .vc-info { display: flex; flex-direction: column; gap: 3px; }
        .vc-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--fg-soft); line-height: 1; }
        .vc-count { font-size: 14px; font-weight: 600; color: var(--fg); line-height: 1; letter-spacing: 1px; }
        
        .foot-nav { display: flex; gap: clamp(40px, 8vw, 100px); flex-wrap: wrap; }
        .nav-col { display: flex; flex-direction: column; gap: 16px; }
        .nav-col .heading { color: var(--accent); margin-bottom: 4px; font-weight: 600; display: block; }
        .nav-col a { color: var(--fg-soft); text-decoration: none; font-size: 14px; transition: color 0.2s, transform 0.2s ease-out; }
        .nav-col a:hover { color: var(--fg); transform: translateX(4px); }
        
        .foot-base { display: flex; justify-content: space-between; align-items: center; padding-top: 32px; border-top: 1px solid var(--rule-c); flex-wrap: wrap; gap: 24px; }
        .base-left { display: flex; gap: 24px; align-items: center; flex-wrap: wrap; }
        .base-left span { color: var(--fg-soft); }
        .copy-text { display: flex; align-items: center; gap: 4px; }
        
        .status-wrap { display: flex; align-items: center; gap: 8px; }
        .status-dot-foot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981; animation: pulse-foot 2s infinite; display: inline-block; }
        
        .top-btn { display: flex; align-items: center; gap: 8px; background: var(--bg); border: 1px solid var(--rule-c); padding: 10px 20px; border-radius: 999px; cursor: pointer; color: var(--fg); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .top-btn:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-4px); box-shadow: 0 8px 20px -6px color-mix(in oklab, var(--accent) 40%, transparent); }
        
        .small { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; }
        @keyframes pulse-foot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }
        
        @media (max-width: 600px) {
          .foot { padding: 60px 0 40px; }
          .foot-content { margin-bottom: 60px; flex-direction: column; }
          .foot-nav { gap: 40px; }
          .base-left { flex-direction: column; align-items: flex-start; gap: 12px; }
        }
        
        /* Light Theme Adjustments */
        html[data-theme="light"] .vc-icon {
          background: color-mix(in oklab, var(--accent) 45%, black);
          color: #ffffff;
        }
        html[data-theme="light"] .visit-counter:hover {
          background: color-mix(in oklab, var(--accent) 15%, transparent);
          border-color: color-mix(in oklab, var(--accent) 45%, black);
        }
      `}</style>
    </footer>
  );
}
