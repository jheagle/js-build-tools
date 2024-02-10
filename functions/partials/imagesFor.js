const cache = require('gulp-cache')
const { dest, src } = require('gulp')
const gulpConfig = require('../../gulp.config.js')

let imagemin = (content) => content
try {
  imagemin = require('../../vendor/gulp-imagemin').default
} catch (e) {
  // It didn't get created yet
}

/**
 * Move and optimize images into the browser directory.
 * @memberOf module:partials
 * @param {string|array} [imageSrc=src/images/pattern]
 * @param {string} [imageDest=dest/image/folder]
 * @return {stream.Stream}
 */
const imagesFor = (imageSrc = gulpConfig.get('images.from'), imageDest = gulpConfig.get('images.to')) =>
  src(imageSrc)
    .pipe(
      // Caching images that ran through imagemin
      cache(
        imagemin({
          interlaced: true,
          silent: true,
          verbose: false,
        })
      )
    )
    .pipe(dest(imageDest))

module.exports = imagesFor
