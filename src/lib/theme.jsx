import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeCtx = createContext(null);
const TweaksCtx = createContext(null);

const DEFAULT_TWEAKS = {
  accent: '#00d4aa',
  accent2: '#6366f1',
  bgDark: '#0a0f1e',
  serifSize: 1.0,
  density: 'comfortable',
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('dj-theme') || 'dark'; } catch { return 'dark'; }
  });
  const [tweaks, setTweaks] = useState(() => {
    try {
      const raw = localStorage.getItem('dj-tweaks');
      return raw ? { ...DEFAULT_TWEAKS, ...JSON.parse(raw) } : DEFAULT_TWEAKS;
    } catch { return DEFAULT_TWEAKS; }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('dj-theme', theme); } catch {}
  }, [theme]);

  // useEffect(() => {
  //   const root = document.documentElement;
  //   root.style.setProperty('--accent', tweaks.accent);
  //   root.style.setProperty('--accent-2', tweaks.accent2);
  //   if (theme === 'dark') root.style.setProperty('--bg', tweaks.bgDark);
  //   try { localStorage.setItem('dj-tweaks', JSON.stringify(tweaks)); } catch {}
  // }, [tweaks, theme]);

  useEffect(() => {
    const root = document.documentElement;
    // Always sync accents
    root.style.setProperty('--accent', tweaks.accent);
    root.style.setProperty('--accent-2', tweaks.accent2);

    // For the background, set an inline dark value only when in dark theme.
    // Remove the inline property when switching to light so stylesheet rules
    // (tokens.css html[data-theme="light"] {...}) can take effect.
    if (theme === 'dark') {
      root.style.setProperty('--bg', tweaks.bgDark);
    } else {
      root.style.removeProperty('--bg');
    }

    try { localStorage.setItem('dj-tweaks', JSON.stringify(tweaks)); } catch {}
  }, [tweaks, theme]);

  const updateTweak = useCallback((patch) => setTweaks(t => ({ ...t, ...patch })), []);
  const resetTweaks = useCallback(() => setTweaks(DEFAULT_TWEAKS), []);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme, toggle: () => setTheme(t => t === 'dark' ? 'light' : 'dark') }}>
      <TweaksCtx.Provider value={{ tweaks, updateTweak, resetTweaks }}>
        {children}
      </TweaksCtx.Provider>
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
export const useTweaks = () => useContext(TweaksCtx);
