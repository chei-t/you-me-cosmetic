/* ============================================================
   CLUSTER — 6-image draggable composition
   Ownership:
     .cluster-wrap          → GSAP: drag x/y, scroll rotation
     .cluster-card          → CSS: composition (--x/--y/--s/--z)
     .cluster-card__inner   → GSAP: entrance, idle float
     img                    → CSS: size, radius
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
     1. Entrance — inner only, stagger from center
     --------------------------------------------------------- */
  gsap.fromTo(
    inners,
    {
      opacity: 0,
      y: 35,
      scale: 0.94
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
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
    }
  );

  /* ---------------------------------------------------------
     2. Idle float — inner only
     --------------------------------------------------------- */
  inners.forEach((inner, i) => {
    gsap.to(inner, {
      y: 6 + i * 2,
      duration: 2.6 + i * 0.25,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.5 + i * 0.15
    });
  });

  /* ---------------------------------------------------------
     3. Scroll rotation on wrapper — no scale
     --------------------------------------------------------- */
  if (window.ScrollTrigger) {
    gsap.to(wrap, {
      scrollTrigger: {
        trigger: wrap,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      rotate: 6,
      ease: 'none'
    });
  }

  /* ---------------------------------------------------------
     4. Drag — desktop only
     --------------------------------------------------------- */
  if (window.Draggable && !isMobile) {
    gsap.registerPlugin(window.Draggable);
    if (window.InertiaPlugin) gsap.registerPlugin(window.InertiaPlugin);

    window.Draggable.create(wrap, {
      type: 'x,y',
      inertia: !!window.InertiaPlugin,
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