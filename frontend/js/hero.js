/* ============================================================
   HERO — entrance timeline (GSAP)
   Tawa recreation timing system
   ============================================================ */
import { splitText } from './splitText.js';

export function initHero() {
  if (!window.gsap) return;

  /* ---------------------------------------------------------
     Reduced motion
     --------------------------------------------------------- */
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ---------------------------------------------------------
     1. Split paragraph into characters
     --------------------------------------------------------- */
  const heroCopy = document.querySelector('.hero__copy');
  if (heroCopy) splitText(heroCopy, 'chars');

  /* ---------------------------------------------------------
     2. Reduced motion — reveal instantly
     --------------------------------------------------------- */
  if (reduceMotion) {
    gsap.set(
      [
        '.hero__tag',
        '.hero__title .word',
        '.hero__copy .char',
        '.hero__ctas .btn',
        '.hero__product-card',
        '.hero__image'
      ],
      { opacity: 1, y: 0, scale: 1, clearProps: 'all' }
    );
    return;
  }

  /* ---------------------------------------------------------
     3. Entrance timeline
     --------------------------------------------------------- */
  const tl = gsap.timeline({
    delay: 0.15,
    defaults: { ease: 'power3.out' }
  });

  // 3a. Eyebrow
  tl.from('.hero__tag', {
    y: 20,
    opacity: 0,
    duration: 0.7
  }, 0.15);

  // 3b. H1 words
  tl.from('.hero__title .word', {
    y: 70,
    opacity: 0,
    duration: 0.8,
    stagger: 0.08
  }, 0.30);

  // 3c. Paragraph chars
  tl.from('.hero__copy .char', {
    y: 15,
    opacity: 0,
    duration: 0.4,
    stagger: 0.012,
    ease: 'power2.out'
  }, 1.00);

  // 3d. CTAs
  tl.from('.hero__ctas .btn', {
    y: 20,
    opacity: 0,
    scale: 0.98,
    duration: 0.7,
    stagger: 0.1
  }, 1.20);

  // 3e. Product card — Framer match: y: 30 rise, no scale
  tl.from('.hero__product-card', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  }, 1.35);

  // 3f. Hero image — Framer match: y: 100 rise
  tl.from('.hero__image', {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
  }, 1.40);

  /* ---------------------------------------------------------
     4. Scroll parallax
     --------------------------------------------------------- */
  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.matchMedia('(max-width: 809.98px)').matches;

    gsap.fromTo(
      '.hero__image',
      { y: 0 },
      {
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        },
        y: -80,
        ease: 'none'
      }
    );

    if (!isMobile) {
      gsap.fromTo(
        '.hero__content',
        { y: 0 },
        {
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          },
          y: -40,
          ease: 'none'
        }
      );
    }
  }
}