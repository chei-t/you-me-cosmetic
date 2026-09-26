/* ============================================================
   CAROUSEL — Best Sellers horizontal scroll
   Features:
     - native smooth scroll
     - prev/next buttons
     - keyboard arrows
     - pagination dots synced to scroll position
     - click a dot → scrolls to that item
   ============================================================ */
export function initCarousel() {
  const track = document.querySelector('.carousel__track');
  if (!track) return;

  const prevBtn = document.querySelector('.carousel__btn[data-dir="prev"]');
  const nextBtn = document.querySelector('.carousel__btn[data-dir="next"]');
  const dots = document.querySelectorAll('.carousel__dot');
  const items = track.querySelectorAll('.carousel__item');

  /* ---------------------------------------------------------
     Scroll by one item width + gap
     --------------------------------------------------------- */
  const scrollByItem = (dir) => {
    const item = track.querySelector('.carousel__item');
    if (!item) return;

    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;
    const step = item.offsetWidth + gap;

    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  /* ---------------------------------------------------------
     Buttons
     --------------------------------------------------------- */
  if (prevBtn) prevBtn.addEventListener('click', () => scrollByItem(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollByItem(1));

  /* ---------------------------------------------------------
     Keyboard support
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

  /* ---------------------------------------------------------
     Dots — click to scroll to item
     --------------------------------------------------------- */
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index, 10);
      const item = items[index];
      if (!item) return;

      track.scrollTo({
        left: item.offsetLeft - track.offsetLeft,
        behavior: 'smooth'
      });
    });
  });

  /* ---------------------------------------------------------
     Sync active dot with scroll position
     --------------------------------------------------------- */
  const updateActiveDot = () => {
    if (!dots.length || !items.length) return;

    const trackLeft = track.scrollLeft;
    const trackWidth = track.clientWidth;

    let closestIndex = 0;
    let closestDistance = Infinity;

    items.forEach((item, i) => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const viewCenter = trackLeft + trackWidth / 2;
      const distance = Math.abs(itemCenter - viewCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === closestIndex);
    });
  };

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveDot();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateActiveDot();
}