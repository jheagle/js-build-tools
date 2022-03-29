const gulpConfig = require('../.gulp.config.js')
const { series, watch } = require('gulp')
const testQuick = require('./testQuick')

module.exports = () => watch(gulpConfig.srcSearch, { ignoreInitial: false }, series(testQuick))