const del = require('del')
const gulpConfig = require('../gulp.config.js')

module.exports = () => del([gulpConfig.distPath, gulpConfig.browserPath])
