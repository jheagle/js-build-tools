"use strict";

const cache = require('gulp-cache');
const {
  dest,
  src
} = require('gulp');
const gulpConfig = require('../../gulp.config.js');
let imagemin = content => content;
try {
  imagemin = require('../../vendor/gulp-imagemin').default;
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
const imagesFor = function () {
  let imageSrc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : gulpConfig.get('imageSearch');
  let imageDest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gulpConfig.get('imageDest');
  return src(imageSrc).pipe(
  // Caching images that ran through imagemin
  cache(imagemin({
    interlaced: true,
    silent: true,
    verbose: false
  }))).pipe(dest(imageDest));
};
module.exports = imagesFor;