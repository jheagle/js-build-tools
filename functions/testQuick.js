const gulpConfig = require('../gulp.config.js')
const { runCLI: jest } = require('jest')

const testQuick = async () => await jest({ onlyChanged: true }, gulpConfig.testPath)

module.exports = testQuick
