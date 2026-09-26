/* ============================================================
   CLUSTER — 6-image draggable composition

   Ownership (strict):
     .cluster-card         → CSS composition (--x/--y/--s/--z)
     .cluster-card__inner  → GSAP: entrance + idle float
     .cluster-wrap         → GSAP: drag x/y (desktop only)

   Scroll rotation removed to avoid conflicts with Draggable.
   ============================================================ */
export function initCluster() {
  const wrap = document.querySelector('.cluster-wrap');
  if (!wrap || !window.gsap) return;

  const inners = wrap.querySelectorAll('.cluster-card__inner');
  if (!inners.length) return;

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const isMobile = window.matchMedia('(max-width: 809.98px)').matches;

  /* ---------------------------------------------------------
     Reduced motion path
     --------------------------------------------------------- */
  if (reduceMotion) {
    gsap.set(inners, { opacity: 1, y: 0, scale: 1 });
    return;
  }

  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  /* ---------------------------------------------------------
     1. Set initial hidden state on INNER only
     CSS owns the outer composition — do not touch it.
     --------------------------------------------------------- */
  gsap.set(inners, {
    y: 35,
    scale: 0.94,
    opacity: 0
  });

  /* ---------------------------------------------------------
     2. Entrance — inner only, stagger from center
     --------------------------------------------------------- */
  gsap.to(inners, {
    y: 0,
    scale: 1,
    opacity: 1,
    duration: 0.9,
    stagger: {
      each: 0.08,
      from: 'center'
    },
    ease: 'power3.out',
    scrollTrigger: window.ScrollTrigger
      ? {
          trigger: wrap,
          start: 'top 75%',
          once: true
        }
      : undefined
  });

  /* ---------------------------------------------------------
     3. Idle float — inner only, after entrance settles
     Uses `from` offset (0 → +N) so it doesn't fight entrance
     --------------------------------------------------------- */
  inners.forEach((inner, i) => {
    gsap.to(inner, {
      y: 6 + i * 1.5,
      duration: 2.8 + i * 0.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.5 + i * 0.15
    });
  });

  /* ---------------------------------------------------------
     4. Drag — desktop only
     No scroll rotation on the wrap — it would fight Draggable
     for the same `transform` property.
     --------------------------------------------------------- */
  if (window.Draggable && !isMobile) {
    gsap.registerPlugin(window.Draggable);

    window.Draggable.create(wrap, {
      type: 'x,y',
      bounds: {
        minX: -140,
        maxX: 140,
        minY: -90,
        maxY: 90
      },
      edgeResistance: 0.65,
      onPress() {
        wrap.classList.add('is-dragging');
      },
      onRelease() {
        wrap.classList.remove('is-dragging');
      }
    });
  }
}