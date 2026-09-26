/* ============================================================
   NAVBAR
   Matches: css/navbar.css (position: fixed)
   Scope:
     - mobile menu toggle (a11y state)
     - close on link / outside / Escape / resize
     - scroll compaction (.is-scrolled)
     - GSAP entrance (page load)
   ============================================================ */
export function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const toggle = navbar.querySelector('.navbar__toggle');
  const menu   = navbar.querySelector('.navbar__menu');

  /* ---------------------------------------------------------
     1. A11y wiring (defensive)
     --------------------------------------------------------- */
  if (toggle && menu) {
    if (!toggle.hasAttribute('aria-expanded')) {
      toggle.setAttribute('aria-expanded', 'false');
    }
    if (!toggle.hasAttribute('aria-label')) {
      toggle.setAttribute('aria-label', 'Open menu');
    }
    if (!toggle.hasAttribute('aria-controls') && menu.id) {
      toggle.setAttribute('aria-controls', menu.id);
    }
  }

  /* ---------------------------------------------------------
     2. Menu helpers
     --------------------------------------------------------- */
  const closeMenu = () => {
    if (!toggle || !menu) return;
    toggle.classList.remove('is-active');
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  };

  const openMenu = () => {
    if (!toggle || !menu) return;
    toggle.classList.add('is-active');
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  };

  /* ---------------------------------------------------------
     3. Toggle + close events
     --------------------------------------------------------- */
  if (toggle && menu) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (menu.classList.contains('is-open')) closeMenu();
      else openMenu();
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && menu.classList.contains('is-open')) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
      }
    });

    const desktopMQ = window.matchMedia('(min-width: 810px)');
    desktopMQ.addEventListener('change', (e) => {
      if (e.matches) closeMenu();
    });
  }

  /* ---------------------------------------------------------
     4. Scroll compaction
     --------------------------------------------------------- */
  const SCROLL_THRESHOLD = 50;

  const onScroll = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------
   5. GSAP entrance
   --------------------------------------------------------- */
const reduceMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (window.gsap && !reduceMotion) {
  gsap.from(navbar, {
    y: -20,
    opacity: 0,
    duration: 0.7,
    ease: 'power3.out',
    clearProps: 'transform'
  });
} else if (window.gsap && reduceMotion) {
  gsap.set(navbar, { opacity: 1, y: 0 });
}
}