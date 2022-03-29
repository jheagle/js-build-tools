const bundle = require('./bundle')
const distFor = require('./distFor')
const gulpConfig = require('../gulp.config.js')
const { parallel, series, watch } = require('gulp')
const testQuick = require('./testQuick')

module.exports = () => watch(gulpConfig.srcSearch)
  .on('change', path => {
    const pathRegex = new RegExp(`^${gulpConfig.srcPath}(.*\\/).+\\.js$`, 'i')
    const distForPath = () => distFor(path, path.replace(pathRegex, `${gulpConfig.distPath}$1`))
    return parallel(testQuick, series(distForPath, bundle))()
  })