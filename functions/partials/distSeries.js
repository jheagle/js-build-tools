const gulpConfig = require('../../gulp.config')
const distFor = require('./distFor')
const distForSrc = require('./distForSrc')
const { series } = require('gulp')
const tsFor = require('./tsFor')

/**
 * When using TypeScript, ensure that we process the ts first then run babel (dist)
 * @function
 * @memberOf module:partials
 * @param {string} [srcPath='src/config/path/dist/for']
 * @param {string} [distFinalPath='dist/config/path']
 * @param {string} [tsSearch='ts/search/config/path']
 * @returns {Function}
 */
const distSeries = (srcPath = distForSrc(), distFinalPath = gulpConfig.get('distPath'), tsSearch = gulpConfig.get('tsSearch')) =>
  gulpConfig.get('useTsConfig')
    ? series(() => tsFor(tsSearch, distFinalPath), () => distFor(srcPath, distFinalPath))
    : () => distFor(srcPath, distFinalPath)

module.exports = distSeries
