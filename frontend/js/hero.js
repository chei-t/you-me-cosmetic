/* ============================================================
   HERO — entrance timeline (GSAP)
   Tawa recreation timing system
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

  // 3e. Product card
  tl.from('.hero__product-card', {
    y: 40,
    opacity: 0,
    scale: 0.96,
    duration: 1
  }, 1.40);

  // 3f. Hero image
  tl.from('.hero__image', {
    scale: 1.08,
    opacity: 0,
    duration: 1.4,
    ease: 'power2.out'
  }, 1.55);

  /* ---------------------------------------------------------
     4. Scroll parallax
     --------------------------------------------------------- */
  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.matchMedia('(max-width: 809.98px)').matches;

    gsap.to('.hero__image', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      y: -80,
      ease: 'none'
    });

    if (!isMobile) {
      gsap.to('.hero__content', {
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        },
        y: -40,
        ease: 'none'
      });
    }
  }
}