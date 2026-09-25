/* ============================================================
   HERO — entrance timeline (GSAP)
   Matches Framer appear animation timings
   ============================================================ */
import { splitText } from './splitText.js';

export function initHero() {
  if (!window.gsap) return;

  /* -------- Split paragraph into chars -------- */
  const heroCopy = document.querySelector('.hero__copy');
  if (heroCopy) splitText(heroCopy, 'chars');

  /* -------- Build timeline -------- */
  const tl = gsap.timeline({
    delay: 0.15,
    defaults: { ease: 'power3.out' }
  });

  // Navbar
  gsap.from('.navbar', {
    y: -80,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    delay: 0.05
  });

  // Tag
  tl.from('.hero__tag', {
    y: 20,
    opacity: 0,
    duration: 0.7
  }, 0.15);

  // H1 words
  const words = document.querySelectorAll('.hero__title .word');
  words.forEach((word, i) => {
    tl.from(word, {
      y: 60,
      opacity: 0,
      rotateX: -40,
      duration: 0.9,
      ease: 'power3.out'
    }, 0.30 + i * 0.08);
  });

  // Paragraph chars
  const chars = document.querySelectorAll('.hero__copy .char');
  if (chars.length) {
    tl.from(chars, {
      y: 15,
      opacity: 0,
      duration: 0.4,
      stagger: 0.012,
      ease: 'power2.out'
    }, 1.00);
  }

  // CTAs
  tl.from('.hero__ctas .btn', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.12
  }, 1.20);

  // Product card
  tl.from('.hero__product-card', {
    y: 30,
    opacity: 0,
    duration: 0.8
  }, 1.40);

  // Hero image
  tl.from('.hero__image', {
    scale: 0.9,
    opacity: 0,
    duration: 1.1
  }, 1.55);

  /* -------- Hero parallax on scroll -------- */
  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to('.hero__image', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      y: 80,
      scale: 1.06,
      ease: 'none'
    });
  }
}