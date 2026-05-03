import React, { useState } from 'react';
import Reveal from '../components/Reveal.jsx';

// Obfuscate the email to protect against simple scraping bots
const emailUser = 'darshanjogani';
const emailDomain = 'outlook.com';
const getEmail = () => `${emailUser}@${emailDomain}`;

const SOCIALS = [
  { k: 'Email', v: getEmail(), getHref: () => `mailto:${getEmail()}`, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg> },
  { k: 'GitHub', v: 'darshan-jogani', href: 'https://github.com/darshan-jogani', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> },
  { k: 'LinkedIn', v: 'darshan-jogani', href: 'https://www.linkedin.com/in/darshan-jogani/', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> },
  { k: 'ORCID', v: '0009-0007-8954-4934', href: 'https://orcid.org/0009-0007-8954-4934', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
  { k: 'Location', v: 'DLR Stuttgart, Germany', href: 'https://maps.app.goo.gl/9geNUP1EJZaevzys5', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
  { k: 'Languages', v: 'English · German · Hindi · Gujarati', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg> },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: 'collaboration', msg: '' });
  const [sent, setSent] = useState(false);
  // Determine if today is a public holiday (simple fixed-date list for Germany)
  const isPublicHoliday = (d) => {
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const mmdd = `${month}-${day}`;
    // Common fixed-date public holidays in Germany (not exhaustive)
    const fixedHolidays = ['01-01', '05-01', '10-03', '12-25', '12-26'];
    return fixedHolidays.includes(mmdd);
  };

  const now = new Date();
  const weekday = now.getDay(); // 0 = Sun, 6 = Sat
  const holiday = isPublicHoliday(now);
  const isWeekday = weekday >= 1 && weekday <= 5;
  let statusText = 'Responsive';
  let statusClass = 'open';
  if (holiday) {
    statusText = 'Public holiday';
    statusClass = 'closed';
  } else if (!isWeekday) {
    statusText = 'Away';
    statusClass = 'closed';
  }

  const trackGlow = (e) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const submit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[Portfolio · ${form.topic}] ${form.name || 'Hello'}`);
    const body = encodeURIComponent(`From: ${form.name} <${form.email}>\n\n${form.msg}`);
    window.location.href = `mailto:${getEmail()}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };
  return (
    <section id="contact" className="dark">
      <div className="container">
        <Reveal clip className="section-label"><span className="num">12</span><span>Contact</span></Reveal>
        <Reveal clip as="h2" className="section-title">Let's <em>build something</em>.</Reveal>
        <Reveal as="p" className="section-intro">Open to research collaborations, industrial partnerships, conference invitations and graduate-student inquiries. The fastest path is email — but pick your channel.</Reveal>

        <div className="ct-grid">
          <Reveal className="card ct-form-card">
            <form className="ct-form" onSubmit={submit}>
              <div className="row">
                <div className="field"><label>Name</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/></div>
                <div className="field"><label>Email</label><input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/></div>
              </div>
              <div className="field">
                <label>Topic</label>
                <select value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })}>
                  <option value="collaboration">Research Collaboration</option>
                  <option value="industry">Industrial Partnership</option>
                  <option value="speaking">Speaking / Conference Invitation</option>
                  <option value="phd">PhD / Graduate Inquiry</option>
                  <option value="other">Something Else</option>
                </select>
              </div>
              <div className="field"><label>Message</label><textarea required value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} placeholder="Tell me a little about what you're working on…"/></div>
              <button className="btn btn-primary" type="submit">{sent ? '✓ Email opened' : 'Send Message →'}</button>
            </form>
          </Reveal>
          <Reveal className="ct-side">
            <div className="ct-side-list">
              {SOCIALS.map(s => (
                (s.href || s.getHref) ? (
                  <a key={s.k} className="ct-row" href={s.href || s.getHref()} target={s.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                    <span className="k mono small">{s.icon} {s.k}</span>
                    <span className="v">{s.v}<span className="arr">↗</span></span>
                  </a>
                ) : (
                  <div key={s.k} className="ct-row static">
                    <span className="k mono small">{s.icon} {s.k}</span>
                    <span className="v">{s.v}</span>
                  </div>
                )
              ))}
            </div>
            <div className="ct-quote" onMouseMove={trackGlow} onMouseLeave={(e) => { e.currentTarget.style.setProperty('--mx', '50%'); e.currentTarget.style.setProperty('--my', '50%'); }}>
                <div className="quote-head">
                    <span className="mono small">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      Office hours
                    </span>
                    <span className={`status-badge ${statusClass}`}>
                      <svg width="10" height="10" viewBox="0 0 10 10" style={{ overflow: 'visible', flexShrink: 0 }}>
                        <circle cx="5" cy="5" r="4.5" fill="currentColor" stroke="var(--bg)" strokeWidth="2" className="status-dot" />
                      </svg>
                      {statusText}
                    </span>
                  </div>
              <p>"Mon – Fri, generally responsive within 48 h.<br/>Weekends are for the family, the food, and the fun."</p>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        .ct-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 28px; margin-top: 60px; }
        @media (max-width: 900px) { .ct-grid { grid-template-columns: 1fr; } }
        .ct-form-card { padding: 32px; }
        .ct-form .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 600px) { .ct-form .row { grid-template-columns: 1fr; } }
        .ct-side { display: flex; flex-direction: column; gap: 20px; }
        .ct-side-list { display: flex; flex-direction: column; }
        .ct-row { display: grid; grid-template-columns: 130px 1fr; gap: 16px; padding: 18px 0; border-top: 1px solid var(--rule-c);
          align-items: center; transition: color .2s, padding-left .2s; }
        @media (max-width: 600px) {
          .ct-row { grid-template-columns: 1fr; gap: 4px; padding: 16px 0; align-items: flex-start; }
          .ct-row .v { justify-content: flex-start; }
        }
        .ct-row:last-child { border-bottom: 1px solid var(--rule-c); }
        .ct-row:not(.static):hover { padding-left: 8px; color: var(--accent); }
        .ct-row .k { color: var(--fg-soft); display: flex; align-items: center; gap: 8px; }
        .ct-row .k svg { color: var(--accent); transition: color .2s; }
        .ct-row:not(.static):hover .k { color: var(--accent); }
        .ct-row .v { font-family: var(--serif); font-size: 18px; color: var(--fg); display: flex; justify-content: space-between; align-items: center; }
        .ct-row:not(.static):hover .v { color: var(--accent); }
        .ct-row .arr { opacity: 0; transition: opacity .2s; margin-left: 8px; }
        .ct-row:hover .arr { opacity: 1; }
        .ct-quote { position: relative; padding: 28px; background: var(--card); border: 1px solid var(--card-bd); border-radius: var(--radius); overflow: hidden;
          transition: all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275); --mx: 50%; --my: 50%; }
        .ct-quote > * { position: relative; z-index: 2; }
        .ct-quote::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: var(--accent); opacity: 0; transition: opacity 0.3s; z-index: 2; }
        .ct-quote::after { content: ""; position: absolute; inset: -1px; border-radius: calc(var(--radius) + 1px);
          background: radial-gradient(400px circle at var(--mx) var(--my), color-mix(in oklab, var(--accent) 80%, transparent), transparent 40%);
          opacity: 0; transition: opacity .3s; pointer-events: none; z-index: 1;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
        .ct-quote:hover::before, .ct-quote:hover::after { opacity: 1; }
        .ct-quote:hover::before { box-shadow: 0 0 20px 2px var(--accent); }
        .ct-quote:hover { border-color: color-mix(in oklab, var(--accent) 40%, var(--card-bd)); transform: translateY(-4px) scale(1.01); 
          box-shadow: 0 16px 32px -16px color-mix(in oklab, var(--accent) 30%, transparent); }
        .quote-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .quote-head .small { color: var(--accent); display: flex; align-items: center; gap: 6px; font-weight: 600; }
        .status-badge { font-family: var(--mono); font-size: 10px; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 1px; display: inline-flex; align-items: center; gap: 6px; }
        .status-badge.open { background: color-mix(in oklab, #10b981 15%, transparent); color: #10b981; border: 1px solid color-mix(in oklab, #10b981 30%, transparent); }
        .status-badge.closed { background: color-mix(in oklab, #ef4444 12%, transparent); color: #ef4444; border: 1px solid color-mix(in oklab, #ef4444 30%, transparent); }
        
        .status-dot { animation: pulse-dot 1.5s infinite; }
        @keyframes pulse-dot { 0%, 100% { stroke-width: 2px; stroke-opacity: 1; } 50% { stroke-width: 8px; stroke-opacity: 0.4; } }
        .ct-quote p { font-family: var(--serif); font-style: italic; font-size: 16px; line-height: 1.6; color: var(--fg); margin: 0; position: relative; z-index: 2; }
        .small { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; }
        .field select { width: 100%; padding: 12px 14px; border-radius: 4px; background: transparent; border: 1px solid var(--rule-c); color: var(--fg); font-family: var(--sans); font-size: 14px; transition: border-color .2s; }
        .field select:focus { outline: none; border-color: var(--accent); }
        .field select option { background: var(--bg); color: var(--fg); }
      `}</style>
    </section>
  );
}
