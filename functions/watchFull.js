const bundle = require('./bundle')
const distFor = require('./distFor')
const gulpConfig = require('../gulp.config.js')
const { parallel, series, watch } = require('gulp')
const testQuick = require('./testQuick')

/**
 * Watch for changes and run the distribution for the changed files, then bundle and test the changed files.
 * @returns {*}
 */
const watchFull = () => watch(gulpConfig.get('watchSearch'))
  .on('change', path => {
    const pathRegex = new RegExp(`^${gulpConfig.get('srcPath')}(.*\\/).+\\.js$`, 'i')
    const distForPath = () => distFor(path, path.replace(pathRegex, `${gulpConfig.get('distPath')}$1`))
    return parallel(testQuick, series(distForPath, bundle))()
  })

module.exports = watchFull
