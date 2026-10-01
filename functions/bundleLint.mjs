import { dest, src } from 'gulp'
import * as gulpConfig from '../gulp.config.mjs'
import { standardLint } from './partials/standardLint.mjs'
import { getBundleConfigs } from './utilities/getBundleConfigs.mjs'

/**
 * Applies Standard code style linting to every bundled file (the primary bundle, plus any
 * additional ones from browser.bundles). The lint step itself never varies per bundle, so this is
 * one shared src()/dest() pipeline fed every bundle's filename at once, rather than one pipeline
 * per bundle - gulp's src()/dest() both accept an array of paths natively.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
export const bundleLint = () => src(
  getBundleConfigs().map(({ name }) => `${gulpConfig.get('browser.to')}/${name}.js`)
)
  .pipe(standardLint({ fix: true }))
  .pipe(dest(gulpConfig.get('browser.to')))
