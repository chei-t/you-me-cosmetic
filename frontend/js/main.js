/* ============================================================
   MAIN — Tawa Cosmetics bootstrap
   ============================================================ */
import { initNavbar }   from './navbar.js';
import { initHero }     from './hero.js';
import { initCluster }  from './cluster.js';
import { initCounters } from './counters.js';
import { initCarousel } from './carousel.js';
import { initVideo }    from './video.js';
import { initReveal }   from './reveal.js';

const boot = () => {
  try {
    initNavbar();
    initHero();
    initCluster();
    initCounters();
    initCarousel();
    initVideo();
    initReveal();

    console.log(
      '%cTawa Cosmetics · shine, naturally 🌿',
      'color:#4A5B35;font-weight:600;font-size:14px;'
    );
  } catch (err) {
    console.error('Tawa boot error:', err);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}