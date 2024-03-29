const gulpConfig = require('../../gulp.config.js')
const { watch } = require('gulp')

/**
 * Create a chokidar instance which watches and triggers change when the globed files are modified.
 * @memberOf module:partials
 * @returns {FSWatcher}
 */
const beginWatcher = () => watch(gulpConfig.get('test.watch'))

module.exports = beginWatcher
