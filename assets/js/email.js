function isTouchDevice() {
  return window.matchMedia('(hover: none)').matches;
}

export function setupEmailProtection() {
  const emailStack = document.querySelector('.email-stack');
  if (!emailStack) return;

  const secondary = emailStack.querySelector('.email-secondary');
  if (!secondary) return;

  if (isTouchDevice()) {
    emailStack.classList.add('active');
    return;
  }

  const reveal = () => {
    emailStack.classList.add('active');
    emailStack.setAttribute('aria-expanded', 'true');
  };

  emailStack.setAttribute('aria-expanded', 'false');
  emailStack.addEventListener('mouseenter', reveal);
  emailStack.addEventListener('focusin', reveal);
  emailStack.addEventListener('click', reveal);
}
