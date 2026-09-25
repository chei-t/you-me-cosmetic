/* ============================================================
   CAROUSEL — Best Sellers horizontal scroll
   ============================================================ */
export function initCarousel() {
  const track = document.querySelector('.carousel__track');
  const prevBtn = document.querySelector('.carousel__btn[data-dir="prev"]');
  const nextBtn = document.querySelector('.carousel__btn[data-dir="next"]');

  if (!track) return;

  const scrollByItem = (dir) => {
    const item = track.querySelector('.carousel__item');
    if (!item) return;
    const gap = 18;
    const step = item.offsetWidth + gap;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  if (prevBtn) prevBtn.addEventListener('click', () => scrollByItem(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollByItem(1));

  /* -------- Keyboard support -------- */
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') scrollByItem(-1);
    if (e.key === 'ArrowRight') scrollByItem(1);
  });
}