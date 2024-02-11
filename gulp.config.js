/**
 * Modify these configurations to match your project specifications.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 2.0.0
 * @module gulpConfig
 * @memberOf module:js-build-tools
 */

/**
 * A setting that may be an array of strings or a string only.
 * @typedef {Array<string>|string} module:gulpConfig~ArrayableSetting
 */

/**
 * A setting that may be true or false.
 * @typedef {boolean} module:gulpConfig~BooleanSetting
 */

/**
 * A setting that may be flag 'false' or provide a StringSetting
 * @typedef {false|StringSetting} module:gulpConfig~FlagStringSetting
 */

/**
 * An object of boolean settings used as flags.
 * @typedef {Object<string, BooleanSetting>} module:gulpConfig~FlagsSetting
 */

/**
 * Configure cli options for running Jest.
 * @typedef {FlagsSetting} module:gulpConfig~JestTestFlags
 * @property {BooleanSetting} clearCache
 * @property {BooleanSetting} debug
 * @property {BooleanSetting} ignoreProjects:
 * @property {BooleanSetting} json
 * @property {BooleanSetting} selectProjects
 * @property {BooleanSetting} showConfig
 * @property {BooleanSetting} useStderr
 * @property {BooleanSetting} watch
 * @property {BooleanSetting} watchAll
 */

/**
 * A setting that may only be a string.
 * @typedef {string} module:gulpConfig~StringSetting
 */

/**
 * Any single configuration option is a Setting.
 * @typedef {ArrayableSetting|BooleanSetting|FlagsSetting|StringSetting} Setting
 */

/**
 * Configurations for building the browser files.
 * @typedef {Object<string, Setting>} module:gulpConfig~BrowserConfig
 * @property {BooleanSetting} enabled
 * @property {StringSetting} from
 * @property {StringSetting} name
 * @property {StringSetting} to
 */

/**
 * Configurations for building the node distribution files.
 * @typedef {Object<string, Setting>} module:gulpConfig~DistConfig
 * @property {StringSetting} from
 * @property {StringSetting} main
 * @property {StringSetting} to
 */

/**
 * Configurations for copying the font files.
 * @typedef {Object<string, Setting>} module:gulpConfig~FontConfig
 * @property {BooleanSetting} enabled
 * @property {StringSetting} from
 * @property {StringSetting} to
 */

/**
 * Configurations to minify and copy the images.
 * @typedef {Object<string, Setting>} module:gulpConfig~ImageConfig
 * @property {BooleanSetting} enabled
 * @property {StringSetting} from
 * @property {StringSetting} to
 */

/**
 * Configurations to compile and generate the Readme file.
 * @typedef {Object<string, Setting>} module:gulpConfig~ReadmeConfig
 * @property {StringSetting} file
 * @property {StringSetting} from
 * @property {ArrayableSetting} options
 * @property {StringSetting} template
 * @property {StringSetting} to
 */

/**
 * Configurations to compile and copy the sass files into css.
 * @typedef {Object<string, Setting>} module:gulpConfig~SassConfig
 * @property {BooleanSetting} enabled
 * @property {StringSetting} from
 * @property {StringSetting} path
 * @property {StringSetting} to
 */

/**
 * Configurations for running the test suite.
 * @typedef {Object<string, Setting>} module:gulpConfig~TestConfig
 * @property {JestTestFlags} options
 * @property {ArrayableSetting} path
 * @property {ArrayableSetting} watch
 */

/**
 * Configurations for compiling typescript into JS files.
 * @typedef {Object<string, Setting>} module:gulpConfig~TsConfig
 * @property {FlagStringSetting} config
 * @property {BooleanSetting} enabled
 * @property {StringSetting} from
 * @property {StringSetting} to
 */

/**
 * A set of Configurations options defined by Settings.
 * @typedef {Object<string, Setting>} module:gulpConfig~Configurations
 * @property {BrowserConfig} browser
 * @property {ArrayableSetting} cleanPaths
 * @property {DistConfig} dist
 * @property {FontConfig} fonts
 * @property {ImageConfig} images
 * @property {ReadmeConfig} readme
 * @property {StringSetting} rootPath
 * @property {SassConfig} sass
 * @property {StringSetting} srcPath
 * @property {TestConfig} test
 * @property {TsConfig} typescript
 */

const dotGet = require('./functions/utilities/dotGet')
const dotSet = require('./functions/utilities/dotSet')
const dotNotate = require('./functions/utilities/dotNotate')
/**
 * All the available configuration setting options for running the build.
 * @memberOf module:gulpConfig` `
 * @type {Configurations}
 */
let gulpConfigurations = {}
try {
  gulpConfigurations = require('../../build-tools.config.js')
} catch (isUndefined) {
  try {
    // Missing main project config, using default path
    gulpConfigurations = require('./build-tools.config.js')
  } catch (stillUndefined) {
    console.warn('Missing config path, ensure you have a build-tools.config.js file in you project root')
  }
}

const setDefaults = {
  browser: {
    enabled: true,
    from: 'dist/**/*.js',
    name: 'default',
    to: 'browser',
  },
  cleanPaths: ['dist', 'browser'],
  dist: {
    from: 'src/**/!(*.test).js',
    main: 'dist/main',
    to: 'dist',
  },
  fonts: {
    enabled: false,
    from: 'src/fonts/**/*',
    to: 'browser/fonts',
  },
  images: {
    enabled: false,
    from: 'src/img/**/*.+(png|jpg|jpeg|gif|svg)',
    to: 'browser/img',
  },
  readme: {
    file: 'README.md',
    from: 'src/**/!(*.test).js',
    options: 'utf8',
    template: 'MAIN.md',
    to: './'
  },
  rootPath: './',
  sass: {
    enabled: false,
    from: 'sass/**/*.+(scss|sass)',
    path: 'sass',
    to: 'browser/css',
  },
  srcPath: 'src',
  test: {
    options: {
      clearCache: false,
      debug: false,
      ignoreProjects: false,
      json: false,
      selectProjects: false,
      showConfig: false,
      useStderr: false,
      watch: false,
      watchAll: false,
    },
    path: ['src'],
    watch: 'src/**/*.js'
  },
  typescript: {
    config: false,
    enabled: false,
    from: 'src/**/*.ts',
    to: 'dist',
  },
}

const notation = dotNotate(setDefaults)
for (let notationKey in notation) {
  const arrayEnding = /(\.\d+)$/
  if (arrayEnding.test(notationKey)) {
    // ends in number a key then it must be an array; use the entire array
    notationKey = notationKey.replace(arrayEnding, '')
  }
  const defaultValue = dotGet(setDefaults, notationKey)
  const existingConfig = dotGet(gulpConfigurations, notationKey, defaultValue)
  dotSet(gulpConfigurations, notationKey, existingConfig)
}

/**
 * Retrieve a value from the configurations, default may be returned.
 * @memberOf module:gulpConfig
 * @param {string|null} path
 * @param {*} defaultValue
 * @returns {*|null}
 */
const get = (path = null, defaultValue = null) => dotGet(gulpConfigurations, path, defaultValue)

/**
 * Specify a value for the configurations to use.
 * @memberOf module:gulpConfig
 * @param path
 * @param value
 * @returns {*}
 */
const set = (path, value) => dotSet(gulpConfigurations, path, value)

module.exports = {
  get,
  set
}
