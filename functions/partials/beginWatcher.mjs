import * as gulpConfig from '../../gulp.config.mjs'
import { watch } from 'gulp'

/**
 * Create a chokidar instance which watches and triggers change when the globed files are modified.
 * @memberOf module:partials
 * @returns {FSWatcher}
 */
export const beginWatcher = () => watch(gulpConfig.get('test.watch'))
