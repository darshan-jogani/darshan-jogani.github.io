import React from 'react';
import { useTheme } from '../lib/theme.jsx';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <>
      <button className="btn theme-toggle" onClick={toggle} aria-label="Toggle theme">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="theme-icon">
          <g className={`sun ${theme === 'dark' ? 'active' : ''}`}>
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          </g>
          <g className={`moon ${theme !== 'dark' ? 'active' : ''}`}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </g>
        </svg>
        <span className="btn-text">{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>

      <style>{`
        .theme-icon { overflow: visible; }
        .theme-icon g { 
          transform-origin: center; 
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); 
        }
        .sun { opacity: 0; transform: rotate(-90deg) scale(0.5); }
        .sun.active { opacity: 1; transform: rotate(0deg) scale(1); }
        
        .moon { opacity: 0; transform: rotate(90deg) scale(0.5); }
        .moon.active { opacity: 1; transform: rotate(0deg) scale(1); }
        
        .theme-toggle:hover .sun.active { transform: rotate(45deg) scale(1.15); }
        .theme-toggle:hover .moon.active { transform: rotate(-15deg) scale(1.15); }
      `}</style>
    </>
  );
}
