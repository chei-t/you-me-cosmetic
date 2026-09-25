/* ============================================================
   CLUSTER — 6-image draggable composition
   Transforms come from CSS custom properties on each card.
   Adds:
     - entrance stagger from center
     - subtle idle float
     - drag + inertia
     - scroll-based rotation
   ============================================================ */
export function initCluster() {
  const wrap = document.querySelector('.cluster-wrap');
  if (!wrap || !window.gsap) return;

  const cards = wrap.querySelectorAll('.cluster-card');
  if (!cards.length) return;

  // Scale factor for smaller screens (JS-side, complements CSS scale)
  const isMobile = window.matchMedia('(max-width: 809.98px)').matches;
  const positionScale = isMobile ? 0.42 : 1;

  /* -------- Set initial hidden state -------- */
  cards.forEach((card) => {
    const x = parseFloat(card.style.getPropertyValue('--x')) || 0;
    const y = parseFloat(card.style.getPropertyValue('--y')) || 0;
    const s = parseFloat(card.style.getPropertyValue('--s')) || 1;
    const z = parseFloat(card.style.getPropertyValue('--z')) || 1;

    gsap.set(card, {
      x: x * positionScale,
      y: y * positionScale,
      scale: s,
      zIndex: z,
      opacity: 0
    });
  });

  /* -------- Register ScrollTrigger -------- */
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  /* -------- Entrance from center outward -------- */
  gsap.to(cards, {
    opacity: 1,
    duration: 0.9,
    stagger: { each: 0.1, from: 'center' },
    ease: 'power3.out',
    scrollTrigger: window.ScrollTrigger ? {
      trigger: wrap,
      start: 'top 75%',
      once: true
    } : undefined
  });

  /* -------- Idle float — each card drifts slightly -------- */
  cards.forEach((card, i) => {
    gsap.to(card, {
      y: `+=${6 + i * 2}`,
      duration: 2.6 + i * 0.25,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.15
    });
  });

  /* -------- Scroll rotation -------- */
  if (window.ScrollTrigger) {
    gsap.to(wrap, {
      scrollTrigger: {
        trigger: wrap,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      rotate: 6,
      scale: 1.03,
      ease: 'none'
    });
  }

  /* -------- Drag with inertia -------- */
  if (window.Draggable) {
    window.gsap.registerPlugin(window.Draggable);
    if (window.InertiaPlugin) window.gsap.registerPlugin(window.InertiaPlugin);

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