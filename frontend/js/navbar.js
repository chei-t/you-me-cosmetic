/* ============================================================
   NAVBAR — mobile toggle + scroll compaction
   ============================================================ */
export function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar__toggle');
  const menu = document.querySelector('.navbar__menu');

  if (!navbar) return;

  /* -------- Mobile toggle -------- */
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-active');
      menu.classList.toggle('is-open');
    });

    // Close on link click
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.classList.remove('is-active');
        menu.classList.remove('is-open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && menu.classList.contains('is-open')) {
        toggle.classList.remove('is-active');
        menu.classList.remove('is-open');
      }
    });
  }

  /* -------- Scroll compaction -------- */
  let lastScroll = 0;
  const onScroll = () => {
    const y = window.scrollY;
    if (y > 50) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
    lastScroll = y;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}