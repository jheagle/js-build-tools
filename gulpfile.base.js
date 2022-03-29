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
