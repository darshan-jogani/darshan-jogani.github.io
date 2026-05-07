import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import LabSidebar from '../components/LabSidebar.jsx';
import LabHeader from '../components/LabHeader.jsx';
import TweaksPanel from '../components/TweaksPanel.jsx';
import ElectrolyzerModel from '../sections/ElectrolyzerModel.jsx';
import PolarizationCurve from '../sections/PolarizationCurve.jsx';
import MPCDemo from '../sections/MPCDemo.jsx';
import TEA from '../sections/TEA.jsx';
import PowerToX from '../sections/PowerToX.jsx';
import Renewables from '../sections/Renewables.jsx';
import CodeShowcase from '../sections/CodeShowcase.jsx';

const LAB_SECTIONS = [
  {
    id: 'lab-electrolyzer',
    title: 'Electrolyzer Model',
    desc: '// alkaline cell stack · interactive 3D · hover any layer',
    Component: ElectrolyzerModel,
  },
  {
    id: 'lab-polarization',
    title: 'Polarization Curve',
    desc: '// single-cell semi-empirical model · drag sliders to explore',
    Component: PolarizationCurve,
  },
  {
    id: 'lab-mpc',
    title: 'MPC Controller',
    desc: '// receding-horizon control · live simulation · tunable weights',
    Component: MPCDemo,
  },
  {
    id: 'lab-tea',
    title: 'LCOH Analysis',
    desc: '// techno-economic waterfall · levelized cost of hydrogen',
    Component: TEA,
  },
  {
    id: 'lab-power-to-x',
    title: 'Power-to-X Flow',
    desc: '// plant flowsheet · renewable electrons to molecules',
    Component: PowerToX,
  },
  {
    id: 'lab-renewables',
    title: 'Renewables Mix',
    desc: '// 24-hour dispatch simulation · solar + wind + battery',
    Component: Renewables,
  },
  {
    id: 'lab-code',
    title: 'Code Showcase',
    desc: '// computational backbone · python · matlab',
    Component: CodeShowcase,
  },
];

function DisclaimerOverlay({ onAccept }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'expo.out',
      });
    }, overlayRef);
    return () => ctx.revert();
  }, []);

  const handleAccept = () => {
    const tl = gsap.timeline({
      onComplete: onAccept,
    });
    tl.to(contentRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.3,
      ease: 'expo.in',
    }).to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, '-=0.1');
  };

  return (
    <div ref={overlayRef} className="disclaimer-overlay" role="dialog" aria-modal="true" aria-label="Research Lab Disclaimer">
      <div className="disclaimer-backdrop" />
      <div ref={contentRef} className="disclaimer-content">
        <svg className="disc-icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M20 6 L20 8 M20 8 C14 8 9 13 9 20 C9 25 12 29 16 31 L16 34 L24 34 L24 31 C28 29 31 25 31 20 C31 13 26 8 20 8 Z" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="16" y1="20" x2="24" y2="20" strokeLinecap="round"/>
          <line x1="20" y1="16" x2="20" y2="26" strokeLinecap="round"/>
          <circle cx="20" cy="14" r="1" fill="currentColor" stroke="none"/>
        </svg>

        <h1 className="disc-title">Research Lab</h1>
        <p className="disc-subtitle">Interactive Models · Educational Use Only</p>

        <hr className="disc-rule" />

        <p className="disc-body">
          The models and simulations in this lab are semi-empirical implementations built for
          research communication and educational exploration. All parameters are representative
          of published literature ranges and are not calibrated to specific experimental apparatus
          or proprietary data. Outputs are illustrative and should not be used for engineering
          decisions or cited as primary sources.
        </p>

        <ul className="disc-checks">
          <li><span className="disc-check">✓</span> Based on peer-reviewed electrochemical models</li>
          <li><span className="disc-check">✓</span> Parameters from published AWE literature</li>
          <li><span className="disc-check">✓</span> Open for academic discussion</li>
        </ul>

        <button className="disc-btn" onClick={handleAccept}>
          I understand — explore the lab
        </button>
      </div>

      <style>{`
        .disclaimer-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(16px, 4vw, 24px);
        }
        .disclaimer-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(10, 16, 32, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: -1;
        }
        .disclaimer-content {
          position: relative;
          background: color-mix(in oklab, var(--bg) 85%, transparent);
          border: 1px solid color-mix(in oklab, var(--accent) 30%, transparent);
          border-radius: 24px;
          padding: clamp(24px, 6vw, 48px);
          max-width: 560px;
          width: 100%;
          text-align: center;
          max-height: calc(100vh - 32px);
          overflow-y: auto;
          animation: modal-pulse 4s ease-in-out infinite alternate;
        }
        @keyframes modal-pulse {
          0% { box-shadow: 0 24px 64px -12px rgba(0,0,0,0.6), 0 0 40px -15px color-mix(in oklab, var(--accent) 20%, transparent), inset 0 1px 0 color-mix(in oklab, var(--fg) 10%, transparent); }
          100% { box-shadow: 0 24px 64px -12px rgba(0,0,0,0.6), 0 0 80px -10px color-mix(in oklab, var(--accent) 35%, transparent), inset 0 1px 0 color-mix(in oklab, var(--fg) 10%, transparent); }
        }
        .disclaimer-content::-webkit-scrollbar { width: 4px; }
        .disclaimer-content::-webkit-scrollbar-track { background: transparent; }
        .disclaimer-content::-webkit-scrollbar-thumb { background: color-mix(in oklab, var(--rule-c) 50%, transparent); border-radius: 2px; }
        
        .disc-icon {
          width: clamp(32px, 6vw, 40px);
          height: clamp(32px, 6vw, 40px);
          color: var(--accent);
          margin: 0 auto 20px;
          display: block;
          filter: drop-shadow(0 0 8px color-mix(in oklab, var(--accent) 60%, transparent));
        }
        .disc-title {
          font-family: var(--serif);
          font-size: clamp(28px, 5vw, 36px);
          font-weight: 500;
          color: var(--ink);
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }
        .disc-subtitle {
          font-family: var(--mono);
          font-size: clamp(11px, 2vw, 13px);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--muted);
          margin: 0 0 24px;
        }
        .disc-rule {
          border: none;
          border-top: 1px solid color-mix(in oklab, var(--rule-c) 60%, transparent);
          margin: 0 0 24px;
        }
        .disc-body {
          font-size: clamp(15px, 2vw, 16px);
          line-height: 1.7;
          color: color-mix(in oklab, var(--ink) 70%, transparent);
          text-align: left;
          margin: 0 0 24px;
        }
        .disc-checks {
          list-style: none;
          padding: 0;
          margin: 0 0 36px;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .disc-checks li {
          font-family: var(--mono);
          font-size: clamp(12px, 2vw, 13px);
          color: color-mix(in oklab, var(--ink) 65%, transparent);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .disc-check {
          color: var(--accent);
          font-size: 15px;
          flex-shrink: 0;
        }
        .disc-btn {
          font-family: var(--mono);
          font-size: clamp(12px, 2vw, 13px);
          letter-spacing: 1.2px;
          text-transform: uppercase;
          padding: clamp(12px, 3vw, 16px) clamp(24px, 5vw, 36px);
          border-radius: 999px;
          background: var(--accent);
          color: #061a14;
          border: 1px solid color-mix(in oklab, var(--accent) 50%, #ffffff);
          cursor: pointer;
          font-weight: 600;
          box-shadow: 0 0 20px -4px color-mix(in oklab, var(--accent) 60%, transparent),
                      inset 0 1px 1px rgba(255, 255, 255, 0.4);
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .disc-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: skewX(-20deg);
          animation: btn-shine 3s infinite;
        }
        @keyframes btn-shine { 0% { left: -100%; } 20% { left: 200%; } 100% { left: 200%; } }
        .disc-btn:hover { transform: scale(1.04) translateY(-2px); box-shadow: 0 8px 32px -6px color-mix(in oklab, var(--accent) 80%, transparent); }

        /* Light Theme Overlay Tweaks */
        html[data-theme="light"] .disclaimer-backdrop {
          background: rgba(250, 250, 251, 0.6);
        }
        html[data-theme="light"] .disclaimer-content {
          background: rgba(255, 255, 255, 0.9);
          border-color: color-mix(in oklab, var(--accent) 30%, transparent);
          animation: modal-pulse-light 4s ease-in-out infinite alternate;
        }
        @keyframes modal-pulse-light {
          0% { box-shadow: 0 24px 64px -12px rgba(0,0,0,0.1), 0 0 40px -15px color-mix(in oklab, var(--accent) 20%, transparent), inset 0 1px 0 rgba(255,255,255,0.6); }
          100% { box-shadow: 0 24px 64px -12px rgba(0,0,0,0.1), 0 0 80px -10px color-mix(in oklab, var(--accent) 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.6); }
        }
        html[data-theme="light"] .disc-icon,
        html[data-theme="light"] .disc-check {
          color: color-mix(in oklab, var(--accent) 45%, black);
        }
        html[data-theme="light"] .disc-icon {
          filter: drop-shadow(0 0 8px color-mix(in oklab, var(--accent) 40%, transparent));
        }
        html[data-theme="light"] .disc-btn {
          background: color-mix(in oklab, var(--accent) 45%, black);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 0 20px -4px color-mix(in oklab, var(--accent) 40%, transparent);
        }
        html[data-theme="light"] .disc-btn:hover {
          box-shadow: 0 8px 32px -6px color-mix(in oklab, var(--accent) 60%, transparent);
        }
        html[data-theme="light"] .disc-title {
          color: #0f172a;
        }
        html[data-theme="light"] .disc-subtitle {
          color: #64748b;
        }
        html[data-theme="light"] .disc-body {
          color: #334155;
        }
        html[data-theme="light"] .disc-checks li {
          color: #475569;
        }
        html[data-theme="light"] .disc-rule {
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}

export default function LabPage() {
  const [labVisible, setLabVisible] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(LAB_SECTIONS[0].id);

  const sidebarRef = useRef(null);
  const headerRef = useRef(null);
  const firstSectionRef = useRef(null);
  const scanLineRef = useRef(null);
  const tabBarRef = useRef(null);

  const runEntrance = useCallback(() => {
    const tl = gsap.timeline();

    if (sidebarRef.current) {
      gsap.set(sidebarRef.current, { x: -220 });
      tl.to(sidebarRef.current, { x: 0, duration: 0.5, ease: 'expo.out' });
    }
    if (headerRef.current) {
      gsap.set(headerRef.current, { y: -40 });
      tl.to(headerRef.current, { y: 0, duration: 0.4, ease: 'expo.out' }, '-=0.1');
    }
    if (firstSectionRef.current) {
      gsap.set(firstSectionRef.current, { y: 30, opacity: 0 });
      tl.to(firstSectionRef.current, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' }, '-=0.2');
    }
    if (scanLineRef.current) {
      gsap.set(scanLineRef.current, { top: 0, opacity: 1 });
      tl.fromTo(
        scanLineRef.current,
        { top: 0, opacity: 1 },
        {
          top: '100%',
          duration: 0.8,
          ease: 'none',
          onComplete: () => gsap.to(scanLineRef.current, { opacity: 0, duration: 0.2 }),
        },
        '-=0.5'
      );
    }
  }, []);

  // Set hidden positions before browser paints so there's no flash when lab becomes visible
  useLayoutEffect(() => {
    if (!sidebarRef.current || !headerRef.current || !firstSectionRef.current) return;
    gsap.set(sidebarRef.current, { x: -220 });
    gsap.set(headerRef.current, { y: -40 });
    gsap.set(firstSectionRef.current, { y: 30, opacity: 0 });
  }, [labVisible]);

  useEffect(() => {
    if (labVisible) {
      const id = requestAnimationFrame(runEntrance);
      return () => cancelAnimationFrame(id);
    }
  }, [labVisible, runEntrance]);

  useEffect(() => {
    if (!labVisible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );

    LAB_SECTIONS.forEach(sec => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [labVisible]);

  useEffect(() => {
    if (tabBarRef.current) {
      const activeTab = tabBarRef.current.querySelector('.active');
      if (activeTab) {
        const container = tabBarRef.current;
        const scrollLeft = activeTab.offsetLeft - container.offsetWidth / 2 + activeTab.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeSection]);

  const handleDisclaimerAccept = useCallback(() => {
    setLabVisible(true);
  }, []);

  return (
    <>
      {!labVisible && <DisclaimerOverlay onAccept={handleDisclaimerAccept} />}

      <div className="lab-layout" style={{ opacity: labVisible ? 1 : 0, pointerEvents: labVisible ? 'auto' : 'none', transition: 'opacity 0.4s ease' }} aria-hidden={!labVisible}>
        <LabSidebar 
          sidebarRef={sidebarRef} 
          activeSection={activeSection}
          onNavClick={(id) => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <div className="lab-content">
          <div ref={scanLineRef} className="lab-scan-line" aria-hidden="true" />
          <LabHeader headerRef={headerRef} onTweaks={() => setTweaksOpen(o => !o)} />

          <div className="lab-sections">
            {LAB_SECTIONS.map((sec, i) => {
              const { id, title, desc, Component } = sec;
              return (
                <div
                  key={id}
                  id={id}
                  className="lab-section-wrap"
                  ref={i === 0 ? firstSectionRef : null}
                >
                  <div className="lab-section-head">
                    <div className="lab-section-meta">
                      <span className="lab-section-idx">{(i + 1).toString().padStart(2, '0')}</span>
                      <span className="lab-section-line" />
                    </div>
                    <h2 className="lab-section-title">{title}</h2>
                    <p className="lab-section-desc">{desc}</p>
                  </div>
                  <div className="lab-section-body">
                    <Component />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile bottom tab bar */}
          <nav ref={tabBarRef} className="lab-tab-bar" aria-label="Lab sections">
            {LAB_SECTIONS.map(sec => (
              <button
                key={sec.id}
                className={`lab-tab ${activeSection === sec.id ? 'active' : ''}`}
                onClick={() => {
                  const el = document.getElementById(sec.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {sec.title.split(' ')[0]}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <TweaksPanel open={tweaksOpen} onClose={() => setTweaksOpen(false)} />

      <style>{`
        .lab-layout {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: var(--bg);
        }
        .lab-content {
          flex: 1;
          overflow-y: auto;
          scroll-behavior: smooth;
          position: relative;
          display: flex;
          flex-direction: column;
          background-image: radial-gradient(color-mix(in oklab, var(--fg) 15%, transparent) 1px, transparent 1px);
          background-size: 32px 32px;
          background-position: center top;
          overflow-x: hidden;
        }
        .lab-scan-line {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%);
          box-shadow: 0 0 16px 2px color-mix(in oklab, var(--accent) 60%, transparent);
          z-index: 5;
          pointer-events: none;
        }
        .lab-sections {
          flex: 1;
          padding-bottom: 60px;
        }
        .lab-section-wrap {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          border-top: 1px dashed color-mix(in oklab, var(--rule-c) 60%, transparent);
          scroll-margin-top: 130px;
          position: relative;
        }
        .lab-section-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          min-height: 0;
          padding: 24px clamp(20px, 4vw, 48px) 80px;
          max-width: var(--maxw, 1240px);
          margin: 0 auto;
          width: 100%;
        }
        .lab-section-head {
          padding: 60px clamp(20px, 4vw, 48px) 0;
          max-width: var(--maxw, 1240px);
          margin: 0 auto;
          width: 100%;
          flex-shrink: 0;
          position: relative;
          z-index: 10;
        }
        .lab-section-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        .lab-section-idx {
          font-family: var(--mono);
          font-size: 13px;
          color: var(--accent);
          font-weight: 600;
          background: color-mix(in oklab, var(--accent) 10%, transparent);
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid color-mix(in oklab, var(--accent) 25%, transparent);
        }
        .lab-section-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, color-mix(in oklab, var(--rule-c) 50%, transparent), transparent);
        }
        .lab-section-title {
          font-family: var(--serif);
          font-size: clamp(32px, 4vw, 44px);
          font-weight: 500;
          background: linear-gradient(135deg, var(--ink) 30%, color-mix(in oklab, var(--ink) 60%, transparent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 12px;
          letter-spacing: -0.02em;
        }
        .lab-section-desc {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 1.5px;
          color: color-mix(in oklab, var(--fg) 45%, transparent);
          margin: 0;
          text-transform: lowercase;
        }

        /* Mobile bottom tab bar */
        .lab-tab-bar {
          display: none;
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 32px);
          max-width: 500px;
          z-index: 100;
          background: color-mix(in oklab, var(--bg) 75%, transparent);
          border: 1px solid color-mix(in oklab, var(--rule-c) 60%, transparent);
          box-shadow: 0 16px 40px -12px rgba(0,0,0,0.5), inset 0 1px 0 color-mix(in oklab, var(--fg) 10%, transparent);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          border-radius: 999px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding: 8px;
          gap: 8px;
          scrollbar-width: none;
        }
        .lab-tab-bar::-webkit-scrollbar { display: none; }
        .lab-tab {
          flex-shrink: 0;
          background: transparent;
          border: 1px solid transparent;
          color: color-mix(in oklab, var(--fg) 60%, transparent);
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 10px 16px;
          border-radius: 999px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .lab-tab:hover {
          color: var(--fg);
          background: color-mix(in oklab, var(--fg) 5%, transparent);
        }
        .lab-tab.active {
          background: var(--accent);
          color: #061a14;
          box-shadow: 0 4px 12px -4px var(--accent);
        }

        @media (max-width: 768px) {
          .lab-layout { flex-direction: column; }
          .lab-tab-bar { display: flex; }
          .lab-sections { padding-bottom: 120px; }
          .lab-section-head { padding: 28px 20px 0; }
        }

        /* Light Theme Mobile Tabs */
        html[data-theme="light"] .lab-tab-bar {
          background: rgba(250, 250, 251, 0.85);
          border-color: rgba(0, 0, 0, 0.08);
          box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255,255,255,0.6);
        }
        html[data-theme="light"] .lab-tab.active {
          background: color-mix(in oklab, var(--accent) 45%, black);
          color: #ffffff;
          box-shadow: 0 4px 12px -4px color-mix(in oklab, color-mix(in oklab, var(--accent) 45%, black) 40%, transparent);
        }
        html[data-theme="light"] .lab-scan-line {
          background: linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--accent) 45%, black) 50%, transparent 100%);
          box-shadow: 0 0 16px 2px color-mix(in oklab, color-mix(in oklab, var(--accent) 45%, black) 40%, transparent);
        }
        html[data-theme="light"] .lab-section-idx {
          color: color-mix(in oklab, var(--accent) 45%, black);
          background: color-mix(in oklab, color-mix(in oklab, var(--accent) 45%, black) 10%, transparent);
          border-color: color-mix(in oklab, color-mix(in oklab, var(--accent) 45%, black) 30%, transparent);
        }
        html[data-theme="light"] .lab-section-title {
          background: linear-gradient(135deg, #0f172a 30%, color-mix(in oklab, #0f172a 60%, transparent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        html[data-theme="light"] .lab-section-desc {
          color: color-mix(in oklab, #0f172a 65%, transparent);
        }
      `}</style>
    </>
  );
}
