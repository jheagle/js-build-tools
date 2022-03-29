const del = require('del')
const gulpConfig = require('../gulp.config.js')

const clean = () => del([gulpConfig.distPath, gulpConfig.browserPath])

module.exports = clean
