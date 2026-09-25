/* ============================================================
   CAROUSEL — Best Sellers horizontal scroll
   Native scrollBy for smooth movement. No GSAP needed.
   ============================================================ */
export function initCarousel() {
  const track = document.querySelector('.carousel__track');
  if (!track) return;

  const prevBtn = document.querySelector(
    '.carousel__btn[data-dir="prev"]'
  );
  const nextBtn = document.querySelector(
    '.carousel__btn[data-dir="next"]'
  );

  /* ---------------------------------------------------------
     Scroll by one item width + CSS gap
     --------------------------------------------------------- */
  const scrollByItem = (dir) => {
    const item = track.querySelector('.carousel__item');
    if (!item) return;

    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;

    const step = item.offsetWidth + gap;

    track.scrollBy({
      left: dir * step,
      behavior: 'smooth'
    });
  };

  /* ---------------------------------------------------------
     Buttons
     --------------------------------------------------------- */
  if (prevBtn) {
    prevBtn.addEventListener('click', () => scrollByItem(-1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => scrollByItem(1));
  }

  /* ---------------------------------------------------------
     Keyboard support
     Track must have tabindex="0" in HTML
     --------------------------------------------------------- */
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollByItem(-1);
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollByItem(1);
    }
  });
}