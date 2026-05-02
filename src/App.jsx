import React, { useState, useCallback } from 'react';
import { ThemeProvider } from './lib/theme.jsx';
import Preloader from './components/Preloader.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import TweaksPanel from './components/TweaksPanel.jsx';
import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Research from './sections/Research.jsx';
import ElectrolyzerModel from './sections/ElectrolyzerModel.jsx';
import PolarizationCurve from './sections/PolarizationCurve.jsx';
import MPCDemo from './sections/MPCDemo.jsx';
import TEA from './sections/TEA.jsx';
import PowerToX from './sections/PowerToX.jsx';
import Renewables from './sections/Renewables.jsx';
import CodeShowcase from './sections/CodeShowcase.jsx';
import Publications from './sections/Publications.jsx';
import Talks from './sections/Talks.jsx';
import Contact from './sections/Contact.jsx';

function downloadCV() {
  // Placeholder PDF generated client-side. Drop a real /Darshan-Jogani-CV.pdf in /public to override.
  const url = '/Darshan-Jogani-CV.pdf';
  // try real first
  fetch(url, { method: 'HEAD' }).then(r => {
    if (r.ok) { window.open(url, '_blank'); return; }
    throw new Error('no real cv');
  }).catch(() => {
    const blob = new Blob([
      '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n',
      '2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n',
      '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n',
      '4 0 obj<</Length 95>>stream\nBT /F1 24 Tf 72 720 Td (Darshan Jogani — CV) Tj 0 -30 Td /F1 12 Tf (Placeholder. Replace public/Darshan-Jogani-CV.pdf) Tj ET\nendstream endobj\n',
      '5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n',
      'xref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000098 00000 n\n0000000183 00000 n\n0000000327 00000 n\n',
      'trailer<</Size 6/Root 1 0 R>>\nstartxref\n390\n%%EOF',
    ], { type: 'application/pdf' });
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u; a.download = 'Darshan-Jogani-CV.pdf'; a.click();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
  });
}

export default function App() {
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const cv = useCallback(downloadCV, []);
  return (
    <ThemeProvider>
      <Preloader />
      <ScrollProgress />
      <Nav onCV={cv} onTweaks={() => setTweaksOpen(o => !o)} />
      <main>
        <Hero />
        <About />
        <Research />
        <ElectrolyzerModel />
        <PolarizationCurve />
        <MPCDemo />
        <TEA />
        <PowerToX />
        <Renewables />
        <CodeShowcase />
        <Publications />
        <Talks />
        <Contact />
      </main>
      <Footer />
      <TweaksPanel open={tweaksOpen} onClose={() => setTweaksOpen(false)} />
    </ThemeProvider>
  );
}
