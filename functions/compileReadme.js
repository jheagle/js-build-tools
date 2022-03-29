const addToReadme = require('./addToReadme')
const readmeTemplate = require('./readmeTemplate')
const { series } = require('gulp')

const compileReadme = series(readmeTemplate, addToReadme)

module.exports = compileReadme
