const gulpConfig = require('../gulp.config.js')
const { series, watch } = require('gulp')
const testQuick = require('./testQuick')

const watchTest = () => watch(gulpConfig.srcSearch, { ignoreInitial: false }, series(testQuick))

module.exports = watchTest
