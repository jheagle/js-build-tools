const gulpConfig = require('../gulp.config.js');
const { runCLI: jest } = require('jest')

const testFull = async () => await jest({}, gulpConfig.testPath)

module.exports = testFull
