import React, { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle.jsx';

const links = [
  ['#about', 'About', '01'],
  ['#research', 'Research', '02'],
  ['#electrolyzer', 'Electrolyzer', '03'],
  ['#polarization', 'Curve', '04'],
  ['#mpc', 'MPC', '05'],
  ['#tea', 'TEA', '06'],
  ['#power-to-x', 'P2X', '07'],
  ['#renewables', 'Renewables', '08'],
  ['#code', 'Code', '09'],
  ['#publications', 'Pubs', '10'],
  ['#talks', 'Talks', '11'],
  ['#contact', 'Contact', '12'],
];

export default function Nav({ onCV, onTweaks }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(document.documentElement.scrollTop > 40);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const handleClick = (e, href) => {
    e.preventDefault();
    const t = document.querySelector(href);
    if (!t) return;
    const y = t.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top: y, behavior: 'smooth' });
    setOpen(false);
  };
  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a className="brand" href="#top" onClick={(e) => handleClick(e, '#top')}>
          <span className="brand-mark">DJ</span>
          <span>Darshan Jogani</span>
        </a>
        <ul className="nav-links">
          {links.slice(0, 6).map(([href, label]) => (
            <li key={href}><a href={href} onClick={(e) => handleClick(e, href)}>{label}</a></li>
          ))}
          <li className="more">
            <span>More ▾</span>
            <ul className="submenu">
              {links.slice(6).map(([href, label]) => (
                <li key={href}><a href={href} onClick={(e) => handleClick(e, href)}>{label}</a></li>
              ))}
            </ul>
          </li>
        </ul>
        <div className="nav-actions">
          <button className="btn hide-mobile" onClick={onTweaks} aria-label="Tweaks">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span>Tweaks</span>
          </button>
          <ThemeToggle />
          <button className="btn btn-primary hide-mobile" onClick={onCV}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>
            CV
          </button>
          <button className="btn menu-btn" onClick={() => setOpen(true)} aria-label="Menu">☰</button>
        </div>
      </nav>
      <aside className={`drawer ${open ? 'open' : ''}`}>
        <button className="btn drawer-close" onClick={() => setOpen(false)}>Close</button>
        {links.map(([href, label, num]) => (
          <a key={href} href={href} onClick={(e) => handleClick(e, href)}><span>{num}</span>{label}</a>
        ))}
      </aside>
      <style>{`
        .nav { position: fixed; top: 24px; left: 50%; transform: translateX(-50%); z-index: 80;
          width: calc(100% - 32px); max-width: 1400px; border-radius: 20px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 28px; transition: all .3s; border: 1px solid transparent;
          color: var(--fg); }
        .nav.scrolled { background: color-mix(in oklab, var(--bg) 78%, transparent);
          backdrop-filter: saturate(140%) blur(16px); -webkit-backdrop-filter: saturate(140%) blur(16px);
          border-color: var(--rule-c); padding-top: 14px; padding-bottom: 14px; box-shadow: 0 12px 32px -12px rgba(0,0,0,0.3); }
        .brand { display: inline-flex; align-items: center; gap: 12px;
          font-family: var(--serif); font-size: 18px; letter-spacing: .5px; cursor: pointer; }
        .brand-mark { width: 34px; height: 34px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: #061a14; font-family: var(--serif); font-weight: 700;
          font-size: 14px; box-shadow: 0 4px 18px -6px var(--accent); }
        .nav-links { list-style: none; margin: 0; padding: 0;
          display: flex; gap: 22px; align-items: center;
          font-size: 13px; color: var(--fg-soft); }
        .nav-links a, .nav-links .more > span {
          position: relative; padding: 4px 0; cursor: pointer; transition: color .2s; }
        .nav-links a::after { content: ""; position: absolute; left: 0; right: 100%; bottom: -2px;
          height: 1px; background: var(--accent); transition: right .35s ease; }
        .nav-links a:hover { color: var(--fg); }
        .nav-links a:hover::after { right: 0; }
        .nav-links .more { position: relative; }
        .nav-links .more:hover .submenu,
        .nav-links .more:focus-within .submenu { opacity: 1; pointer-events: auto; transform: translateY(0); }
        .submenu { position: absolute; top: 100%; right: 0; margin-top: 8px;
          background: var(--bg-alt); border: 1px solid var(--rule-c); border-radius: 6px;
          padding: 8px; min-width: 160px; list-style: none;
          opacity: 0; pointer-events: none; transform: translateY(-6px); transition: all .2s; }
        .submenu::before { content: ""; position: absolute; bottom: 100%; left: 0; right: 0; height: 16px; }
        .submenu li { padding: 6px 10px; }
        .nav-actions { display: flex; align-items: center; gap: 10px; }
        .nav-actions .btn {
          display: inline-flex;
          align-items: center;
        }
        // .nav-actions .btn svg {
        //   margin-right: 6px;
        //   display: block;
        // }
        .nav-actions .menu-btn { display: none; }
        @media (max-width: 980px) {
          .nav { top: 16px; width: calc(100% - 32px); padding: 14px 20px; }
          .nav.scrolled { padding-top: 12px; padding-bottom: 12px; }
          .nav-links { display: none; }
          .nav-actions .menu-btn { display: inline-flex; }
          .nav-actions .hide-mobile { display: none; }
        }
        .drawer { position: fixed; top: 0; right: 0; bottom: 0; width: min(86vw, 360px); z-index: 90;
          background: var(--bg-alt); border-left: 1px solid var(--rule-c);
          transform: translateX(100%); transition: transform .4s cubic-bezier(.7,0,.2,1);
          padding: 80px 32px; display: flex; flex-direction: column; gap: 14px; }
        .drawer.open { transform: translateX(0); }
        .drawer a { font-family: var(--serif); font-size: 22px; color: var(--fg); }
        .drawer a span { color: var(--accent); font-family: var(--mono); font-size: 11px; margin-right: 12px; }
        .drawer-close { position: absolute; top: 22px; right: 22px; }

        /* Light Theme Overrides */
        html[data-theme="light"] .nav { color: #0f172a; }
        html[data-theme="light"] .nav.scrolled {
          background: rgba(255, 255, 255, 0.85);
          border-color: rgba(0, 0, 0, 0.08);
          box-shadow: 0 12px 32px -12px rgba(0, 0, 0, 0.1);
        }
        html[data-theme="light"] .nav-links { color: #475569; }
        html[data-theme="light"] .nav-links a:hover { color: #0f172a; }
        html[data-theme="light"] .submenu { background: #ffffff; border-color: rgba(0,0,0,0.08); box-shadow: 0 8px 24px -8px rgba(0,0,0,0.1); }
      `}</style>
    </>
  );
}
