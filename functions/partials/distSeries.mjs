import * as gulpConfig from '../../gulp.config.mjs'
import { distFor } from './distFor.mjs'
import { distForSrc } from './distForSrc.mjs'
import { series } from 'gulp'
import { tsFor } from './tsFor.mjs'

/**
 * When using TypeScript, ensure that we process the ts first then run babel (dist)
 * @memberOf module:partials
 * @param {string} [srcPath='src/config/path/dist/for']
 * @param {string} [distFinalPath='dist/config/path']
 * @param {string} [tsSearch='ts/search/config/path']
 * @returns {function(null=): stream.Stream}
 */
export const distSeries = (srcPath = distForSrc(), distFinalPath = gulpConfig.get('dist.to'), tsSearch = gulpConfig.get('typescript.from')) => {
  const typescript = tsFor(tsSearch, distFinalPath)
  const dist = () => distFor(srcPath, distFinalPath)
  return gulpConfig.get('typescript.enabled')
    ? series(typescript, dist)
    : dist
}
