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
const { series } = require('gulp')

const { makeCommon } = require('common-exports')

const convertCommon = () => makeCommon(
  'node_modules/gulp-imagemin/index.js',
  'vendor/gulp-imagemin',
  {
    copyResources: {
      ['node_modules/mozjpeg/index.js']: [
        {
          src: 'node_modules/mozjpeg/package.json',
          dest: 'vendor/mozjpeg/package.json',
          updateContent: (content) => content.replace(
            '\n\t"type": "module",', ''
          )
        },
        {
          src: 'node_modules/mozjpeg/vendor',
          dest: 'vendor/mozjpeg/vendor'
        }
      ]
    },
    customChanges: {
      ['node_modules/imagemin-mozjpeg/node_modules/execa/lib/kill.js']: [
        {
          updateContent: (content) => content.replace(
            'import onExit from \'signal-exit\';',
            'import { onExit } from \'signal-exit\';'
          )
        }
      ],
      ['node_modules/gulp-imagemin/index.js']: [
        {
          updateContent: content => content.replace(
            'export const gifsicle = await exposePlugin(\'gifsicle\');\n' +
            'export const mozjpeg = await exposePlugin(\'mozjpeg\');\n' +
            'export const optipng = await exposePlugin(\'optipng\');\n' +
            'export const svgo = await exposePlugin(\'svgo\');',
            'export const gifsicle = exposePlugin(\'gifsicle\');\n' +
            'export const mozjpeg = exposePlugin(\'mozjpeg\');\n' +
            'export const optipng = exposePlugin(\'optipng\');\n' +
            'export const svgo = exposePlugin(\'svgo\');'
          )
        },
      ]
    }
  }
)

exports.build = done => series(convertCommon, build)(done)
exports.convertCommon = convertCommon
exports.default = defaultCmd
exports.readme = readme
exports.testFull = testFull
exports.testQuick = testQuick
exports.typescript = typescript
exports.watchFull = watchFull
exports.watchTest = watchTest
