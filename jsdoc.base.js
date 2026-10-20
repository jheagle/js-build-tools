const path = require('path')
const gulpConfig = require('./gulp.config.js')

module.exports = {
  plugins: ['plugins/markdown', path.join(__dirname, 'jsdoc.esmExports.js')],
  source: {
    include: [gulpConfig.get('dist.to')],
    // .mjs / .cjs too, so ES module source can be documented as it is, not only its compiled CommonJS
    includePattern: '.+\\.[cm]?js(doc|x)?$',
    // Files starting with _, tests, and minified copies (which only repeat what their unminified file documents)
    excludePattern: '((^|\\/|\\\\)_|.+\\.test\\..*|.+\\.min\\.[cm]?js$)'
  },
}
