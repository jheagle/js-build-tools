const gulpConfig = require('../gulp.config.js')
const { series, watch } = require('gulp')
const testQuick = require('./testQuick')

/**
 * Watch for changes and run the tests.
 * @returns {*}
 */
const watchTest = () => watch(gulpConfig.get('watchSearch'), { ignoreInitial: false }, series(testQuick))

module.exports = watchTest
