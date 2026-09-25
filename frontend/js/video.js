/* ============================================================
   VIDEO — play/pause toggle for the main video block
   ============================================================ */
export function initVideo() {
  const section = document.querySelector('.main-video');
  const video = section?.querySelector('video');
  const playBtn = section?.querySelector('.main-video__play');

  if (!video || !playBtn) return;

  playBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(() => {});
      section.classList.add('is-playing');
    } else {
      video.pause();
      section.classList.remove('is-playing');
    }
  });

  // Click video itself to toggle
  video.addEventListener('click', () => playBtn.click());

  // Sync state on pause/play events
  video.addEventListener('play', () => section.classList.add('is-playing'));
  video.addEventListener('pause', () => section.classList.remove('is-playing'));
}