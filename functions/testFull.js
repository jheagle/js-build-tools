const gulpConfig = require('../gulp.config.js');
const { runCLI: jest } = require('jest')

module.exports = async () => await jest({}, gulpConfig.testPath);