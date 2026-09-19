(() => {
  'use strict';

  const installButton = document.getElementById('installAppButton');
  const installPanel = document.getElementById('installHelp');
  const closeInstallHelp = document.getElementById('closeInstallHelp');
  const iosSteps = document.getElementById('iosInstallSteps');
  const genericSteps = document.getElementById('genericInstallSteps');

  let deferredPrompt = null;

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const isIOS = () =>
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  function hideInstallButton() {
    if (installButton) installButton.hidden = true;
  }

  function showInstallButton(label = 'ติดตั้งแอป') {
    if (!installButton || isStandalone()) return;
    installButton.hidden = false;
    const text = installButton.querySelector('span');
    if (text) text.textContent = label;
  }

  function showInstallHelp(mode = 'generic') {
    if (!installPanel) return;
    installPanel.hidden = false;
    if (iosSteps) iosSteps.hidden = mode !== 'ios';
    if (genericSteps) genericSteps.hidden = mode === 'ios';
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    showInstallButton('ติดตั้งแอป');
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hideInstallButton();
    if (installPanel) installPanel.hidden = true;
  });

  if (installButton) {
    installButton.addEventListener('click', async () => {
      if (isStandalone()) {
        hideInstallButton();
        return;
      }

      if (deferredPrompt) {
        deferredPrompt.prompt();
        try {
          await deferredPrompt.userChoice;
        } finally {
          deferredPrompt = null;
        }
        return;
      }

      showInstallHelp(isIOS() ? 'ios' : 'generic');
    });
  }

  if (closeInstallHelp) {
    closeInstallHelp.addEventListener('click', () => {
      if (installPanel) installPanel.hidden = true;
    });
  }

  if (installPanel) {
    installPanel.addEventListener('click', event => {
      if (event.target === installPanel) installPanel.hidden = true;
    });
  }

  // iPhone/iPad do not use beforeinstallprompt; show a help button instead.
  if (!isStandalone() && isIOS()) {
    showInstallButton('เพิ่มไปหน้าจอโฮม');
  }

  if (isStandalone()) hideInstallButton();
})();
