import React from 'react';
import Reveal from '../components/Reveal.jsx';
import { talks } from '../data/talks.jsx';

export default function Talks() {
  return (
    <section id="talks" className="alt">
      <div className="container">
        <Reveal clip className="section-label"><span className="num">11</span><span>Talks & Conferences</span></Reveal>
        <Reveal clip as="h2" className="section-title">Where I've <em>shared the work</em>.</Reveal>

        <ol className="timeline">
          {talks.map((t, i) => (
            <Reveal as="li" className={`tl-item ${t.upcoming ? 'upcoming' : ''}`} key={i}>
              <div className="tl-dot"/>
              <div className="tl-date mono">{t.date}</div>
              <div className="tl-body">
                <div className="tl-where mono small">{t.where}</div>
                <h3>{t.title}</h3>
                <p>{t.note}</p>
                {t.upcoming && <span className="tl-tag">Upcoming</span>}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
      <style>{`
        .timeline { list-style: none; padding: 0; margin: 60px 0 0; position: relative; }
        .timeline::before { content: ""; position: absolute; left: 140px; top: 8px; bottom: 8px;
          width: 1px; background: var(--rule-c); }
        @media (max-width: 700px) { .timeline::before { left: 12px; } }
        .tl-item { display: grid; grid-template-columns: 120px 1fr; gap: 32px; padding: 24px 0 24px 40px; position: relative; }
        @media (max-width: 700px) { .tl-item { grid-template-columns: 1fr; padding-left: 32px; } .tl-date { grid-column: 1; } }
        .tl-dot { position: absolute; left: 134px; top: 30px; width: 14px; height: 14px; border-radius: 50%;
          background: var(--bg-alt); border: 2px solid var(--rule-c); z-index: 2; transition: all .25s; }
        @media (max-width: 700px) { .tl-dot { left: 6px; } }
        .tl-item.upcoming .tl-dot { background: var(--accent); border-color: var(--accent);
          box-shadow: 0 0 0 6px color-mix(in oklab, var(--accent) 20%, transparent); }
        .tl-date { color: var(--fg-soft); font-size: 12px; letter-spacing: 1.5px; padding-top: 6px; }
        .tl-where { color: var(--accent); margin-bottom: 6px; }
        .tl-body h3 { font-family: var(--serif); font-size: 22px; font-weight: 500; line-height: 1.3; margin: 0 0 8px; color: var(--fg); }
        .tl-body p { color: var(--fg-soft); font-size: 14.5px; line-height: 1.6; margin: 0; max-width: 60ch; }
        .tl-tag { display: inline-block; margin-top: 10px; padding: 4px 10px; border-radius: 999px;
          font-family: var(--mono); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
          background: color-mix(in oklab, var(--accent) 16%, transparent); color: var(--accent); }
        .small { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; }
      `}</style>
    </section>
  );
}
