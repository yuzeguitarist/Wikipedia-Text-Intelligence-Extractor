(function() {
  'use strict';

  if (window.__WTI_EXTENSION_INITIALISED__) {
    return;
  }
  window.__WTI_EXTENSION_INITIALISED__ = true;

  const extractor = new WikiTextExtractor(document);

  const renderPanel = text => {
    if (!text) {
      return;
    }
    if (document.querySelector('.wti-panel')) {
      return;
    }
    const panel = new ExtractorPanel(text);
    panel.mount();
  };

  const handleExtraction = () => {
    const text = extractor.extract();
    renderPanel(text);
  };

  const scheduleExtraction = () => {
    const observer = new MutationObserver(() => {
      const text = extractor.extract();
      if (text) {
        observer.disconnect();
        renderPanel(text);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    handleExtraction();
  };

  const redirectIfMobile = () => {
    if (location.hostname.includes('.m.wikipedia.org')) {
      const desktopURL = location.href.replace('.m.wikipedia.org', '.wikipedia.org');
      location.replace(desktopURL);
      return true;
    }
    return false;
  };

  if (redirectIfMobile()) {
    return;
  }

  if (document.readyState === 'complete') {
    handleExtraction();
  } else {
    window.addEventListener('load', handleExtraction, { once: true });
    scheduleExtraction();
  }
})();
