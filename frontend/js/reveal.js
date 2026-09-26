/* ============================================================
   REVEAL — generic scroll animations
   Handles:
     - [data-reveal]         → fade + rise (default)
     - [data-reveal="left"]  → slide from left
     - [data-reveal="right"] → slide from right
     - [data-reveal="up"]    → slide up (used by Services cards)
     - [data-reveal="clip"]  → clip-path reveal
     - [data-reveal="scale"] → scale-in from 1.06
     - [data-reveal="letters"] → per-letter stagger on h2/h3
   ============================================================ */
import { splitText } from './splitText.js';

export function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length || !window.gsap) return;

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (reduceMotion) {
    els.forEach((el) => {
      gsap.set(el, { opacity: 1, y: 0, scale: 1, x: 0, clearProps: 'clipPath' });
    });
    return;
  }

  if (window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
  }

  els.forEach((el) => {
    const variant = el.dataset.reveal;

    /* ---------- Per-letter H2 reveal ---------- */
    if (variant === 'letters' && el.matches('h2, h3')) {
      splitText(el, 'chars');
      const chars = el.querySelectorAll('.char');
      if (!chars.length) return;

      gsap.fromTo(
        chars,
        { y: '0.6em', opacity: 0 },
        {
          scrollTrigger: window.ScrollTrigger
            ? { trigger: el, start: 'top 85%', once: true }
            : undefined,
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.018
        }
      );
      return;
    }

    /* ---------- Clip-path reveal ---------- */
    if (variant === 'clip') {
      gsap.fromTo(
        el,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          scrollTrigger: window.ScrollTrigger
            ? { trigger: el, start: 'top 85%', once: true }
            : undefined,
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.1,
          ease: 'power3.out'
        }
      );
      return;
    }

    /* ---------- Scale reveal ---------- */
    if (variant === 'scale') {
      gsap.fromTo(
        el,
        { scale: 1.06, opacity: 0 },
        {
          scrollTrigger: window.ScrollTrigger
            ? { trigger: el, start: 'top 85%', once: true }
            : undefined,
          scale: 1,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out'
        }
      );
      return;
    }

    /* ---------- Slide from left / right ---------- */
    if (variant === 'left' || variant === 'right') {
      const offset = variant === 'left' ? -60 : 60;
      gsap.fromTo(
        el,
        { x: offset, opacity: 0 },
        {
          scrollTrigger: window.ScrollTrigger
            ? { trigger: el, start: 'top 85%', once: true }
            : undefined,
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out'
        }
      );
      return;
    }

    /* ---------- Slide up (used by Services cards) ---------- */
    if (variant === 'up') {
      gsap.fromTo(
        el,
        { y: 60, opacity: 0 },
        {
          scrollTrigger: window.ScrollTrigger
            ? { trigger: el, start: 'top 85%', once: true }
            : undefined,
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out'
        }
      );
      return;
    }

    /* ---------- Default: fade + rise ---------- */
    gsap.fromTo(
      el,
      { y: 50, opacity: 0 },
      {
        scrollTrigger: window.ScrollTrigger
          ? { trigger: el, start: 'top 88%', once: true }
          : undefined,
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out'
      }
    );
  });
}