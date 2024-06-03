import { copyFor } from './partials/copyFor.mjs'
import * as gulpConfig from '../gulp.config.mjs'

/**
 * Move the font files into the browser directory.
 * @memberOf module:js-build-tools
 * @return {stream.Stream}
 */
export const copyFonts = () => copyFor(gulpConfig.get('fonts.from'), gulpConfig.get('fonts.to'))
