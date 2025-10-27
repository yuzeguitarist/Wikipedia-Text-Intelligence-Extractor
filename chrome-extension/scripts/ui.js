(function() {
  'use strict';

  /**
   * ExtractorPanel renders the monochrome control surface that displays the
   * cleaned text and exposes interactions such as copying or collapsing.
   */
  class ExtractorPanel {
    constructor(text) {
      this.text = text;
      this.panel = null;
    }

    /**
     * Creates and attaches the floating panel. The layout follows a strict
     * grid to echo architectural precision and embraces a monochrome palette.
     */
    mount() {
      if (this.panel) {
        return;
      }

      this.panel = document.createElement('section');
      this.panel.className = 'wti-panel';
      this.panel.setAttribute('data-theme', 'monochrome');

      this.panel.innerHTML = `
        <header class="wti-panel__header">
          <div class="wti-panel__title-block">
            <h1 class="wti-panel__title">Wikipedia Text</h1>
            <p class="wti-panel__subtitle">Monochrome · Precision · Clarity</p>
          </div>
          <div class="wti-panel__controls">
            <button class="wti-button" data-action="copy" title="复制文本">COPY</button>
            <button class="wti-button" data-action="collapse" title="收起面板">CLOSE</button>
          </div>
        </header>
        <div class="wti-panel__meta-grid">
          <div class="wti-meta">
            <span class="wti-meta__label">Paragraphs</span>
            <span class="wti-meta__value" data-meta="paragraphs"></span>
          </div>
          <div class="wti-meta">
            <span class="wti-meta__label">Characters</span>
            <span class="wti-meta__value" data-meta="characters"></span>
          </div>
          <div class="wti-meta">
            <span class="wti-meta__label">Words</span>
            <span class="wti-meta__value" data-meta="words"></span>
          </div>
        </div>
        <article class="wti-panel__content" data-role="content"></article>
      `;

      const contentElement = this.panel.querySelector('[data-role="content"]');
      const stats = this.calculateStatistics(this.text);
      contentElement.textContent = this.text;
      this.panel.querySelector('[data-meta="paragraphs"]').textContent = stats.paragraphs;
      this.panel.querySelector('[data-meta="characters"]').textContent = stats.characters;
      this.panel.querySelector('[data-meta="words"]').textContent = stats.words;

      this.panel.addEventListener('click', event => {
        const button = event.target.closest('.wti-button');
        if (!button) {
          return;
        }

        const action = button.getAttribute('data-action');
        if (action === 'copy') {
          this.copyText(button);
        }

        if (action === 'collapse') {
          this.unmount();
        }
      });

      document.body.appendChild(this.panel);
    }

    /**
     * Removes the panel and its listeners from the DOM.
     */
    unmount() {
      if (!this.panel) {
        return;
      }

      this.panel.remove();
      this.panel = null;
    }

    /**
     * Copies the cleaned text to the clipboard, providing minimal feedback via
     * temporary label swapping.
     */
    async copyText(button) {
      const originalLabel = button.textContent;
      try {
        await navigator.clipboard.writeText(this.text);
        button.textContent = 'COPIED';
      } catch (error) {
        button.textContent = 'FAILED';
        console.error('Clipboard copy failed:', error);
      } finally {
        setTimeout(() => {
          button.textContent = originalLabel;
        }, 1600);
      }
    }

    /**
     * Calculates basic metrics for the statistics grid.
     */
    calculateStatistics(text) {
      const paragraphs = text ? text.split(/\n{2,}/).filter(Boolean).length : 0;
      const characters = text ? text.replace(/\s/g, '').length : 0;
      const words = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
      return { paragraphs, characters, words };
    }
  }

  window.ExtractorPanel = ExtractorPanel;
})();
