/* ============================================================
   VIDEO — play/pause toggle for the main video block
   ============================================================ */
export function initVideo() {
  const section = document.querySelector('.main-video');
  const video = section?.querySelector('video');
  const playBtn = section?.querySelector('.main-video__play');

  if (!video || !playBtn) return;

  /* ---------------------------------------------------------
     Single UI sync
     --------------------------------------------------------- */
  const syncUI = () => {
    const isPlaying = !video.paused;

    section.classList.toggle('is-playing', isPlaying);

    playBtn.setAttribute(
      'aria-label',
      isPlaying ? 'Pause video' : 'Play video'
    );

    playBtn.setAttribute(
      'aria-pressed',
      String(isPlaying)
    );
  };

  /* ---------------------------------------------------------
     Play / pause button
     --------------------------------------------------------- */
  playBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(() => {
        syncUI();
      });
    } else {
      video.pause();
    }
  });

  /* ---------------------------------------------------------
     Click video itself to toggle
     --------------------------------------------------------- */
  video.addEventListener('click', () => {
    playBtn.click();
  });

  /* ---------------------------------------------------------
     Video state events
     --------------------------------------------------------- */
  video.addEventListener('play', syncUI);
  video.addEventListener('pause', syncUI);
  video.addEventListener('ended', syncUI);

  /* ---------------------------------------------------------
     Initial state
     --------------------------------------------------------- */
  syncUI();
}