// gulp.config.mjs is the single source of truth. This CommonJS entry re-exports it, so CommonJS consumers
// (dist/*.js, jsdoc.base.js, require('js-build-tools/gulp.config')) read exactly the same configuration.
// Relies on require(esm), which Node 22.12+ supports natively.
module.exports = require('./gulp.config.mjs')
