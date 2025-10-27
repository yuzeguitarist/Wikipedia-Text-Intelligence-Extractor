(function() {
  'use strict';

  class WikiTextExtractor {
    constructor(doc = document) {
      this.document = doc;
    }

    extract() {
      if (this.isMainPage()) {
        return null;
      }

      const sourceContent = this.document.getElementById('mw-content-text');
      if (!sourceContent) {
        return null;
      }

      const workingCopy = sourceContent.cloneNode(true);
      this.removeUnwantedNodes(workingCopy);
      this.pruneNoiseSections(workingCopy);
      this.unwrapLinks(workingCopy);

      return this.composeText(workingCopy);
    }

    isMainPage() {
      const url = this.document.location.href;
      const mainPageFragments = [
        '/wiki/Main_Page',
        '/wiki/Wikipedia:%E9%A6%96%E9%A1%B5',
        '/wiki/Wikipedia:首页',
        '/wiki/Wikipedia:首頁',
        '/wiki/Wikipedia:メインページ',
        '/wiki/Wikipedia:대문',
        '/wiki/Wikipédia:Accueil_principal',
        'Special:MainPage',
        'Special:首页'
      ];

      return mainPageFragments.some(fragment => url.includes(fragment));
    }

    removeUnwantedNodes(root) {
      WIKI_REMOVABLE_SELECTORS.forEach(selector => {
        root.querySelectorAll(selector).forEach(node => node.remove());
      });
    }

    pruneNoiseSections(root) {
      const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        const plainText = heading.textContent
          .replace(/\[[^\]]*\]/g, '')
          .replace(/[：:]/g, '')
          .trim()
          .toLowerCase();
        if (SECTION_TITLES_TO_REMOVE.has(plainText)) {
          let cursor = heading.nextElementSibling;
          heading.remove();
          while (cursor && !/^H[1-6]$/.test(cursor.tagName)) {
            const next = cursor.nextElementSibling;
            cursor.remove();
            cursor = next;
          }
        }
      });
    }

    unwrapLinks(root) {
      root.querySelectorAll('a').forEach(anchor => {
        const parent = anchor.parentNode;
        while (anchor.firstChild) {
          parent.insertBefore(anchor.firstChild, anchor);
        }
        parent.removeChild(anchor);
      });
    }

    composeText(root) {
      const fragments = [];

      const processElement = element => {
        if (!element) {
          return;
        }

        if (element.classList && element.classList.contains('mw-heading')) {
          const headline = element.querySelector('.mw-headline');
          const headingText = headline ? headline.textContent : element.textContent;
          const cleanedHeading = this.cleanLine(headingText);
          if (cleanedHeading) {
            fragments.push(cleanedHeading);
            fragments.push('');
          }
          return;
        }

        if (element.tagName === 'UL' || element.tagName === 'OL') {
          element.querySelectorAll(':scope > li').forEach(li => {
            const line = this.cleanLine(li.textContent);
            if (line) {
              fragments.push(`• ${line}`);
            }
          });
          fragments.push('');
          return;
        }

        if (element.tagName === 'DL') {
          element.querySelectorAll(':scope > dt, :scope > dd').forEach(node => {
            const prefix = node.tagName === 'DT' ? '' : '  ';
            const line = this.cleanLine(node.textContent);
            if (line) {
              fragments.push(`${prefix}${line}`);
            }
          });
          fragments.push('');
          return;
        }

        if (BLOCK_LEVEL_TAGS.has(element.tagName)) {
          const cleaned = this.cleanParagraph(element.textContent);
          if (cleaned) {
            fragments.push(cleaned);
            fragments.push('');
          }
          return;
        }

        let child = element.firstElementChild;
        while (child) {
          processElement(child);
          child = child.nextElementSibling;
        }
      };

      let node = root.firstElementChild;
      while (node) {
        processElement(node);
        node = node.nextElementSibling;
      }

      const merged = fragments
        .map(fragment => fragment.replace(/[ \t]+$/gm, ''))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      return this.removeLineNoise(merged);
    }

    cleanParagraph(text) {
      if (!text) {
        return '';
      }

      const normalised = text
        .replace(/\u00a0/g, ' ')
        .replace(/\r/g, '')
        .split('\n')
        .map(line => this.cleanLine(line))
        .filter(Boolean)
        .join('\n');

      return normalised;
    }

    cleanLine(line) {
      if (!line) {
        return '';
      }

      const cleaned = line
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\[\d+\]/g, '')
        .replace(/\(\s*注释\s*\d+\s*\)/g, '')
        .trim();

      if (!cleaned) {
        return '';
      }

      if (NOISE_LINE_PATTERNS.some(pattern => pattern.test(cleaned))) {
        return '';
      }

      return cleaned;
    }

    removeLineNoise(text) {
      return text
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/([\u4e00-\u9fa5])([ \t]+)([\u4e00-\u9fa5])/g, '$1$3')
        .replace(/([\u4e00-\u9fa5])([ \t]+)([A-Za-z])/g, '$1 $3')
        .replace(/([A-Za-z])([ \t]+)([\u4e00-\u9fa5])/g, '$1 $3')
        .trim();
    }
  }

  window.WikiTextExtractor = WikiTextExtractor;
})();
