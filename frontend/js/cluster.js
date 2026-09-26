/* ============================================================
   CLUSTER — 6-image draggable composition
   Ownership:
     .cluster-wrap          → GSAP: drag x/y, scroll rotation
     .cluster-card          → CSS: composition (--x/--y/--s/--z)
     .cluster-card__inner   → GSAP: entrance, idle float
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
    gsap.set(inners, { opacity: 1, y: 0, scale: 1, x: 0, rotation: 0 });
    return;
  }

  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  /* ---------------------------------------------------------
     1. Initial hidden state
     --------------------------------------------------------- */
  gsap.set(inners, {
    y: 35,
    scale: 0.94,
    opacity: 0
  });

  /* ---------------------------------------------------------
     2. Entrance — stagger from center
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
     3. Idle float — 3 axes (x + y + rotation)
     --------------------------------------------------------- */
  inners.forEach((inner, i) => {
    // Horizontal drift
    gsap.to(inner, {
      x: 8 + i * 3,
      duration: 3.2 + i * 0.3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.5 + i * 0.15
    });
    // Vertical drift
    gsap.to(inner, {
      y: 10 + i * 4,
      duration: 3.6 + i * 0.35,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.8 + i * 0.2
    });
    // Subtle rotation
    gsap.to(inner, {
      rotation: (i % 2 === 0 ? 1 : -1) * 2,
      duration: 4.5 + i * 0.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 2 + i * 0.25
    });
  });

  /* ---------------------------------------------------------
     4. Scroll rotation on wrapper — -4° → +4°
     --------------------------------------------------------- */
  if (window.ScrollTrigger) {
    gsap.fromTo(
      wrap,
      { rotate: -4 },
      {
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        rotate: 4,
        ease: 'none'
      }
    );
  }

  /* ---------------------------------------------------------
     5. Drag — desktop only
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