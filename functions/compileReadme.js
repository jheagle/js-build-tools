const addToReadme = require('./addToReadme')
const readmeTemplate = require('./readmeTemplate')
const { series } = require('gulp')

module.exports = series(readmeTemplate, addToReadme)
