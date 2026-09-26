/* ============================================================
   SERVICES PIN — auto-sizes the scroll track

   The CSS sets a fallback --track-height, but a hardcoded pixel
   value drifts out of sync the moment card content, row count,
   or gap spacing changes. This measures the two rows + the gap
   between them and sets --track-height to match, so the pin
   releases exactly when the last row clears the viewport —
   no magic numbers to maintain by hand.
   ============================================================ */
export function initServicesPin() {
  const section = document.querySelector('.services-pin');
  const track = section?.querySelector('.services-pin__track');
  if (!section || !track) return;

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const isMobile = window.matchMedia('(max-width: 809.98px)').matches;

  // Both cases already fall back to normal flow in CSS — nothing to size.
  if (reduceMotion || isMobile) return;

  const rows = track.querySelectorAll('.services-pin__row');
  if (rows.length < 2) return;

  const measure = () => {
    const last = rows[rows.length - 1];

    // Distance from top of track to bottom of the last row, plus one
    // viewport height so the last row fully clears the screen before
    // the header un-pins (otherwise it gets cut off mid-reveal).
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    const lastBottom = last.getBoundingClientRect().bottom + window.scrollY;
    const height = (lastBottom - trackTop) + window.innerHeight;

    track.style.setProperty('--track-height', `${Math.round(height)}px`);
  };

  measure();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 150);
  });
}
