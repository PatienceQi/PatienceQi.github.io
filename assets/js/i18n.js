const LANGUAGE_KEY = 'lang';

function normalisePath(pathname) {
  if (!pathname) return '/';
  const withoutIndex = pathname.replace(/index\.html$/, '');
  if (withoutIndex === '') {
    return '/';
  }
  return withoutIndex.endsWith('/') ? withoutIndex : `${withoutIndex}/`;
}

function inferTargetPath(currentPathname, targetLang) {
  const path = normalisePath(currentPathname);

  if (path === '/' && targetLang === 'en') {
    return '/en/';
  }

  if (path.startsWith('/zh/')) {
    return path.replace(/^\/zh\//, '/en/');
  }

  if (path.startsWith('/en/')) {
    return path.replace(/^\/en\//, '/zh/');
  }

  if (targetLang === 'zh') {
    return path === '/' ? '/zh/' : `/zh${path}`;
  }

  return path.startsWith('/') ? `/en${path}` : `/en/${path}`;
}

function detectCurrentLanguage(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  if (!segments.length) {
    return 'zh';
  }
  if (segments[0] === 'zh' || segments[0] === 'en') {
    return segments[0];
  }
  return 'zh';
}

export function initLanguageToggle(toggleButton) {
  if (!toggleButton) return;

  toggleButton.addEventListener('click', () => {
    const currentLang = detectCurrentLanguage(window.location.pathname);
    const nextLang = currentLang === 'zh' ? 'en' : 'zh';
    try {
      localStorage.setItem(LANGUAGE_KEY, nextLang);
    } catch (error) {
      // Ignore storage errors.
    }
    const target = inferTargetPath(window.location.pathname, nextLang);
    window.location.href = target;
  });
}

export function syncLanguageToggleLabel(toggleButton) {
  if (!toggleButton) return;
  const lang = detectCurrentLanguage(window.location.pathname);
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (!stored || stored !== lang) {
      localStorage.setItem(LANGUAGE_KEY, lang);
    }
  } catch (error) {
    // localStorage might be unavailable; fail silently.
  }
  const next = lang === 'zh' ? 'EN' : 'ZH';
  toggleButton.textContent = next;
  toggleButton.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
}
