import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';

export default function LabHeader({ headerRef, onTweaks }) {
  return (
    <header ref={headerRef} className="lab-header">
      <div className="lab-header-brand-group">
        <Link to="/" className="lab-mobile-back" aria-label="Back to Portfolio">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <Link to="/" className="brand" aria-label="Back to Home">
          <span className="brand-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3h6"></path>
              <path d="M10 3v5c0 .5-.2 1-.5 1.4l-5.6 6.3c-.6.7-.1 1.8.8 1.8h14.6c.9 0 1.4-1.1.8-1.8l-5.6-6.3c-.3-.4-.5-.9-.5-1.4V3"></path>
              <path d="M6 14h12"></path>
            </svg>
          </span>
          <span className="brand-text">DJ's Research Lab</span>
        </Link>
      </div>
      <div className="lab-header-actions">
        <ThemeToggle />
        <button className="btn lab-tweaks-btn" onClick={onTweaks} aria-label="Tweaks">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="gear-icon">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <span className="btn-text">Tweaks</span>
        </button>
      </div>

      <style>{`
        .lab-header {
          position: sticky;
          top: 24px;
          margin: 24px auto 32px auto;
          z-index: 50;
          width: calc(100% - 32px);
          box-sizing: border-box;
          max-width: 1400px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 28px;
          background: color-mix(in oklab, var(--bg) 75%, transparent);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          border: 1px solid color-mix(in oklab, var(--rule-c) 60%, transparent);
          box-shadow: 0 16px 40px -12px rgba(0,0,0,0.5), inset 0 1px 0 color-mix(in oklab, var(--fg) 10%, transparent);
          color: var(--fg);
          transition: all 0.4s ease;
        }
        .lab-header-brand-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .lab-mobile-back {
          display: none;
          align-items: center;
          justify-content: center;
          width: 36px; height: 36px; border-radius: 10px;
          background: color-mix(in oklab, var(--accent) 15%, transparent);
          color: var(--accent);
          border: 1px solid color-mix(in oklab, var(--accent) 30%, transparent);
          box-shadow: 0 4px 12px -4px color-mix(in oklab, var(--accent) 50%, transparent);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .lab-mobile-back:hover {
          background: var(--accent);
          color: #061a14;
          transform: translateX(-2px);
          box-shadow: 0 6px 20px -4px var(--accent);
        }
        .brand { 
          display: inline-flex; 
          align-items: center; 
          gap: 12px;
          font-family: var(--serif); 
          font-size: 18px; 
          letter-spacing: 0.5px; 
          cursor: pointer; 
          text-decoration: none;
          color: inherit;
        }
        .brand:hover .brand-mark { 
          transform: scale(1.1) rotate(-10deg); 
          background: var(--accent);
          color: #061a14;
          box-shadow: 0 6px 20px -4px var(--accent);
        }
        .brand-mark { 
          width: 36px; height: 36px; border-radius: 10px;
          display: inline-flex; align-items: center; justify-content: center;
          background: color-mix(in oklab, var(--accent) 15%, transparent);
          color: var(--accent);
          border: 1px solid color-mix(in oklab, var(--accent) 30%, transparent);
          box-shadow: 0 4px 12px -4px color-mix(in oklab, var(--accent) 50%, transparent);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .lab-header-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .lab-header-actions button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          border-radius: 999px;
        }
        .lab-header-actions button:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 24px -6px color-mix(in oklab, var(--accent) 60%, transparent);
          z-index: 10;
        }
        .lab-tweaks-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 8px 16px;
          line-height: 1;
          background: transparent;
          color: var(--accent);
          border: 1px solid color-mix(in oklab, var(--accent) 40%, transparent);
          cursor: pointer;
        }
        .lab-tweaks-btn:hover {
          background: var(--accent);
          color: #061a14;
        }
        .gear-icon {
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .lab-tweaks-btn:hover .gear-icon {
          transform: rotate(180deg) scale(1.15);
        }

        /* Responsive Adjustments */
        @media (max-width: 1000px) {
          .lab-mobile-back {
            display: inline-flex;
          }
        }
        @media (max-width: 768px) {
          .lab-header { 
            top: 16px; 
            margin: 16px 0 24px 0;
            width: calc(100% - 32px); 
            padding: 12px 20px; 
          }
          .lab-header-actions .lab-tweaks-btn {
            display: none;
          }
        }
        @media (max-width: 600px) {
          .lab-header-brand-group { gap: 10px; }
          .lab-mobile-back { width: 30px; height: 30px; }
          .lab-mobile-back svg { width: 14px; height: 14px; }
          .brand { gap: 8px; font-size: clamp(14px, 4vw, 18px); }
          .brand-mark { width: 30px; height: 30px; font-size: 12px; }
          .lab-header { padding: 10px 14px; width: calc(100% - 16px); }
          .lab-header-actions { gap: 8px; }
        }

        /* Light Theme Adjustments */
        html[data-theme="light"] .lab-header {
          background: rgba(250, 250, 251, 0.85);
          border-color: rgba(0, 0, 0, 0.08);
          box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255,255,255,0.6);
          color: #0f172a;
        }
        html[data-theme="light"] .lab-header-actions button:hover {
          background: color-mix(in oklab, var(--accent) 45%, black) !important;
          color: #ffffff !important;
          box-shadow: 0 8px 24px -6px color-mix(in oklab, var(--accent) 60%, transparent) !important;
          border-color: color-mix(in oklab, var(--accent) 45%, black) !important;
        }
        html[data-theme="light"] .lab-tweaks-btn {
          color: color-mix(in oklab, var(--accent) 45%, black);
          border-color: color-mix(in oklab, color-mix(in oklab, var(--accent) 45%, black) 30%, transparent);
        }
        html[data-theme="light"] .lab-mobile-back {
          background: color-mix(in oklab, var(--accent) 15%, transparent);
          color: color-mix(in oklab, var(--accent) 45%, black);
          border-color: color-mix(in oklab, color-mix(in oklab, var(--accent) 45%, black) 25%, transparent);
          box-shadow: 0 4px 12px -4px color-mix(in oklab, color-mix(in oklab, var(--accent) 45%, black) 30%, transparent);
        }
        html[data-theme="light"] .lab-mobile-back:hover {
          background: color-mix(in oklab, var(--accent) 45%, black);
          color: #ffffff;
          box-shadow: 0 6px 20px -4px color-mix(in oklab, color-mix(in oklab, var(--accent) 45%, black) 40%, transparent);
        }
        html[data-theme="light"] .brand-mark {
          background: color-mix(in oklab, var(--accent) 15%, transparent);
          color: color-mix(in oklab, var(--accent) 45%, black);
          border-color: color-mix(in oklab, color-mix(in oklab, var(--accent) 45%, black) 25%, transparent);
          box-shadow: 0 4px 12px -4px color-mix(in oklab, color-mix(in oklab, var(--accent) 45%, black) 30%, transparent);
        }
        html[data-theme="light"] .brand:hover .brand-mark {
          background: color-mix(in oklab, var(--accent) 45%, black);
          color: #ffffff;
          box-shadow: 0 6px 20px -4px color-mix(in oklab, color-mix(in oklab, var(--accent) 45%, black) 40%, transparent);
        }
      `}</style>
    </header>
  );
}