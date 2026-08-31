// App shell and router. Hash routing so the whole app is a static file — no server,
// no build, no configuration.

import { el, clear, icon, refreshVoices } from './ui/dom.js';
import { storage } from './engine/storage.js';
import * as SRS from './engine/srs.js';
import {
  renderHome, renderLearn, renderLesson, renderReview,
  renderPractice, renderProgress, renderReference, renderSettings,
} from './ui/screens.js';

const NAV = [
  { href: '#/', icon: 'home', label: 'Home' },
  { href: '#/learn', icon: 'learn', label: 'Learn' },
  { href: '#/review', icon: 'review', label: 'Review', badge: () => SRS.dueCount() },
  { href: '#/practice', icon: 'practice', label: 'Practice' },
  { href: '#/progress', icon: 'progress', label: 'Progress' },
];
const SECONDARY = [
  { href: '#/reference', icon: 'reference', label: 'Reference' },
  { href: '#/settings', icon: 'settings', label: 'Settings' },
];

const app = document.getElementById('app');
const main = el('main', { class: 'main', id: 'main', tabindex: '-1' });

function applyTheme() {
  const t = storage.state.settings.theme;
  if (t === 'system') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}

function navButtons(items, cls) {
  return items.map(item => {
    const badge = item.badge?.() || 0;
    return el('a', {
      class: cls, href: item.href, 'data-href': item.href,
      'aria-current': location.hash === item.href || (item.href !== '#/' && location.hash.startsWith(item.href)) ? 'page' : null,
    },
      icon(item.icon),
      el('span', { class: 'nav-label' }, item.label),
      badge ? el('span', { class: 'nav-badge' }, String(badge > 99 ? '99+' : badge)) : null);
  });
}

function shell() {
  clear(app);
  const sidebar = el('nav', { class: 'sidebar', 'aria-label': 'Main' },
    el('div', { class: 'brand' }, el('span', { class: 'brand-jp jp' }, '日本語'), el('span', { class: 'brand-sub' }, 'study')),
    el('div', { class: 'nav-group' }, ...navButtons(NAV, 'nav-item')),
    el('div', { class: 'nav-group secondary' }, ...navButtons(SECONDARY, 'nav-item')),
  );
  const topbar = el('header', { class: 'topbar' },
    el('a', { class: 'brand', href: '#/' }, el('span', { class: 'brand-jp jp' }, '日本語')),
    el('div', { class: 'topbar-actions' }, ...navButtons(SECONDARY, 'icon-nav')),
  );
  const bottom = el('nav', { class: 'bottomnav', 'aria-label': 'Main' }, ...navButtons(NAV, 'nav-item'));
  app.append(topbar, sidebar, main, bottom);
}

function nav(hash) {
  if (location.hash === hash) route();
  else location.hash = hash;
}

function route() {
  const hash = location.hash || '#/';
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const head = parts[0] || 'home';
  const param = parts[1];

  shell();
  window.scrollTo(0, 0);

  switch (head) {
    case 'home': renderHome(main, nav); break;
    case 'learn': renderLearn(main, nav); break;
    case 'lesson': renderLesson(main, nav, decodeURIComponent(param || '')); break;
    case 'review': renderReview(main, nav); break;
    case 'practice': renderPractice(main, nav, param); break;
    case 'progress': renderProgress(main); break;
    case 'reference': renderReference(main); break;
    case 'settings': renderSettings(main, nav, applyTheme); break;
    default: renderHome(main, nav);
  }
  main.focus({ preventScroll: true });
}

window.addEventListener('hashchange', route);
if ('speechSynthesis' in window) {
  refreshVoices();
  speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
}
applyTheme();
route();

// Re-apply the theme when the OS preference changes while the app is open.
window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);
