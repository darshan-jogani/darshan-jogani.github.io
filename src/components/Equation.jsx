import React, { useEffect, useRef } from 'react';
import katex from 'katex';

export default function Equation({ tex, display = true, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    katex.render(tex, ref.current, { displayMode: display, throwOnError: false, output: 'html' });
  }, [tex, display]);
  return <div ref={ref} className={className} />;
}
