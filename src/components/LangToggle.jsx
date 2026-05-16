import React from 'react';
import { useTranslation } from '../context/TranslationContext.jsx';

export default function LangToggle() {
  const { lang, toggleLang } = useTranslation();

  return (
    <>
      <button className="btn lang-toggle" onClick={toggleLang} aria-label="Toggle language">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lang-icon">
          <path d="m5 8 6 6" />
          <path d="m4 14 6-6 2-3" />
          <path d="M2 5h12" />
          <path d="M7 2h1" />
          <path d="m22 22-5-10-5 10" />
          <path d="M14 18h6" />
        </svg>
        <span className="btn-text">{lang.toUpperCase()}</span>
      </button>

      <style>{`
        .lang-toggle {
          padding: 8px 18px; border-radius: 999px; background: transparent; color: var(--accent);
          border: 1px solid color-mix(in oklab, var(--accent) 40%, transparent); cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          font-family: var(--mono); font-size: 11px; font-weight: 500; letter-spacing: 1.2px; text-transform: uppercase;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .lang-icon { transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .lang-toggle:hover .lang-icon { transform: rotateY(180deg) scale(1.15); }

        html[data-theme="light"] .lang-toggle {
          color: color-mix(in oklab, var(--accent) 45%, black);
          border-color: color-mix(in oklab, var(--accent) 45%, black);
        }
        @media (max-width: 1100px) {
          .lang-toggle { padding: 8px; width: 36px; height: 36px; justify-content: center; border-radius: 50%; }
          .lang-toggle .btn-text { display: none; }
        }
      `}</style>
    </>
  );
}