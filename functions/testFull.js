const gulpConfig = require('../gulp.config.js');
const { runCLI: jest } = require('jest')

/**
 * Run all tests with jest.
 * @returns {Promise<*>}
 */
const testFull = async () => await jest({}, gulpConfig.testPath)

module.exports = testFull
