/* ============================================================
   SHOWCASE — parallax product image
   Image translates vertically + scales subtly as it scrolls.
   ============================================================ */
export function initShowcase() {
  const section = document.querySelector('.showcase');
  const product = document.querySelector('.showcase__product');
  const img = product?.querySelector('img');

  if (!section || !product || !img) return;
  if (!window.gsap || !window.ScrollTrigger) return;

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  if (reduceMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(
    img,
    { y: -60, scale: 1.08 },
    {
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: 60,
      scale: 1,
      ease: 'none'
    }
  );
}