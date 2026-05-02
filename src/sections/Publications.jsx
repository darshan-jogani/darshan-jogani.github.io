import React, { useState, useMemo } from 'react';
import Reveal from '../components/Reveal.jsx';
import { publications, toBibtex } from '../data/publications.jsx';

const TYPES = [
  { k: 'all', label: 'All' },
  { k: 'preprint', label: 'Articles' },
  { k: 'conference', label: 'Conferences' },
  { k: 'thesis', label: 'Thesis' },
];

export default function Publications() {
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [bib, setBib] = useState(null);

  const list = useMemo(() => publications.filter(p => {
    if (filter !== 'all' && p.type !== filter) return false;
    if (!q) return true;
    const s = (p.title + ' ' + p.venue + ' ' + p.authors.join(' ')).toLowerCase();
    return s.includes(q.toLowerCase());
  }), [filter, q]);

  const copy = (text) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <section id="publications" className="dark">
      <div className="container">
        <Reveal clip className="section-label"><span className="num">10</span><span>Publications</span></Reveal>
        <Reveal clip as="h2" className="section-title">Selected <em>writing</em>.</Reveal>
        <Reveal as="p" className="section-intro">Working papers and conference contributions. Hover any entry for the abstract; grab a BibTeX snippet with one click.</Reveal>

        <Reveal className="pub-controls">
          <div className="pub-filters">
            {TYPES.map(t => (
              <button key={t.k} className={`pub-filter ${filter === t.k ? 'active' : ''}`} onClick={() => setFilter(t.k)}>{t.label}</button>
            ))}
          </div>
          <div className="pub-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input placeholder="Search title, venue…" value={q} onChange={e => setQ(e.target.value)}/>
          </div>
        </Reveal>

        <div className="pub-list">
          {list.map(p => (
            <Reveal key={p.id} className="pub-row">
              <div className="pub-year mono">{p.year}</div>
              <div className="pub-body">
                <div className="pub-type mono">{p.type === 'thesis' ? 'Thesis' : p.type === 'conference' ? 'Conference' : 'Article'} · {p.status}</div>
                <h3 className="pub-title">{p.title}</h3>
                <div className="pub-meta">
                  <span className="pub-authors">{p.authors.join(', ')}</span>
                  <span className="pub-venue">{p.venue}</span>
                </div>
                <p className="pub-abstract">{p.abstract}</p>
              </div>
              <div className="pub-actions">
                <button className="btn" onClick={() => setBib(p)}>BibTeX</button>
                {p.doi && p.doi !== '#' && <a className="btn" href={p.doi} target="_blank" rel="noreferrer">DOI ↗</a>}
              </div>
            </Reveal>
          ))}
          {list.length === 0 && <p className="muted mono small" style={{ padding: '40px 0' }}>No publications match.</p>}
        </div>

        {bib && (
          <div className="bib-overlay" onClick={() => setBib(null)}>
            <div className="bib-modal" onClick={e => e.stopPropagation()}>
              <div className="bib-head">
                <span className="mono small">BibTeX · {bib.id}</span>
                <button className="btn" onClick={() => copy(toBibtex(bib))}>Copy</button>
              </div>
              <pre>{toBibtex(bib)}</pre>
              <button className="btn" onClick={() => setBib(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .pub-controls { display: flex; justify-content: space-between; gap: 16px; margin: 60px 0 28px; flex-wrap: wrap; }
        .pub-filters { display: flex; gap: 6px; flex-wrap: wrap; }
        .pub-filter { font-family: var(--mono); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
          padding: 8px 14px; border: 1px solid var(--rule-c); background: transparent; color: var(--fg-soft);
          border-radius: 999px; cursor: pointer; transition: all .2s; }
        .pub-filter:hover { color: var(--fg); border-color: var(--fg-soft); }
        .pub-filter.active { background: var(--accent); color: #061a14; border-color: var(--accent); font-weight: 600; }
        .pub-search { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px;
          border: 1px solid var(--rule-c); border-radius: 999px; color: var(--fg-soft); }
        .pub-search input { background: transparent; border: 0; color: var(--fg); font-family: var(--sans); font-size: 13px; outline: none; min-width: 200px; }

        .pub-list { display: flex; flex-direction: column; }
        .pub-row { display: grid; grid-template-columns: 80px 1fr auto; gap: 24px; padding: 28px 0; border-top: 1px solid var(--rule-c); align-items: start; }
        .pub-row:last-child { border-bottom: 1px solid var(--rule-c); }
        .pub-year { font-size: 11px; color: var(--accent); letter-spacing: 1.5px; padding-top: 4px; }
        .pub-type { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--fg-soft); }
        .pub-title { font-family: var(--serif); font-size: clamp(20px, 2vw, 26px); font-weight: 500; line-height: 1.25; margin: 6px 0 10px; color: var(--fg); }
        .pub-meta { display: flex; gap: 18px; font-size: 13px; color: var(--fg-soft); flex-wrap: wrap; }
        .pub-venue { font-style: italic; }
        .pub-abstract { margin: 12px 0 0; max-width: 70ch; font-size: 14px; color: var(--fg-soft); line-height: 1.65;
          max-height: 0; overflow: hidden; opacity: 0; transition: all .35s ease; }
        .pub-row:hover .pub-abstract { max-height: 200px; opacity: 1; margin-top: 12px; }
        .pub-actions { display: flex; gap: 6px; flex-direction: column; }
        @media (max-width: 700px) { .pub-row { grid-template-columns: 1fr; } .pub-actions { flex-direction: row; } }

        .bib-overlay { position: fixed; inset: 0; z-index: 120; background: rgba(0,0,0,.7); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; padding: 24px; }
        .bib-modal { background: var(--bg-alt); border: 1px solid var(--rule-c); border-radius: var(--radius);
          padding: 24px; max-width: 640px; width: 100%; }
        .bib-head { display: flex; justify-content: space-between; margin-bottom: 16px; }
        .small { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--fg-soft); }
        .bib-modal pre { font-family: var(--mono); font-size: 12px; color: var(--fg); background: var(--bg);
          padding: 18px; border-radius: 4px; border: 1px solid var(--rule-c); overflow-x: auto; }
      `}</style>
    </section>
  );
}
