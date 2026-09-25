/* ============================================================
   REVEAL — generic [data-reveal] scroll animation
   ============================================================ */
export function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length || !window.gsap) return;

  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  els.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: window.ScrollTrigger ? {
        trigger: el,
        start: 'top 88%',
        once: true
      } : undefined,
      y: 50,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out'
    });
  });
}