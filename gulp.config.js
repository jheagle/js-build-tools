// gulp.config.mjs is the single source of truth. This CommonJS entry re-exports it, so CommonJS consumers
// (dist/*.js, jsdoc.base.js, require('js-build-tools/gulp.config')) read exactly the same configuration.
// Relies on require(esm), which Node supports natively from 22.12 (package.json's engines sets the actual floor).
module.exports = require('./gulp.config.mjs')
