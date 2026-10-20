const path = require('path')
const gulpConfig = require('./gulp.config.js')

module.exports = {
  plugins: ['plugins/markdown', path.join(__dirname, 'jsdoc.esmExports.js')],
  // Give markdown headings ids (the README / docs.index front page), so they can be linked to and a theme's
  // table of contents can follow them
  markdown: { idInHeadings: true },
  source: {
    include: [gulpConfig.get('dist.to')],
    // .mjs / .cjs too, so ES module source can be documented as it is, not only its compiled CommonJS
    includePattern: '.+\\.[cm]?js(doc|x)?$',
    // Files starting with _, tests, and minified copies (which only repeat what their unminified file documents)
    excludePattern: '((^|\\/|\\\\)_|.+\\.test\\..*|.+\\.min\\.[cm]?js$)'
  },
}
