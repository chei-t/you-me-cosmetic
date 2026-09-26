/* ============================================================
   HERO — entrance timeline (GSAP)
   Scope:
     - hero tag, H1 words, paragraph chars, CTAs,
       product card, hero image entrance
     - hero scroll parallax (image + content)
   NOT in scope:
     - navbar entrance (owned by navbar.js)
   ============================================================ */
import { splitText } from './splitText.js';

export function initHero() {
  if (!window.gsap) return;

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ---------------------------------------------------------
     1. Split paragraph into characters
     --------------------------------------------------------- */
  const heroCopy = document.querySelector('.hero__copy');
  if (heroCopy) splitText(heroCopy, 'chars');

  /* ---------------------------------------------------------
     2. Reduced motion — reveal instantly, no parallax
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

  tl.from('.hero__tag', {
    y: 20,
    opacity: 0,
    duration: 0.7
  }, 0.15);

  tl.from('.hero__title .word', {
    y: 70,
    opacity: 0,
    duration: 0.8,
    stagger: 0.08
  }, 0.30);

  tl.from('.hero__copy .char', {
    y: 15,
    opacity: 0,
    duration: 0.4,
    stagger: 0.012,
    ease: 'power2.out'
  }, 1.00);

  tl.from('.hero__ctas .btn', {
    y: 20,
    opacity: 0,
    scale: 0.98,
    duration: 0.7,
    stagger: 0.1
  }, 1.20);

  tl.from('.hero__product-card', {
    y: 40,
    opacity: 0,
    scale: 0.96,
    duration: 1
  }, 1.40);

  tl.from('.hero__image', {
    scale: 1.08,
    opacity: 0,
    duration: 1.4,
    ease: 'power2.out'
  }, 1.55);

  /* ---------------------------------------------------------
     4. Scroll parallax
     IMPORTANT: start is 'top top' and end is 'bottom top'
     so parallax only runs WHILE the hero is in view.
     At page load, hero is at top → y = 0.
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