import browserify from 'browserify'
import { dest } from 'gulp'
import * as gulpConfig from '../gulp.config.mjs'
import source from 'vinyl-source-stream'

/**
 * Starting at the distribution entry point, bundle all the files into a single file and store them in the specified output directory.
 *
 * Two escape hatches from browser.config.json keep an unwanted dependency (or a dependency's dependency) out of the
 * bundle: 'ignore' replaces it with an empty object (safe when your code never actually calls into it - for example
 * a library's default option value you always override with your own) and 'exclude' leaves it out entirely (your
 * code must not require it, or provide it another way, such as a separate script tag).
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
export const bundle = () => {
  const bundler = browserify(gulpConfig.get('dist.main'))
  const ignore = gulpConfig.get('browser.ignore')
  const exclude = gulpConfig.get('browser.exclude')
  if (ignore && ignore.length) {
    bundler.ignore(ignore)
  }
  if (exclude && exclude.length) {
    bundler.exclude(exclude)
  }
  return bundler
    .bundle()
    .pipe(source(`${gulpConfig.get('browser.name')}.js`))
    .pipe(dest(gulpConfig.get('browser.to')))
}
