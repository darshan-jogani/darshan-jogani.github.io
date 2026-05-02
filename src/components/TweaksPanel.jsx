import React from 'react';
import { useTweaks, useTheme } from '../lib/theme.jsx';

export default function TweaksPanel({ open, onClose }) {
  const { tweaks, updateTweak, resetTweaks } = useTweaks();
  const { theme } = useTheme();
  if (!open) return null;
  return (
    <aside className="tweaks">
      <div className="tw-head">
        <h4>Tweaks</h4>
        <button className="btn" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <div className="tw-body">
        <label className="tw-row">
          <span>Accent</span>
          <input type="color" value={tweaks.accent} onChange={e => updateTweak({ accent: e.target.value })} />
        </label>
        <label className="tw-row">
          <span>Accent 2</span>
          <input type="color" value={tweaks.accent2} onChange={e => updateTweak({ accent2: e.target.value })} />
        </label>
        {theme === 'dark' && (
          <label className="tw-row">
            <span>Background</span>
            <input type="color" value={tweaks.bgDark} onChange={e => updateTweak({ bgDark: e.target.value })} />
          </label>
        )}
        <div className="tw-presets">
          <span className="muted mono small">Presets</span>
          <div className="tw-preset-row">
            <button onClick={() => updateTweak({ accent: '#00d4aa', accent2: '#6366f1', bgDark: '#0a0f1e' })} style={{ background: 'linear-gradient(120deg,#00d4aa,#6366f1)' }} />
            <button onClick={() => updateTweak({ accent: '#f97316', accent2: '#ef4444', bgDark: '#1a0d0d' })} style={{ background: 'linear-gradient(120deg,#f97316,#ef4444)' }} />
            <button onClick={() => updateTweak({ accent: '#a78bfa', accent2: '#ec4899', bgDark: '#0f0a1e' })} style={{ background: 'linear-gradient(120deg,#a78bfa,#ec4899)' }} />
            <button onClick={() => updateTweak({ accent: '#22c55e', accent2: '#84cc16', bgDark: '#0a1410' })} style={{ background: 'linear-gradient(120deg,#22c55e,#84cc16)' }} />
            <button onClick={() => updateTweak({ accent: '#06b6d4', accent2: '#3b82f6', bgDark: '#0a1424' })} style={{ background: 'linear-gradient(120deg,#06b6d4,#3b82f6)' }} />
          </div>
        </div>
        <button className="btn" onClick={resetTweaks}>Reset</button>
      </div>
      <style>{`
        .tweaks { position: fixed; right: 20px; bottom: 20px; z-index: 100;
          width: 280px; background: var(--bg-alt); border: 1px solid var(--rule-c);
          border-radius: 10px; padding: 16px; box-shadow: var(--shadow-1);
          font-family: var(--sans); }
        .tw-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .tw-head h4 { font-family: var(--mono); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 0; color: var(--fg-soft); }
        .tw-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-top: 1px solid var(--rule-c); font-family: var(--mono); font-size: 12px; color: var(--fg-soft); }
        .tw-row input[type="color"] { width: 36px; height: 24px; border: 1px solid var(--rule-c); border-radius: 4px; background: transparent; cursor: pointer; }
        .tw-presets { padding: 12px 0; border-top: 1px solid var(--rule-c); }
        .small { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; }
        .tw-preset-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-top: 8px; }
        .tw-preset-row button { width: 100%; aspect-ratio: 1; border-radius: 50%; border: 1px solid var(--rule-c); cursor: pointer; }
      `}</style>
    </aside>
  );
}
