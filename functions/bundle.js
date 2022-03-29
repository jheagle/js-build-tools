const browserify = require('browserify')
const { dest } = require('gulp')
const gulpConfig = require('../gulp.config.js')
const source = require('vinyl-source-stream')

module.exports = () => browserify(gulpConfig.distMain)
  .bundle()
  .pipe(source(`${gulpConfig.browserName}.js`))
  .pipe(dest(gulpConfig.browserPath))
