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

  emailStacks.forEach((emailStack) => {
    const secondary = emailStack.querySelector('.email-secondary');
    if (!secondary) return;

    const prefersMobileLayout = window.matchMedia('(max-width: 640px)');

    const setExpandedState = (expanded) => {
      if (expanded) {
        emailStack.classList.add('active');
        emailStack.setAttribute('aria-expanded', 'true');
        secondary.removeAttribute('aria-hidden');
      } else {
        emailStack.classList.remove('active');
        emailStack.setAttribute('aria-expanded', 'false');
        secondary.setAttribute('aria-hidden', 'true');
      }
    };

    const syncToViewport = () => {
      setExpandedState(prefersMobileLayout.matches);
    };

    syncToViewport();

    const handleMediaChange = (event) => {
      setExpandedState(event.matches);
    };

    if (typeof prefersMobileLayout.addEventListener === 'function') {
      prefersMobileLayout.addEventListener('change', handleMediaChange);
    } else if (typeof prefersMobileLayout.addListener === 'function') {
      prefersMobileLayout.addListener(handleMediaChange);
    }

    const revealSecondary = () => {
      if (prefersMobileLayout.matches) return;
      setExpandedState(true);
    };

    const hideSecondary = () => {
      if (prefersMobileLayout.matches) return;
      setExpandedState(false);
    };

    emailStack.addEventListener('mouseenter', revealSecondary);
    emailStack.addEventListener('focusin', revealSecondary);
    emailStack.addEventListener('click', revealSecondary);
    emailStack.addEventListener('mouseleave', hideSecondary);
    emailStack.addEventListener('focusout', (event) => {
      if (prefersMobileLayout.matches) return;
      if (event.relatedTarget && emailStack.contains(event.relatedTarget)) return;
      hideSecondary();
    });
  });
}
