const { series } = require('gulp')
const dist = require('./dist')
const bundle = require('./bundle')

const defaultCmd = series(dist, bundle)

module.exports = defaultCmd
