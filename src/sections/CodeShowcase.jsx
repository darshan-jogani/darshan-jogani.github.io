import React, { useState } from 'react';
import Reveal from '../components/Reveal.jsx';

const SNIPPETS = {
  python: {
    label: 'electrolyzer.py',
    lang: 'python',
    code: `import numpy as np

F, R = 96485.0, 8.314

def cell_voltage(j, T=70, p=30):
    """Empirical AWE model. j in mA/cm², T in °C, p in bar."""
    T_K = T + 273.15
    
    # Reversible Voltage
    U_rev = 1.229 - 0.0009 * (T - 25) + (R * T_K) / (2 * F) * np.log(p) * 0.5
    
    # Ohmic resistance
    r = 1.8e-4 - (T - 25) * 1.0e-6
    
    # Activation overpotential parameters
    s = 0.16 - 0.015 * np.log10(p) - (T - 25) * 0.0008
    t = 25 + 5 * np.log10(p) - (T - 25) * 0.15
    
    # Concentration overpotential
    v_con = 3e-5 * (j / 100)**3
    
    return U_rev + r * j + s * np.log10(t * j / 1000 + 1) + v_con

j = np.linspace(0, 1000, 200)
U = cell_voltage(j, T=70, p=30)
print(f"System Efficiency (HHV): {1.481 / cell_voltage(400) * 100:.1f}%")
`,
  },

  matlab: {
    label: 'mpc_controller.m',
    lang: 'matlab',
    code: `function u = mpc_controller(x, x_ref, N, Q, R)
    % Receding-horizon MPC for 1st-order plant.
    % N: horizon, Q: tracking weight, R: control weight
    A = 0.92; B = 0.08;       % Discretized plant
    H = zeros(N, N);
    f = zeros(N, 1);
    
    for i = 1:N
        for k = 1:i
            H(i, k) = B * A^(i - k);
        end
        f(i) = (A^i) * x - x_ref;
    end
    
    Hess = 2 * (H' * Q * H + R * eye(N));
    grad = 2 * H' * Q * f;
    
    u_seq = quadprog(Hess, grad, [], [], [], [], ...
                     zeros(N, 1), 100 * ones(N, 1));
    u = u_seq(1);            % Apply only first move
end
`,
  },
  
  aspen: {
    label: 'lcoh.py',
    lang: 'python',
    code: `def lcoh(capex, cf, p_e, eta, life=20, dr=0.07):
    """Levelized cost of hydrogen (€/kg)."""
    fcr = dr * (1 + dr)**life / ((1 + dr)**life - 1)
    e_kg = 39.4 / eta             # kWh per kg H2
    h_yr = cf * 8760
    h2_kw = h_yr / e_kg

    capex_c = capex * fcr / h2_kw
    oam_c = capex * 0.03 / h2_kw
    elec_c = (p_e / 1000) * e_kg

    return capex_c + oam_c + elec_c

print(f"LCOH = €{lcoh(1200, 0.55, 60, 0.62):.2f}/kg")
`,
  },
};

const highlight = (code, lang) => {
  // tiny tokenizer — kw / str / num / com
  const kws = lang === 'matlab'
    ? ['function', 'end', 'for', 'if', 'else', 'elseif', 'return', 'while', 'zeros', 'ones', 'eye']
    : ['def', 'return', 'import', 'from', 'as', 'for', 'in', 'if', 'else', 'elif', 'print', 'class', 'try', 'except'];
  
  // Extract strings and comments first to protect them from inner highlighting
  const tokens = [];
  let html = code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/([fF]?"""[\s\S]*?"""|[fF]?"(?:[^"\\]|\\.)*"|#[^\n]*|%[^\n]*)/g, (match) => {
      tokens.push(match);
      return `__TOK${tokens.length - 1}__`;
    });

  html = html
    .replace(/\b(\d+(?:\.\d+)?(?:e[-+]?\d+)?)\b(?![^<]*>)/g, '<span class="num">$1</span>')
    .replace(/(\b[a-zA-Z_]\w*)(?=\s*\()(?![^<]*>)/g, '<span class="func">$1</span>'); // Highlight functions
  kws.forEach(k => {
    html = html.replace(new RegExp('\\b' + k + '\\b(?![^<]*>)', 'g'), `<span class="kw">${k}</span>`);
  });
  
  // Restore protected strings and comments
  html = html.replace(/__TOK(\d+)__/g, (match, i) => {
    const token = tokens[i];
    if (token.startsWith('#') || token.startsWith('%')) {
      return `<span class="com">${token}</span>`;
    } else {
      return `<span class="str">${token}</span>`;
    }
  });

  // Wrap each line for line numbers
  return html.split('\n').map(line => `<span class="line">${line || ' '}</span>`).join('');
};

export default function CodeShowcase() {
  const [tab, setTab] = useState('python');
  const [copied, setCopied] = useState(false);
  const s = SNIPPETS[tab];

  const handleCopy = () => {
    navigator.clipboard.writeText(s.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="code" className="dark">
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <div className="container">
        <Reveal clip className="section-label"><span className="num">09</span><span>Code</span></Reveal>
        <Reveal clip as="h2" className="section-title">The <em>computational backbone</em>.</Reveal>
        <Reveal as="p" className="section-intro">A taste of the actual code that drives the models above. Written for clarity over cleverness.</Reveal>

        <Reveal className="code-window">
          <div className="code-header">
            <div className="mac-btns">
              <span className="mac-btn close"></span>
              <span className="mac-btn min"></span>
              <span className="mac-btn max"></span>
            </div>
            <div className="code-tabs">
              {Object.entries(SNIPPETS).map(([k, v]) => (
                <button key={k} className={`code-tab ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>
                  {v.label}
                </button>
              ))}
            </div>
            <button className="copy-btn" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="code-scroll">
            <pre className="code-block" key={tab}><code dangerouslySetInnerHTML={{ __html: highlight(s.code, s.lang) }}/></pre>
          </div>
        </Reveal>
      </div>
      <style>{`
        .code-window { 
          --code-bg: #0d1117;
          --code-head-bg: #161b22;
          --code-bd: #30363d;
          --code-fg: #c9d1d9;
          --code-tab-fg: #8b949e;
          --code-tab-active-fg: #e6edf3;
          --code-line-num: #484f58;
          --code-line-hover: rgba(255, 255, 255, 0.04);
          --code-kw: #ff7b72;
          --code-func: #d2a8ff;
          --code-str: #a5d6ff;
          --code-num: #79c0ff;
          --code-com: #8b949e;
          margin-top: 60px; background: var(--code-bg); border: 1px solid var(--code-bd); border-radius: 12px;
          box-shadow: 0 24px 48px -12px rgba(0,0,0,0.2), 0 0 0 1px color-mix(in oklab, var(--accent) 20%, transparent); overflow: hidden;
          display: flex; flex-direction: column; }

        [data-theme="light"] .code-window {
          --code-bg: #ffffff;
          --code-head-bg: #f6f8fa;
          --code-bd: #d0d7de;
          --code-fg: #24292f;
          --code-tab-fg: #656d76;
          --code-tab-active-fg: #24292f;
          --code-line-num: #8c959f;
          --code-line-hover: rgba(0, 0, 0, 0.04);
          --code-kw: #cf222e;
          --code-func: #8250df;
          --code-str: #0a3069;
          --code-num: #0550ae;
          --code-com: #6e7781;
        }
        
        .code-header { display: flex; align-items: center; background: var(--code-head-bg); border-bottom: 1px solid var(--code-bd); padding: 0 16px; position: relative; }
        
        .mac-btns { display: flex; gap: 8px; margin-right: 24px; }
        .mac-btn { width: 12px; height: 12px; border-radius: 50%; }
        .mac-btn.close { background: #ff5f56; box-shadow: 0 0 6px #ff5f5666; }
        .mac-btn.min { background: #ffbd2e; box-shadow: 0 0 6px #ffbd2e66; }
        .mac-btn.max { background: #27c93f; box-shadow: 0 0 6px #27c93f66; }
        
        .code-tabs { display: flex; gap: 2px; overflow-x: auto; }
        .code-tab { font-family: var(--mono); font-size: 12px; padding: 14px 20px; border: 0; background: transparent; color: var(--code-tab-fg);
          cursor: pointer; display: inline-flex; align-items: center; transition: all .2s; position: relative; }
        .code-tab.active { color: var(--code-tab-active-fg); background: var(--code-bg); }
        .code-tab.active::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--accent); box-shadow: 0 2px 8px var(--accent); }
        
        .copy-btn { margin-left: auto; background: transparent; border: 1px solid var(--code-bd); color: var(--code-tab-fg);
          font-family: var(--mono); font-size: 11px; padding: 6px 12px; border-radius: 6px; cursor: pointer; transition: all .2s; }
        .copy-btn:hover { background: var(--code-bg); border-color: var(--code-tab-active-fg); color: var(--code-tab-active-fg); }
        
        .code-scroll { overflow-x: auto; max-height: 520px; }
        .code-block { margin: 0; padding: 24px 0; font-size: 13.5px; line-height: 1.6; color: var(--code-fg);
          animation: fade-in 0.4s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        
        .code-block code { counter-reset: line; font-family: 'JetBrains Mono', 'Fira Code', var(--mono), monospace;
          font-variant-ligatures: contextual; font-feature-settings: "calt" 1, "liga" 1; -webkit-font-smoothing: antialiased; }
        .code-block .line { display: block; padding-right: 24px; white-space: pre; }
        .code-block .line::before { counter-increment: line; content: counter(line); display: inline-block; width: 3rem; margin-right: 1.5rem;
          color: var(--code-line-num); text-align: right; user-select: none; }
        .code-block .line:hover { background: var(--code-line-hover); }
        
        /* Beautiful Syntax Highlighting */
        .code-block .kw { color: var(--code-kw); }
        .code-block .func { color: var(--code-func); }
        .code-block .str { color: var(--code-str); }
        .code-block .num { color: var(--code-num); }
        .code-block .com { color: var(--code-com); font-style: italic; }
      `}</style>
    </section>
  );
}
