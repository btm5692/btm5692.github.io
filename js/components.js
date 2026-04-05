/**
 * header / footer / nav 조각을 fetch 후 주입합니다.
 * nav.html 은 <!-- @desktop --> / <!-- @mobile --> 구간으로 나뉩니다.
 */

export function splitNavMarkup(navHtml) {
  const desktopMatch = navHtml.match(/<!--\s*@desktop\s*-->([\s\S]*?)<!--\s*@mobile\s*-->/);
  const mobileMatch = navHtml.match(/<!--\s*@mobile\s*-->([\s\S]*)/);
  return {
    desktop: desktopMatch ? desktopMatch[1].trim() : '',
    mobile: mobileMatch ? mobileMatch[1].trim() : '',
  };
}

export async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.text();
}

export async function injectLayout({ componentsBase }) {
  const headerPath = `${componentsBase}header.html`;
  const navPath = `${componentsBase}nav.html`;
  const footerPath = `${componentsBase}footer.html`;

  const [headerHtml, navHtml, footerHtml] = await Promise.all([
    fetchText(headerPath),
    fetchText(navPath),
    fetchText(footerPath),
  ]);

  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');
  if (!headerEl || !footerEl) return;

  headerEl.innerHTML = headerHtml;
  footerEl.innerHTML = footerHtml;

  const { desktop, mobile } = splitNavMarkup(navHtml);
  const desktopSlot = document.getElementById('nav-desktop-slot');
  const mobileSlot = document.getElementById('nav-mobile-slot');
  if (desktopSlot) desktopSlot.innerHTML = desktop;
  if (mobileSlot) mobileSlot.innerHTML = mobile;
}
