import browserify from 'browserify'
import { dest } from 'gulp'
import * as gulpConfig from '../gulp.config.mjs'
import source from 'vinyl-source-stream'

/**
 * Starting at the distribution entry point, bundle all the files into a single file and store them in the specified output directory.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
export const bundle = () => browserify(gulpConfig.get('dist.main'))
  .bundle()
  .pipe(source(`${gulpConfig.get('browser.name')}.js`))
  .pipe(dest(gulpConfig.get('browser.to')))
