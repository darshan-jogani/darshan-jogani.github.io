import React from 'react';

export default function Footer() {
  return (
    <footer className="foot">
      <div className="container foot-grid">
        <small>© 2026 Darshan Jogani · DLR Stuttgart · Crafted with care.</small>
        <button className="btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          Back to top
        </button>
      </div>
      <style>{`
        .foot { padding: 48px 0 32px; border-top: 1px solid var(--rule-c); background: var(--bg); color: var(--fg); }
        .foot-grid { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .foot small { font-family: var(--mono); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--fg-soft); }
      `}</style>
    </footer>
  );
}
