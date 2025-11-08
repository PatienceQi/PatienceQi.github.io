let toastTimeout;

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2000);
}

export function setupCopyHandlers() {
  const copyButtons = document.querySelectorAll('[data-bibtex]');
  copyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const bibtex = button.getAttribute('data-bibtex');
      if (!bibtex) return;
      try {
        await navigator.clipboard.writeText(bibtex);
        showToast('Copied');
      } catch (err) {
        console.error('Copy failed', err);
        showToast('Copy failed');
      }
    });
  });
}
