/** AOS 초기화 · Swup 이후 갱신 */

export function initAos() {
  if (typeof AOS === 'undefined') return;
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
    disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  });
}

export function refreshAos() {
  if (typeof AOS === 'undefined') return;
  AOS.refresh();
}
