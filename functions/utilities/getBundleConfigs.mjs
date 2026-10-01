import * as gulpConfig from '../../gulp.config.mjs'

/**
 * Build the full list of bundles to produce for this project: the primary bundle (browser.name /
 * dist.main / browser.ignore / browser.exclude, exactly as before browser.bundles existed) plus
 * any additional bundles from browser.bundles - each falling back to the primary's main / ignore /
 * exclude whenever its own isn't given, so a render-only (or any other variant) bundle only has to
 * specify what's actually different about it.
 * @memberOf module:utilities
 * @returns {Array<{name: string, main: string, ignore: Array, exclude: Array}>}
 */
export const getBundleConfigs = () => {
  const primary = {
    name: gulpConfig.get('browser.name'),
    main: gulpConfig.get('dist.main'),
    ignore: gulpConfig.get('browser.ignore'),
    exclude: gulpConfig.get('browser.exclude')
  }
  const additional = gulpConfig.get('browser.bundles') || []
  return [
    primary,
    ...additional.map((bundleConfig) => ({
      name: bundleConfig.name,
      main: bundleConfig.main || primary.main,
      ignore: bundleConfig.ignore || primary.ignore,
      exclude: bundleConfig.exclude || primary.exclude
    }))
  ]
}
