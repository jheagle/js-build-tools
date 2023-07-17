const gulpConfig = require('../gulp.config.js')
const { runCLI: jest } = require('jest')

/**
 * Run all tests with jest.
 * @returns {Promise<*>}
 */
const testFull = async () => await jest(gulpConfig.get('testOptions'), gulpConfig.get('testPath'))

module.exports = testFull
