import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import LangToggle from './LangToggle.jsx';
import { useTranslation } from '../context/TranslationContext.jsx';

const links = [
  ['#about', 'nav.about'],
  ['#research', 'nav.research'],
  ['#publications', 'nav.pubs'],
  ['#talks', 'nav.talks'],
  ['#contact', 'nav.contact'],
];

export default function Nav({ onCV, onTweaks }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
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
          <span className="brand-text">Darshan Jogani</span>
        </a>
        <ul className="nav-links">
          {links.map(([href, label]) => (
            <li key={href}>
              <a href={href} onClick={(e) => handleClick(e, href)}>
                {t(label)}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <ThemeToggle />
          <LangToggle />
          <button className="btn nav-tweaks-btn hide-mobile" onClick={() => { if(onTweaks) onTweaks(); }} aria-label="Tweaks">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="gear-icon">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span className="btn-text">Tweaks</span>
          </button>
          <Link to="/lab" className="btn btn-lab" aria-label="Research Lab">
            <svg className="flask-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 9.31V2"/><path d="M8.5 2h7"/><path d="M14 9.31L20.3 21A1 1 0 0 1 19.45 22.5H4.55A1 1 0 0 1 3.7 21L10 9.31"/></svg>
            <span className="btn-text">Research Lab ↗</span>
          </Link>
          <button className="btn btn-primary hide-mobile" onClick={onCV}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>
            CV
          </button>
          <button className="btn menu-btn" onClick={() => setOpen(true)} aria-label="Menu">☰</button>
        </div>
      </nav>
      <aside className={`drawer ${open ? 'open' : ''}`}>
        <div className="drawer-header">
          <button className="btn btn-primary" onClick={onCV}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>
            CV
          </button>
          <button className="btn drawer-close" onClick={() => setOpen(false)}>Close</button>
        </div>
        <div className="drawer-links">
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={(e) => handleClick(e, href)}>{t(label)}</a>
          ))}
          <Link to="/lab" className="drawer-lab-link" onClick={() => setOpen(false)}>
            Research Lab ↗
          </Link>
        </div>
      </aside>
      <style>{`
        .nav { position: fixed; top: 24px; left: 50%; transform: translateX(-50%); z-index: 80;
          width: calc(100% - 32px); max-width: 1400px; border-radius: 20px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 28px; transition: all .3s; border: 1px solid transparent;
          color: var(--fg); }
        .nav.scrolled { background: color-mix(in oklab, var(--bg) 75%, transparent);
          backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px);
          border-color: color-mix(in oklab, var(--rule-c) 60%, transparent); padding-top: 14px; padding-bottom: 14px;
          box-shadow: 0 16px 40px -12px rgba(0,0,0,0.5), inset 0 1px 0 color-mix(in oklab, var(--fg) 10%, transparent); }
        .brand { display: inline-flex; align-items: center; gap: 12px;
          font-family: var(--serif); font-size: 18px; letter-spacing: .5px; cursor: pointer; }
        .brand:hover .brand-mark { transform: scale(1.1) rotate(10deg); box-shadow: 0 6px 20px -4px var(--accent); }
        .brand-mark { width: 34px; height: 34px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: #061a14; font-family: var(--serif); font-weight: 700; font-size: 14px;
          box-shadow: 0 4px 18px -6px var(--accent); transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease; }
        .nav-links { list-style: none; margin: 0; padding: 0; display: flex; gap: 6px; align-items: center; font-size: 13px; color: var(--fg-soft); }
        .nav-links a { position: relative; padding: 8px 16px; cursor: pointer; border-radius: 999px;
          display: flex; align-items: center; gap: 8px; font-weight: 500;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); background: transparent; border: 1px solid transparent; }
        .nav-links a:hover { color: var(--fg); background: color-mix(in oklab, var(--accent) 10%, transparent); border-color: color-mix(in oklab, var(--accent) 25%, transparent); transform: translateY(-2px); box-shadow: 0 6px 16px -6px color-mix(in oklab, var(--accent) 40%, transparent); }
        .nav-actions { display: flex; align-items: center; gap: 12px; }
        .nav-actions .btn, .nav-actions .btn-lab, .drawer-header .btn { display: inline-flex; align-items: center; gap: 8px; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .nav-actions .btn:hover, .nav-actions .btn-lab:hover, .drawer-header .btn:hover {
          background: var(--accent); color: #061a14; border-color: var(--accent);
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 24px -6px color-mix(in oklab, var(--accent) 60%, transparent);
          z-index: 10;
        }
        .nav-tweaks-btn {
          padding: 8px 18px; border-radius: 999px; background: transparent; color: var(--accent);
          border: 1px solid color-mix(in oklab, var(--accent) 40%, transparent); cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          font-family: var(--mono); font-size: 11px; font-weight: 500; letter-spacing: 1.2px; text-transform: uppercase;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .gear-icon { transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .nav-tweaks-btn:hover .gear-icon { transform: rotate(180deg) scale(1.15); }
        .btn-lab { color: var(--accent); font-family: var(--mono); font-weight: 500;
          font-size: 11px; letter-spacing: 1.2px; text-transform: uppercase;
          padding: 8px 18px; border-radius: 999px; border: 1px solid color-mix(in oklab, var(--accent) 40%, transparent);
          background: color-mix(in oklab, var(--accent) 10%, transparent); text-decoration: none; 
          box-shadow: inset 0 0 12px -4px color-mix(in oklab, var(--accent) 40%, transparent); }
        .flask-icon { transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); filter: drop-shadow(0 0 4px color-mix(in oklab, var(--accent) 50%, transparent)); }
        .btn-lab:hover .flask-icon { transform: rotate(15deg) scale(1.15); filter: none; }
        .nav-actions .menu-btn { display: none; }
        @media (max-width: 1100px) {
          .nav-actions .btn-text { display: none; }
          .nav-tweaks-btn, .btn-lab { padding: 8px; width: 36px; height: 36px; justify-content: center; border-radius: 50%; }
          .nav-actions { gap: 8px; }
        }
        @media (max-width: 980px) {
          .nav { top: 16px; width: calc(100% - 32px); padding: 14px 20px; }
          .nav.scrolled { padding-top: 12px; padding-bottom: 12px; }
          .nav-links { display: none; }
          .nav-actions .menu-btn { display: inline-flex; }
          .nav-actions .hide-mobile { display: none; }
        }
        @media (max-width: 600px) {
          .brand { gap: 8px; font-size: clamp(14px, 4vw, 18px); }
          .brand-mark { width: 30px; height: 30px; font-size: 12px; }
          .nav { padding: 10px 14px; width: calc(100% - 16px); }
          .nav-actions { gap: 4px; }
        }
        .drawer { position: fixed; top: 0; right: 0; bottom: 0; width: min(86vw, 360px); z-index: 90;
          background: var(--bg-alt); border-left: 1px solid var(--rule-c);
          transform: translateX(100%); transition: transform .4s cubic-bezier(.7,0,.2,1);
          padding: 24px 32px; display: flex; flex-direction: column; }
        .drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .drawer-links { display: flex; flex-direction: column; gap: 10px; overflow-y: auto; }
        .drawer.open { transform: translateX(0); }
        .drawer a, .drawer-lab-link { font-family: var(--serif); font-size: 24px; color: var(--fg); display: flex; align-items: center; padding: 14px 20px; border-radius: 16px; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); border: 1px solid transparent; text-decoration: none; }
        .drawer a:hover, .drawer-lab-link:hover { background: color-mix(in oklab, var(--accent) 10%, transparent); border-color: color-mix(in oklab, var(--accent) 25%, transparent); transform: translateX(8px); box-shadow: 0 8px 24px -8px color-mix(in oklab, var(--accent) 40%, transparent); }
        .drawer-lab-link { color: var(--accent); text-decoration: none; }

        html[data-theme="light"] .nav { color: #0f172a; }
        html[data-theme="light"] .nav.scrolled {
          background: rgba(255, 255, 255, 0.85);
          border-color: rgba(0, 0, 0, 0.08);
          box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255,255,255,0.6);
        }
        html[data-theme="light"] .nav-links a:hover { background: color-mix(in oklab, var(--accent) 15%, transparent); color: #0f172a; }
        html[data-theme="light"] .btn-lab { color: color-mix(in oklab, var(--accent) 45%, black); border-color: color-mix(in oklab, var(--accent) 45%, black); background: transparent; }
        html[data-theme="light"] .nav-tweaks-btn { color: color-mix(in oklab, var(--accent) 45%, black); border-color: color-mix(in oklab, var(--accent) 45%, black); }
        html[data-theme="light"] .nav-actions .btn:hover,
        html[data-theme="light"] .nav-actions .btn-lab:hover,
        html[data-theme="light"] .drawer-header .btn:hover {
          background: color-mix(in oklab, var(--accent) 45%, black) !important;
          color: #ffffff !important;
          border-color: color-mix(in oklab, var(--accent) 45%, black) !important;
          box-shadow: 0 8px 24px -6px color-mix(in oklab, var(--accent) 60%, transparent) !important;
        }
        html[data-theme="light"] .drawer a:hover, html[data-theme="light"] .drawer-lab-link:hover { background: color-mix(in oklab, var(--accent) 15%, transparent); }
      `}</style>
    </>
  );
}