/** 메인 히어로 배경 — 여러 슬라이드 크로스페이드 */

let intervalId = null;

export function destroyHeroBgSlideshow() {
  if (intervalId != null) {
    window.clearInterval(intervalId);
    intervalId = null;
  }
}

export function initHeroBgSlideshow() {
  destroyHeroBgSlideshow();

  const root = document.getElementById('hero-bg-slideshow');
  if (!root) return;

  const layers = root.querySelectorAll('[data-hero-slide]');
  if (layers.length < 2) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    layers.forEach((el, j) => el.classList.toggle('hero-bg-layer--active', j === 0));
    return;
  }

  let i = 0;
  const DURATION_MS = 7000;
  const FADE_MS = 1400;

  root.style.setProperty('--hero-bg-fade-ms', `${FADE_MS}ms`);

  const show = (idx) => {
    layers.forEach((el, j) => {
      el.classList.toggle('hero-bg-layer--active', j === idx);
    });
  };

  show(0);
  i = 0;

  intervalId = window.setInterval(() => {
    i = (i + 1) % layers.length;
    show(i);
  }, DURATION_MS);
}
