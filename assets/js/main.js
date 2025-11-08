import { initLanguageToggle, syncLanguageToggleLabel } from './i18n.js';
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
  const toggleButton = document.querySelector('.lang-toggle');
  syncLanguageToggleLabel(toggleButton);
  initLanguageToggle(toggleButton);
}

function initYear() {
  const yearSpan = document.querySelector('[data-current-year]');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

function init() {
  initHeaderCompression();
  initBackToTop();
  initParallax();
  initLanguage();
  initYear();
  setupEmailProtection();
  setupCopyHandlers();
}

document.addEventListener('DOMContentLoaded', init);
