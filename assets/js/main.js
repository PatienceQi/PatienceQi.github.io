import { initLanguageToggle, redirectFromRootIfNeeded, syncLanguageToggleLabel } from './i18n.js';
import { setupEmailProtection } from './email.js';
import { setupCopyHandlers } from './copy.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initHeaderCompression() {
  const header = document.querySelector('header.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 120) {
      header.classList.add('compact');
    } else {
      header.classList.remove('compact');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

function initBackToTop() {
  const button = document.querySelector('.back-to-top');
  if (!button) return;

  const toggleVisibility = () => {
    if (window.scrollY > 600) {
      button.classList.add('visible');
    } else {
      button.classList.remove('visible');
    }
  };

  const scrollToTop = () => {
    if (prefersReducedMotion) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  button.addEventListener('click', scrollToTop);
}

function initParallax() {
  const illustration = document.querySelector('.hero-illustration');
  if (!illustration || prefersReducedMotion) return;

  const onScroll = () => {
    const threshold = 260;
    if (window.scrollY < threshold) {
      illustration.classList.add('parallax');
    } else {
      illustration.classList.remove('parallax');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initLanguage() {
  const toggles = document.querySelectorAll('.lang-toggle');
  if (!toggles.length) return;

  toggles.forEach((toggle) => {
    syncLanguageToggleLabel(toggle);
    initLanguageToggle(toggle);
  });
}

function initYear() {
  const yearSpans = document.querySelectorAll('[data-current-year]');
  if (!yearSpans.length) return;

  const year = new Date().getFullYear();
  yearSpans.forEach((span) => {
    span.textContent = year;
  });
}

function initActiveNavigation() {
  const links = document.querySelectorAll('.nav-links a');
  if (!links.length) return;

  const currentPath = (() => {
    const raw = window.location.pathname.replace(/index\.html$/, '');
    if (!raw || raw === '/') {
      return '/';
    }
    return raw.endsWith('/') ? raw : `${raw}/`;
  })();

  links.forEach((link) => {
    const linkPath = new URL(link.getAttribute('href'), window.location.origin)
      .pathname.replace(/index\.html$/, '');
    const normalisedLink = linkPath === '/' ? '/' : (linkPath.endsWith('/') ? linkPath : `${linkPath}/`);

    if (
      normalisedLink === '/'
        ? currentPath === '/'
        : currentPath.startsWith(normalisedLink)
    ) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('is-active');
    } else {
      link.removeAttribute('aria-current');
      link.classList.remove('is-active');
    }
  });
}

function init() {
  initHeaderCompression();
  initBackToTop();
  initParallax();
  initLanguage();
  initYear();
  initActiveNavigation();
  setupEmailProtection();
  setupCopyHandlers();
}

redirectFromRootIfNeeded();
document.addEventListener('DOMContentLoaded', init);
