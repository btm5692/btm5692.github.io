import { injectLayout } from './components.js';
import { initAos, refreshAos } from './aos.js';
import { initSwipers, destroySwipers } from './swiper.js';
import { initHeroBgSlideshow, destroyHeroBgSlideshow } from './hero-bg.js';

const COMPONENTS_BASE = new URL('../components/', import.meta.url).href;
const HEADER_COMPACT_AFTER = 48;
const MOBILE_MENU_ANIMATION_MS = 380;

function updateHeaderCompact() {
  const nav = document.getElementById('site-navbar');
  if (!nav) return;
  const compact = (window.scrollY || document.documentElement.scrollTop) > HEADER_COMPACT_AFTER;
  nav.classList.toggle('header-compact', compact);
}

function bindHeaderCompactOnScroll() {
  window.addEventListener('scroll', updateHeaderCompact, { passive: true });
  updateHeaderCompact();
}

function closeMobileMenu() {
  const panel = document.getElementById('mobile-menu-panel');
  const toggle = document.getElementById('mobile-menu-toggle');
  const nav = document.getElementById('site-navbar');
  if (!panel || !toggle) return;
  if (panel.classList.contains('hidden') && !panel.classList.contains('is-open')) return;
  panel.classList.remove('is-open');
  panel.classList.add('is-closing');
  document.body.classList.remove('menu-open');
  nav?.classList.remove('menu-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.querySelector('.icon-menu')?.classList.remove('hidden');
  toggle.querySelector('.icon-close')?.classList.add('hidden');

  window.clearTimeout(panel._closeTimer);
  panel._closeTimer = window.setTimeout(() => {
    panel.classList.add('hidden');
    panel.classList.remove('is-closing');
  }, MOBILE_MENU_ANIMATION_MS);
}

function openMobileMenu() {
  const panel = document.getElementById('mobile-menu-panel');
  const toggle = document.getElementById('mobile-menu-toggle');
  const nav = document.getElementById('site-navbar');
  if (!panel || !toggle) return;

  window.clearTimeout(panel._closeTimer);
  panel.classList.remove('hidden', 'is-closing');
  requestAnimationFrame(() => {
    panel.classList.add('is-open');
  });

  document.body.classList.add('menu-open');
  nav?.classList.add('menu-open');
  toggle.setAttribute('aria-expanded', 'true');
  toggle.querySelector('.icon-menu')?.classList.add('hidden');
  toggle.querySelector('.icon-close')?.classList.remove('hidden');
}

function bindMobileNav() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const panel = document.getElementById('mobile-menu-panel');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    const open = !panel.classList.contains('is-open');
    if (open) {
      openMobileMenu();
      return;
    }
    closeMobileMenu();
  });

  panel.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => closeMobileMenu());
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

/** Community 탭 — 위임(페이지 전환 후 중복 바인딩 방지) */
function setCommunityTab(name) {
  const tabNotice = document.getElementById('tab-notice');
  const tabGallery = document.getElementById('tab-gallery');
  const panelNotice = document.getElementById('panel-notice');
  const panelGallery = document.getElementById('panel-gallery');
  if (!tabNotice || !tabGallery || !panelNotice || !panelGallery) return;

  const isNotice = name === 'notice';
  tabNotice.setAttribute('aria-selected', String(isNotice));
  tabGallery.setAttribute('aria-selected', String(!isNotice));
  tabNotice.classList.toggle('text-primary', isNotice);
  tabNotice.classList.toggle('text-muted-foreground', !isNotice);
  tabGallery.classList.toggle('text-primary', !isNotice);
  tabGallery.classList.toggle('text-muted-foreground', isNotice);
  panelNotice.classList.toggle('hidden', !isNotice);
  panelGallery.classList.toggle('hidden', isNotice);

  const indNotice = tabNotice.querySelector('.tab-indicator');
  const indGallery = tabGallery.querySelector('.tab-indicator');
  if (indNotice) indNotice.classList.toggle('hidden', !isNotice);
  if (indGallery) indGallery.classList.toggle('hidden', isNotice);
}

function setRoomsTab(name) {
  const tabRooms = document.getElementById('tab-rooms-info');
  const tabFacilities = document.getElementById('tab-facilities-info');
  const panelRooms = document.getElementById('panel-rooms-info');
  const panelFacilities = document.getElementById('panel-facilities-info');
  if (!tabRooms || !tabFacilities || !panelRooms || !panelFacilities) return;

  const isRooms = name === 'rooms';
  tabRooms.setAttribute('aria-selected', String(isRooms));
  tabFacilities.setAttribute('aria-selected', String(!isRooms));
  tabRooms.classList.toggle('text-primary', isRooms);
  tabRooms.classList.toggle('text-muted-foreground', !isRooms);
  tabFacilities.classList.toggle('text-primary', !isRooms);
  tabFacilities.classList.toggle('text-muted-foreground', isRooms);
  panelRooms.classList.toggle('hidden', !isRooms);
  panelFacilities.classList.toggle('hidden', isRooms);

  const indRooms = tabRooms.querySelector('.tab-indicator');
  const indFacilities = tabFacilities.querySelector('.tab-indicator');
  if (indRooms) indRooms.classList.toggle('hidden', !isRooms);
  if (indFacilities) indFacilities.classList.toggle('hidden', isRooms);
}

let delegatedInited = false;

function bindDelegatedOnce() {
  if (delegatedInited) return;
  delegatedInited = true;

  document.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('[data-community-tab]');
    if (tabBtn) {
      e.preventDefault();
      setCommunityTab(tabBtn.getAttribute('data-community-tab') || 'notice');
    }

    const roomsTabBtn = e.target.closest('[data-rooms-tab]');
    if (roomsTabBtn) {
      e.preventDefault();
      setRoomsTab(roomsTabBtn.getAttribute('data-rooms-tab') || 'rooms');
    }
  });

  document.addEventListener('submit', (e) => {
    if (e.target instanceof HTMLFormElement && e.target.id === 'newsletter-form') {
      e.preventDefault();
    }
  });
}

function initPage() {
  destroyHeroBgSlideshow();
  destroySwipers();
  initSwipers();
  refreshAos();
  updateHeaderCompact();
  initHeroBgSlideshow();
}

let swup;

function initSwup() {
  if (typeof Swup === 'undefined') return null;
  const instance = new Swup({
    containers: ['#swup'],
    animateHistoryBrowsing: true,
    linkSelector:
      'a[href]:not([data-no-swup]):not([href^="#"]):not([target="_blank"]):not([href^="mailto:"]):not([download])',
  });

  instance.hooks.on('visit:end', () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    closeMobileMenu();
    initPage();
  });

  instance.hooks.on('page:view', (_visit, { title }) => {
    if (title) document.title = title;
  });

  return instance;
}

function ready(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
}

ready(async () => {
  bindDelegatedOnce();

  try {
    await injectLayout({ componentsBase: COMPONENTS_BASE });
  } catch (err) {
    console.error('레이아웃 로드 실패 — 로컬 서버로 열었는지 확인하세요.', err);
  }

  bindMobileNav();
  bindHeaderCompactOnScroll();
  initAos();
  initPage();
  swup = initSwup();

  if (swup) {
    void swup;
  }
});
