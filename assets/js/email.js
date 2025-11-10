function isTouchDevice() {
  return window.matchMedia('(hover: none)').matches;
}

function hydrateMailtoLinks() {
  const mailtoElements = document.querySelectorAll('[data-email-user][data-email-domain]');
  mailtoElements.forEach((el) => {
    const { emailUser, emailDomain } = el.dataset;
    if (!emailUser || !emailDomain) return;

    const address = `${emailUser}@${emailDomain}`;
    el.setAttribute('data-email-address', address);

    const displayTarget = el.querySelector('[data-email-display]');
    if (displayTarget) {
      displayTarget.textContent = `${emailUser} [at] ${emailDomain}`;
    }

    if (el.tagName.toLowerCase() === 'a') {
      let mailtoApplied = false;
      const ensureMailto = () => {
        if (mailtoApplied) return;
        el.setAttribute('href', `mailto:${address}`);
        mailtoApplied = true;
      };

      el.addEventListener('click', ensureMailto, { capture: true });
      el.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          ensureMailto();
        }
      });
    }
  });
}

export function setupEmailProtection() {
  hydrateMailtoLinks();

  const emailStacks = document.querySelectorAll('.email-stack');
  if (!emailStacks.length) return;

  const touchEnvironment = isTouchDevice();

  emailStacks.forEach((emailStack) => {
    const secondary = emailStack.querySelector('.email-secondary');
    if (!secondary) return;

    if (touchEnvironment) {
      emailStack.classList.add('active');
      emailStack.setAttribute('aria-expanded', 'true');
      secondary.removeAttribute('aria-hidden');
      return;
    }

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      emailStack.classList.add('active');
      emailStack.setAttribute('aria-expanded', 'true');
      secondary.removeAttribute('aria-hidden');
    };

    emailStack.setAttribute('aria-expanded', 'false');
    secondary.setAttribute('aria-hidden', 'true');
    emailStack.addEventListener('mouseenter', reveal);
    emailStack.addEventListener('focusin', reveal);
    emailStack.addEventListener('click', reveal);
  });
}
