import browserify from 'browserify'
import { dest } from 'gulp'
import mergeStream from 'merge-stream'
import * as gulpConfig from '../gulp.config.mjs'
import source from 'vinyl-source-stream'
import { getBundleConfigs } from './utilities/getBundleConfigs.mjs'

/**
 * Starting at each bundle's own entry point (dist.main for the primary bundle, or its own
 * override from browser.bundles), bundle all the reachable files into a single file per bundle and
 * store them in the specified output directory. A project with no browser.bundles entries gets
 * exactly the one bundle it always did; each additional entry produces its own separate bundle
 * (for example, a render-only variant built from a different entry point than the full bundle).
 *
 * A bundle's name does double duty: it names the output file (name.js) and, via browserify's
 * `standalone` option, is also the name its exports are exposed under - as a global when loaded
 * with a bare <script> tag, or as the module when required via CommonJS/AMD. Without this, a
 * bundle built from a real entry point (one that actually exports something) builds successfully
 * but exposes nothing a consumer can reach.
 *
 * Two escape hatches from browser.config.json keep an unwanted dependency (or a dependency's dependency) out of the
 * bundle: 'ignore' replaces it with an empty object (safe when your code never actually calls into it - for example
 * a library's default option value you always override with your own) and 'exclude' leaves it out entirely (your
 * code must not require it, or provide it another way, such as a separate script tag).
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
export const bundle = () => mergeStream(
  getBundleConfigs().map(({ name, main, ignore, exclude }) => {
    const bundler = browserify(main, { standalone: name })
    if (ignore && ignore.length) {
      bundler.ignore(ignore)
    }
    if (exclude && exclude.length) {
      bundler.exclude(exclude)
    }
    return bundler
      .bundle()
      .pipe(source(`${name}.js`))
  })
  // One shared dest() for every bundle, not one per bundle - vinyl-fs's dest() races against
  // itself (a real "write after end" failure) when two separate dest() streams target the same
  // directory concurrently, which every additional bundle's own dest() call otherwise would.
).pipe(dest(gulpConfig.get('browser.to')))
