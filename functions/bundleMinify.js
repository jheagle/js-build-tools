const { dest, src } = require('gulp')
const gulpConfig = require('../gulp.config.js')
const { default: uglify } = require('gulp-uglify-es')
const rename = require('gulp-rename')

const bundleMinify = () => src(`${gulpConfig.browserPath}/${gulpConfig.browserName}.js`)
  .pipe(uglify())
  .pipe(rename({ extname: '.min.js' }))
  .pipe(dest(gulpConfig.browserPath))

module.exports = bundleMinify
