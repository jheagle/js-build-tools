const browserify = require('browserify')
const { dest } = require('gulp')
const gulpConfig = require('../gulp.config.js')
const source = require('vinyl-source-stream')

/**
 * Starting at the distribution entry point, bundle all the files into a single file and store them in the specified output directory.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
const bundle = () => browserify(gulpConfig.get('distMain'))
  .bundle()
  .pipe(source(`${gulpConfig.get('browserName')}.js`))
  .pipe(dest(gulpConfig.get('browserPath')))

module.exports = bundle
