const {
  build,
  defaultCmd,
  readme,
  testFull,
  testQuick,
  typescript,
  watchFull,
  watchTest
} = require('./gulpfile.base.js')
const removeDirectory = require('./functions/partials/removeDirectory')
const { series } = require('gulp')

const convertCommon = () => require('common-exports').default(
  'node_modules/gulp-imagemin/index.js',
  'vendor/gulp-imagemin',
  {
    copyResources: {
      ['node_modules/mozjpeg/index.js']: [
        {
          src: 'node_modules/mozjpeg/package.json',
          dest: 'vendor/mozjpeg/package.json'
        }
      ]
    }
  }
)

exports.build = done => {
  return series(convertCommon, build)(done)
  // return removeDirectory('vendor')
  //   .then(() => {
  //     return convertCommon()
  //   })
  //   .then(() => build(done))
}
exports.convertCommon = convertCommon
exports.default = defaultCmd
exports.readme = readme
exports.testFull = testFull
exports.testQuick = testQuick
exports.typescript = typescript
exports.watchFull = watchFull
exports.watchTest = watchTest
