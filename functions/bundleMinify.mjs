import * as gulpConfig from '../gulp.config.mjs'
import { minifyFor } from './partials/minifyFor.mjs'
import { getBundleConfigs } from './utilities/getBundleConfigs.mjs'

/**
 * Creates the minified file for every bundle (the primary bundle, plus any additional ones from
 * browser.bundles). The minify step itself never varies per bundle, so this is one shared
 * src()/dest() pipeline (inside minifyFor) fed every bundle's filename at once, rather than one
 * pipeline per bundle - gulp's src() accepts an array of paths natively.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
export const bundleMinify = () => minifyFor(
  getBundleConfigs().map(({ name }) => `${gulpConfig.get('browser.to')}/${name}.js`),
  gulpConfig.get('browser.to')
)
