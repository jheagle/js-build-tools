'use strict'

const browserify = require('browserify')
const {
  dest
} = require('gulp')
const gulpConfig = require('../gulp.config.js')
const source = require('vinyl-source-stream')

/**
 * Starting at the distribution entry point, bundle all the files into a single file and store them in the specified output directory.
 * @returns {*}
 */
const bundle = () => browserify(gulpConfig.distMain).bundle().pipe(source(''.concat(gulpConfig.browserName, '.js'))).pipe(dest(gulpConfig.browserPath))
module.exports = bundle
