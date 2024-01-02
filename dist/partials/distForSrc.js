"use strict";

const gulpConfig = require('../../gulp.config');

/**
 * Retrieve the correct distFor search path based on TS Config.
 * @function
 * @memberOf module:partials
 * @param {module:gulpConfig~FlagStringSetting} [useTs='config/for/ts']
 * @returns {string}
 */
const distForSrc = function () {
  let useTs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : gulpConfig.get('useTsConfig');
  return useTs ? gulpConfig.get('distSearch') : gulpConfig.get('srcSearch');
};
module.exports = distForSrc;