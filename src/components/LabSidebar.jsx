import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'lab-electrolyzer', label: 'Electrolyzer Model' },
  { id: 'lab-polarization', label: 'Polarization Curve' },
  { id: 'lab-mpc', label: 'MPC Controller' },
  { id: 'lab-tea', label: 'LCOH Analysis' },
  { id: 'lab-power-to-x', label: 'Power-to-X Flow' },
  { id: 'lab-renewables', label: 'Renewables Mix' },
  { id: 'lab-code', label: 'Code Showcase' },
];

export default function LabSidebar({ sidebarRef, activeSection, onNavClick }) {

  const navRef = useRef(null);

  useEffect(() => {
    if (navRef.current) {
      const activeItem = navRef.current.querySelector('.active');
      if (activeItem) {
        const container = navRef.current;
        const scrollTop = activeItem.offsetTop - container.offsetHeight / 2 + activeItem.offsetHeight / 2;
        container.scrollTo({ top: scrollTop, behavior: 'smooth' });
      }
    }
  }, [activeSection]);

  return (
    <aside ref={sidebarRef} className="lab-sidebar" aria-label="Lab navigation">
      <Link to="/" className="lab-back">
        ← Portfolio
      </Link>

      <hr className="lab-rule" />

      <div className="lab-logo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lab-logo-icon">
          <path d="M9 3h6"></path>
          <path d="M10 3v5c0 .5-.2 1-.5 1.4l-5.6 6.3c-.6.7-.1 1.8.8 1.8h14.6c.9 0 1.4-1.1.8-1.8l-5.6-6.3c-.3-.4-.5-.9-.5-1.4V3"></path>
          <path d="M6 14h12"></path>
        </svg>
        Research Lab
      </div>

      <nav ref={navRef} className="lab-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`lab-nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onNavClick(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="lab-sidebar-foot">© 2026 Darshan Jogani</div>

      <style>{`
        .lab-sidebar {
          width: 220px;
          flex-shrink: 0;
          height: 100vh;
          background: color-mix(in oklab, var(--bg) 85%, black);
          border-right: 1px solid color-mix(in oklab, var(--rule-c) 60%, transparent);
          display: flex;
          flex-direction: column;
          padding: 28px 0;
          overflow: hidden;
        }
        .lab-back {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--accent);
          text-decoration: none;
          padding: 0 20px 0 24px;
          display: block;
          transition: opacity 0.2s;
        }
        .lab-back:hover { opacity: 0.7; }
        .lab-rule {
          border: none;
          border-top: 1px solid color-mix(in oklab, var(--rule-c) 50%, transparent);
          margin: 16px 0;
        }
        .lab-logo {
          font-family: var(--serif);
          font-style: italic;
          font-size: 16px;
          color: var(--fg);
          padding: 0 24px;
          margin-bottom: 24px;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lab-logo-icon {
          color: var(--accent);
          filter: drop-shadow(0 0 8px color-mix(in oklab, var(--accent) 60%, transparent));
        }
        .lab-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          overflow-y: auto;
          padding: 0 12px;
          position: relative;
        }
        .lab-nav-item {
          position: relative;
          background: none;
          border: none;
          color: color-mix(in oklab, var(--fg) 45%, transparent);
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.5px;
          text-align: left;
          padding: 12px 16px;
          margin: 0 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          line-height: 1.3;
        }
        .lab-nav-item::before {
          content: '';
          position: absolute;
          left: -8px;
          top: 50%;
          transform: translateY(-50%) scaleY(0);
          width: 3px;
          height: 18px;
          background: var(--accent);
          border-radius: 4px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .lab-nav-item:hover {
          color: var(--fg);
          background: color-mix(in oklab, var(--fg) 5%, transparent);
          transform: translateX(4px);
        }
        .lab-nav-item.active {
          color: var(--accent);
          background: color-mix(in oklab, var(--accent) 8%, transparent);
          font-weight: 500;
        }
        .lab-nav-item.active::before {
          transform: translateY(-50%) scaleY(1);
        }
        .lab-sidebar-foot {
          font-family: var(--mono);
          font-size: 10px;
          color: color-mix(in oklab, var(--fg) 25%, transparent);
          padding: 16px 24px 0;
          border-top: 1px solid color-mix(in oklab, var(--rule-c) 30%, transparent);
          margin-top: 8px;
        }

        @media (max-width: 768px) {
          .lab-sidebar { display: none; }
        }

        /* Light Theme Adjustments */
        html[data-theme="light"] .lab-logo-icon {
          color: color-mix(in oklab, var(--accent) 45%, black);
          filter: drop-shadow(0 0 8px color-mix(in oklab, color-mix(in oklab, var(--accent) 45%, black) 30%, transparent));
        }
        html[data-theme="light"] .lab-nav-item.active {
          color: color-mix(in oklab, var(--accent) 45%, black);
          background: color-mix(in oklab, color-mix(in oklab, var(--accent) 45%, black) 10%, transparent);
        }
        html[data-theme="light"] .lab-nav-item.active::before {
          background: color-mix(in oklab, var(--accent) 45%, black);
        }
        html[data-theme="light"] .lab-back {
          color: color-mix(in oklab, var(--accent) 45%, black);
        }
      `}</style>
    </aside>
  );
}
