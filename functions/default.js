const { series } = require('gulp')
const dist = require('./dist')
const bundle = require('./bundle')

module.exports = series(dist, bundle)
