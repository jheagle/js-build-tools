const gulpConfig = require('../../gulp.config')

/**
 * Retrieve the correct distFor search path based on TS Config.
 * @memberOf module:partials
 * @param {module:gulpConfig~FlagStringSetting} [useTs='config/for/ts']
 * @returns {string}
 */
const distForSrc = (useTs = gulpConfig.get('typescript.enabled')) => useTs
  ? gulpConfig.get('browser.from')
  : gulpConfig.get('dist.from')

module.exports = distForSrc
