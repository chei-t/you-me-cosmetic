/* ============================================================
   COUNTERS — animate stat numbers when they enter viewport
   Vanilla requestAnimationFrame (no GSAP needed)
   ============================================================ */
export function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);

    if (Number.isNaN(target)) return;

    if (reduceMotion) {
      el.textContent = target;
      return;
    }

    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      el.textContent = Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((counter) => io.observe(counter));
  } else {
    counters.forEach(animate);
  }
}