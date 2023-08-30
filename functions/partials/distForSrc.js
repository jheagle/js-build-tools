const gulpConfig = require('../../gulp.config')

/**
 * Retrieve the correct distFor search path based on TS Config.
 * @function
 * @memberOf module:partials
 * @param {module:gulpConfig~FlagStringSetting} [useTs='config/for/ts']
 * @returns {string}
 */
const distForSrc = (useTs = gulpConfig.get('useTsConfig')) => useTs
  ? gulpConfig.get('distSearch')
  : gulpConfig.get('srcSearch')

module.exports = distForSrc
