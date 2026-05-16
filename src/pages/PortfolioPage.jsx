import React, { useCallback, useEffect, useState, Suspense, lazy } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollProgress from '../components/ScrollProgress.jsx';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Hero from '../sections/Hero.jsx';
import About from '../sections/About.jsx';
import Research from '../sections/Research.jsx';
import Publications from '../sections/Publications.jsx';
import Talks from '../sections/Talks.jsx';
import LabPortal from '../sections/LabPortal.jsx';
import Contact from '../sections/Contact.jsx';
import { TranslationProvider } from '../context/TranslationContext.jsx';

const TweaksPanel = lazy(() => import('../components/TweaksPanel.jsx'));

function downloadCV() {
  const url = '/Darshan-Jogani-CV.pdf';
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

export default function PortfolioPage() {
  const cv = useCallback(downloadCV, []);
  const [tweaksOpen, setTweaksOpen] = useState(false);

  useEffect(() => {
    // Refresh ScrollTrigger after navigating back from the lab
    ScrollTrigger.refresh();
  }, []);

  return (
    <TranslationProvider>
      <ScrollProgress />
      <Nav onCV={cv} onTweaks={() => setTweaksOpen(o => !o)} />
      <main>
        <Hero />
        <About />
        <Research />
        <Publications />
        <Talks />
        <LabPortal />
        <Contact />
      </main>
      <Footer />
      <Suspense fallback={null}>
        <TweaksPanel open={tweaksOpen} onClose={() => setTweaksOpen(false)} />
      </Suspense>
    </TranslationProvider>
  );
}
