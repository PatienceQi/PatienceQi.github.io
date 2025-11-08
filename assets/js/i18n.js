const LANGUAGE_KEY = 'lang';

function inferTargetPath(currentPathname, targetLang) {
  const segments = currentPathname.split('/').filter(Boolean);
  const hasLangPrefix = segments[0] === 'zh' || segments[0] === 'en';

  if (!hasLangPrefix) {
    if (targetLang === 'zh') {
      return currentPathname || '/';
    }
    const rest = segments.join('/');
    return `/${targetLang}/${rest}`.replace(/\/+$/, '/');
  }

  segments[0] = targetLang;
  return `/${segments.join('/')}`.replace(/\/+$/, '/');
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

  const stored = localStorage.getItem(LANGUAGE_KEY);
  const currentLang = detectCurrentLanguage(window.location.pathname);
  if (stored && stored !== currentLang) {
    const targetPath = inferTargetPath(window.location.pathname, stored);
    if (targetPath !== window.location.pathname) {
      window.location.href = targetPath;
      return;
    }
  }

  toggleButton.setAttribute('aria-pressed', currentLang === 'zh' ? 'false' : 'true');

  toggleButton.addEventListener('click', () => {
    const nextLang = detectCurrentLanguage(window.location.pathname) === 'zh' ? 'en' : 'zh';
    localStorage.setItem(LANGUAGE_KEY, nextLang);
    const target = inferTargetPath(window.location.pathname, nextLang);
    window.location.href = target;
  });
}

export function syncLanguageToggleLabel(toggleButton) {
  if (!toggleButton) return;
  const lang = detectCurrentLanguage(window.location.pathname);
  const next = lang === 'zh' ? 'EN' : 'ZH';
  toggleButton.textContent = next;
}
