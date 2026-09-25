/* ============================================================
   REVEAL — generic [data-reveal] scroll animation

   Role: LAST layer. Only for elements without a dedicated
   animation in another module.

   Safe targets:
     - generic paragraphs, headings, images, dividers

   Do NOT place [data-reveal] on:
     - .hero__*                     (hero.js owns)
     - .cluster-card / __inner      (cluster.js owns)
     - [data-count]                 (counters.js owns)
     - .carousel__track / __item    (carousel.js owns)
     - .main-video                  (video.js owns)
   ============================================================ */
export function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length || !window.gsap) return;

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (reduceMotion) {
    gsap.set(els, { y: 0, opacity: 1 });
    return;
  }

  if (window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
  }

  els.forEach((el) => {
    gsap.fromTo(
      el,
      {
        y: 50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: window.ScrollTrigger
          ? {
              trigger: el,
              start: 'top 88%',
              once: true
            }
          : undefined
      }
    );
  });
}