import * as gulpConfig from '../gulp.config.mjs'
import { dest, src } from 'gulp'
import { neostandardLint } from './partials/neostandardLint.mjs'

/**
 * Applies neostandard linting (js-build-tools' chosen style) to the real, hand-written source - not the compiled
 * dist/browser output, which is generated and so was never going to pass a hand-authored-code style check (every
 * compiler/bundler emits its own boilerplate - import aliasing, interop headers - that only looks like a style
 * violation). Includes test files: there is no reason to hold tests to a lower style bar than the rest of the
 * source. When typescript.enabled, the real TypeScript source is linted too, with type-aware rules.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
export const sourceLint = () => {
  const srcPath = gulpConfig.get('srcPath')
  const ts = gulpConfig.get('typescript.enabled')
  const patterns = [`${srcPath}/**/*.js`]
  if (ts) {
    patterns.push(`${srcPath}/**/*.ts`)
  }
  return src(patterns)
    .pipe(neostandardLint({ fix: true, ts, rules: gulpConfig.get('lint.rules') }))
    .pipe(dest(srcPath))
}
