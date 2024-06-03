import babel from 'gulp-babel'
import { dest, src } from 'gulp'
import { distForSrc } from './distForSrc.mjs'
import * as gulpConfig from '../../gulp.config.mjs'
import through from 'through2'

/**
 * Build the distribution for a given source pattern.
 * @memberOf module:partials
 * @param {string|array} [srcPath='src/config/path/dist/for']
 * @param {string} [destPath='dist/config/path']
 * @returns {stream.Stream}
 */
export const distFor = (srcPath = distForSrc(), destPath = gulpConfig.get('dist.to')) => src(srcPath)
  .pipe(babel())
  .pipe(through.obj(function (file, enc, callback) {
    const regex = /\.mjs(['"]\s*\))/gi
    file.contents = Buffer.from(file.contents.toString().replaceAll(regex, '.js$1'))
    this.push(file)
    callback()
  }))
  .pipe(dest(destPath))
