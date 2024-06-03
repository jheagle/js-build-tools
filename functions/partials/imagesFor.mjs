import cache from 'gulp-cache'
import { dest, src } from 'gulp'
import * as gulpConfig from '../../gulp.config.mjs'
import imagemin from 'gulp-imagemin'

/**
 * Move and optimize images into the browser directory.
 * @memberOf module:partials
 * @param {string|array} [imageSrc=src/images/pattern]
 * @param {string} [imageDest=dest/image/folder]
 * @return {stream.Stream}
 */
export const imagesFor = (imageSrc = gulpConfig.get('images.from'), imageDest = gulpConfig.get('images.to')) =>
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
