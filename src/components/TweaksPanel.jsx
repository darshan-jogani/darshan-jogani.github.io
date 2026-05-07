import React from 'react';
import { useTweaks, useTheme } from '../lib/theme.jsx';

export default function TweaksPanel({ open, onClose }) {
  const { tweaks, updateTweak, resetTweaks } = useTweaks();
  const { theme } = useTheme();
  if (!open) return null;
  return (
    <aside className="tweaks">
      <div className="tw-head">
        <h4><span className="tw-icon">✨</span> System Tweaks</h4>
        <button className="btn tw-close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div className="tw-body">
        <div className="tw-group">
          <label className="tw-row">
            <span>Primary Accent</span>
            <input type="color" value={tweaks.accent} onChange={e => updateTweak({ accent: e.target.value })} />
          </label>
          <label className="tw-row">
            <span>Secondary Accent</span>
            <input type="color" value={tweaks.accent2} onChange={e => updateTweak({ accent2: e.target.value })} />
          </label>
          {theme === 'dark' && (
            <label className="tw-row">
              <span>Dark Background</span>
              <input type="color" value={tweaks.bgDark} onChange={e => updateTweak({ bgDark: e.target.value })} />
            </label>
          )}
        </div>

        <div className="tw-presets">
          <div className="tw-preset-head">
            <span className="muted mono small">Color Presets</span>
          </div>
          <div className="tw-preset-row">
            <button className="tw-preset-btn" aria-label="Teal & Indigo" onClick={() => updateTweak({ accent: '#00d4aa', accent2: '#6366f1', bgDark: '#0a0f1e' })} style={{ background: 'linear-gradient(135deg, #00d4aa, #6366f1)' }} />
            <button className="tw-preset-btn" aria-label="Orange & Red" onClick={() => updateTweak({ accent: '#f97316', accent2: '#ef4444', bgDark: '#1a0d0d' })} style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }} />
            <button className="tw-preset-btn" aria-label="Purple & Pink" onClick={() => updateTweak({ accent: '#a78bfa', accent2: '#ec4899', bgDark: '#0f0a1e' })} style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)' }} />
            <button className="tw-preset-btn" aria-label="Green & Lime" onClick={() => updateTweak({ accent: '#22c55e', accent2: '#84cc16', bgDark: '#0a1410' })} style={{ background: 'linear-gradient(135deg, #22c55e, #84cc16)' }} />
            <button className="tw-preset-btn" aria-label="Cyan & Blue" onClick={() => updateTweak({ accent: '#06b6d4', accent2: '#3b82f6', bgDark: '#0a1424' })} style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }} />
          </div>
        </div>
        
        <button className="btn tw-reset-btn" onClick={resetTweaks}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Restore Defaults
        </button>
      </div>
      <style>{`
        .tweaks { 
          position: fixed; right: 24px; bottom: 24px; z-index: 100;
          width: 320px; 
          background: color-mix(in oklab, var(--bg-alt) 85%, transparent); 
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid color-mix(in oklab, var(--accent) 30%, transparent);
          border-radius: 20px; 
          padding: 24px; 
          box-shadow: 0 24px 64px -12px rgba(0,0,0,0.5), inset 0 0 0 1px color-mix(in oklab, var(--fg) 5%, transparent), 0 0 40px -10px color-mix(in oklab, var(--accent) 20%, transparent);
          font-family: var(--sans); 
          animation: tweaks-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes tweaks-in {
          0% { transform: translateY(40px) scale(0.9); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .tw-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .tw-head h4 { font-family: var(--mono); font-size: 13px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; margin: 0; color: var(--fg); display: flex; align-items: center; gap: 10px; }
        .tw-icon { font-size: 16px; }
        .tw-close { padding: 6px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: var(--fg-soft); border-color: transparent; }
        .tw-close:hover { background: color-mix(in oklab, var(--rose) 20%, transparent); color: var(--rose); border-color: transparent; transform: rotate(90deg); box-shadow: none; }
        
        .tw-group { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
        .tw-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: color-mix(in oklab, var(--bg) 40%, transparent); border: 1px solid var(--rule-c); border-radius: 12px; font-family: var(--mono); font-size: 12px; color: var(--fg); transition: all 0.2s; }
        .tw-row:hover { border-color: color-mix(in oklab, var(--accent) 40%, transparent); background: color-mix(in oklab, var(--accent) 5%, transparent); transform: translateX(2px); }
        .tw-row span { font-weight: 500; letter-spacing: 0.5px; }
        
        /* Beautifully mask the ugly default color input */
        .tw-row input[type="color"] { -webkit-appearance: none; appearance: none; border: none; width: 28px; height: 28px; border-radius: 50%; padding: 0; overflow: hidden; cursor: pointer; background: transparent; box-shadow: 0 0 0 2px var(--rule-c); transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s; }
        .tw-row input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        .tw-row input[type="color"]::-webkit-color-swatch { border: none; border-radius: 50%; }
        .tw-row input[type="color"]::-moz-color-swatch { border: none; border-radius: 50%; }
        .tw-row input[type="color"]:hover { transform: scale(1.15); box-shadow: 0 0 0 2px var(--accent); }
        
        .tw-presets { margin-bottom: 24px; }
        .tw-preset-head { margin-bottom: 14px; padding-left: 4px; }
        .tw-preset-row { display: flex; justify-content: space-between; gap: 8px; }
        .tw-preset-btn { width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--rule-c); cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .tw-preset-btn:hover { transform: translateY(-4px) scale(1.1); border-color: #ffffff; box-shadow: 0 8px 16px -4px rgba(0,0,0,0.4); }
        
        .tw-reset-btn { width: 100%; justify-content: center; padding: 12px; border-radius: 12px; color: var(--fg-soft); border-color: var(--rule-c); background: transparent; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); font-weight: 600; }
        .tw-reset-btn:hover { background: color-mix(in oklab, var(--fg) 10%, transparent); color: var(--fg); border-color: var(--fg); transform: translateY(-2px); box-shadow: 0 4px 12px -4px rgba(0,0,0,0.2); }
        
        .small { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; }

        @media (max-width: 600px) {
          .tweaks { right: 16px; bottom: 16px; left: 16px; width: calc(100% - 32px); padding: 20px; }
        }

        html[data-theme="light"] .tweaks { background: rgba(255, 255, 255, 0.85); box-shadow: 0 24px 64px -12px rgba(0,0,0,0.15), 0 0 40px -10px color-mix(in oklab, var(--accent) 30%, transparent); }
        html[data-theme="light"] .tw-row { background: rgba(250, 250, 251, 0.6); border-color: rgba(0,0,0,0.08); }
        html[data-theme="light"] .tw-preset-btn { border-color: rgba(0,0,0,0.1); }
        html[data-theme="light"] .tw-preset-btn:hover { border-color: #000000; box-shadow: 0 8px 16px -4px color-mix(in oklab, var(--accent) 40%, transparent); }
        html[data-theme="light"] .tw-row input[type="color"] { box-shadow: 0 0 0 2px rgba(0,0,0,0.1); }
        html[data-theme="light"] .tw-row input[type="color"]:hover { box-shadow: 0 0 0 2px var(--accent); }
      `}</style>
    </aside>
  );
}
