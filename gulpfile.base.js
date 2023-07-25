/**
 * This file is a cumulative example of implementing the resources available for building a project.
 * Importing this file as-is is recommended by requiring it into your gylpfile.js, however the option is available
 * customize as needed.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 2.0.0
 * @module js-build-tools
 */

const gulpConfig = require('./gulp.config.js')
const build = require('./functions/build.js')
const compileReadme = require('./functions/compileReadme.js')
const defaultCmd = require('./functions/default.js')
const testFull = require('./functions/testFull.js')
const testQuick = require('./functions/testQuick.js')
const watchFull = require('./functions/watchFull.js')
const watchTest = require('./functions/watchTest.js')

module.exports = {
  build,
  defaultCmd,
  readme: compileReadme,
  testFull,
  testQuick,
  watchFull,
  watchTest
}
