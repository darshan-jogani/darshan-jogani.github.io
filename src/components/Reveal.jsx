import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Reveal({ children, as: Tag = 'div', clip = false, delay = 0, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (clip) {
        gsap.fromTo(el,
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'expo.out', delay,
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } }
        );
      } else {
        gsap.fromTo(el,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', delay,
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } }
        );
      }
    }, el);
    return () => ctx.revert();
  }, [clip, delay]);
  return <Tag ref={ref} {...rest}>{children}</Tag>;
}
