(function() {
  'use strict';

  /**
   * CSS selectors that point to structural or decorative elements that should
   * never appear in the extracted plain text output.
   */
  const WIKI_REMOVABLE_SELECTORS = [
    '.reference',
    '.references',
    '.reflist',
    '.citation',
    '.navbox',
    '.infobox',
    '.mw-editsection',
    '.metadata',
    '.hatnote',
    '.mw-empty-elt',
    '.catlinks',
    '.ambox',
    '.tmbox',
    '.messagebox',
    '.plainlist',
    '.side-box',
    '.sisterproject',
    '.dablink',
    '.mw-jump-link',
    '.mw-authority-control',
    '.portal',
    '.noprint',
    '.nomobile',
    '.metadata-columns',
    '.collapsible',
    '.collapsible-list',
    '.mwe-math-element',
    '.mw-references-wrap',
    '.printfooter',
    '.mw-footer',
    '.vector-sticky-header',
    '.mw-indicators',
    '.shortdescription',
    '.mw-parser-output .toc',
    'table',
    'img',
    'style',
    'link',
    'script',
    'sup'
  ];

  /**
   * Section headings that should be removed entirely along with their content.
   * Entries are normalised to lower-case for case-insensitive comparisons and
   * cover multiple languages commonly found on Wikipedia.
   */
  const SECTION_TITLES_TO_REMOVE = new Set([
    'references',
    'reference',
    '参考资料',
    '參考資料',
    '參考資料與註解',
    '参考文献',
    '參考文獻',
    '註解',
    '注释',
    '注釋',
    '外部链接',
    '外部連結',
    '外部連結與資料',
    '参见',
    '參見',
    '延伸閱讀',
    '延伸阅读',
    '参考',
    '参看',
    '參考',
    '另見',
    '相關條目',
    '相关条目',
    '腳註',
    '脚注',
    'notes',
    'bibliography',
    'further reading',
    'external links',
    'see also'
  ]);

  /**
   * Textual patterns that typically indicate navigation hints or hidden UI
   * residues. Each pattern is evaluated against a cleaned single line.
   */
  const NOISE_LINE_PATTERNS = [
    /^跳转到：/i,
    /^Navigation menu$/i,
    /^This article.*requires additional citations/i,
    /^隐藏\s*$/,
    /^分类：/,
    /^Category:/,
    /^Portal:/,
    /^来自维基百科，/,
    /^From Wikipedia,/,
    /^查看源代码$/,
    /^Read$/,
    /^Edit$/,
    /^新增段落$/
  ];

  /**
   * Block-level elements that should generate a paragraph break in the final
   * output.
   */
  const BLOCK_LEVEL_TAGS = new Set([
    'P', 'DIV', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER', 'ASIDE',
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
    'UL', 'OL', 'LI', 'DL', 'DT', 'DD',
    'PRE', 'BLOCKQUOTE', 'FIGURE', 'TABLE'
  ]);

  window.WIKI_REMOVABLE_SELECTORS = WIKI_REMOVABLE_SELECTORS;
  window.SECTION_TITLES_TO_REMOVE = SECTION_TITLES_TO_REMOVE;
  window.NOISE_LINE_PATTERNS = NOISE_LINE_PATTERNS;
  window.BLOCK_LEVEL_TAGS = BLOCK_LEVEL_TAGS;
})();
