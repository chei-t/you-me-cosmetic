/* ============================================================
   SERVICES — sticky heading + horizontal card scroll
   Desktop: ScrollTrigger drives horizontal translation of the
            card track while the heading stays sticky.
   Mobile:  native swipe carousel (no JS).
   Reduced motion: native swipe on all sizes.
   ============================================================ */
export function initServices() {
  const section = document.querySelector('.services');
  const scroll = document.querySelector('.services__scroll');
  const track = document.querySelector('.services__track');

  if (!section || !scroll || !track) return;
  if (!window.gsap || !window.ScrollTrigger) return;

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const isMobile = window.matchMedia('(max-width: 809.98px)').matches;

  if (reduceMotion || isMobile) return;

  gsap.registerPlugin(ScrollTrigger);

  const getDistance = () =>
    Math.max(0, track.scrollWidth - window.innerWidth);

  if (getDistance() <= 0) return;

  gsap.to(track, {
    x: () => -getDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${scroll.offsetHeight - window.innerHeight}`,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1
    }
  });
}