/* ============================================================
   SERVICES — staggered card reveal
   Each card slides in from its direction (left / right / up)
   as it enters the viewport. Uses IntersectionObserver.
   ============================================================ */
export function initServices() {
  const cards = document.querySelectorAll('.service-card[data-reveal]');
  if (!cards.length) return;

  /* ---------------------------------------------------------
     Reduced motion: reveal instantly, no animation
     --------------------------------------------------------- */
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (reduceMotion) {
    cards.forEach((card) => card.classList.add('is-revealed'));
    return;
  }

  /* ---------------------------------------------------------
     IntersectionObserver: reveal on viewport entry with stagger
     --------------------------------------------------------- */
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (!visible.length) return;

      // Sort by DOM order so stagger follows reading flow
      visible.sort((a, b) =>
        a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING
          ? -1
          : 1
      );

      visible.forEach((entry, index) => {
        const card = entry.target;
        const delay = index * 120; // 120ms stagger per visible card

        setTimeout(() => {
          card.classList.add('is-revealed');
        }, delay);

        observer.unobserve(card);
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  cards.forEach((card) => observer.observe(card));
}