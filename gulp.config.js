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
 * A set of Configurations options defined by Settings.
 * @typedef {Object<string, Setting>} module:gulpConfig~Configurations
 * @property {StringSetting} browserName
 * @property {StringSetting} browserPath
 * @property {StringSetting} distMain
 * @property {StringSetting} distPath
 * @property {ArrayableSetting} distSearch
 * @property {BooleanSetting} nodeOnly
 * @property {StringSetting} readmeTemplate
 * @property {ArrayableSetting} readmeOptions
 * @property {StringSetting} readmeFile
 * @property {StringSetting} readmePath
 * @property {ArrayableSetting} readmeSearch
 * @property {StringSetting} rootPath
 * @property {StringSetting} srcPath
 * @property {ArrayableSetting} srcSearch
 * @property {JestTestFlags} testOptions
 * @property {ArrayableSetting} testPath
 * @property {FlagStringSetting} useTsConfig
 * @property {ArrayableSetting} watchSearch
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
    name: 'default',
    from: 'dist/**/*.js',
    to: 'browser',
    enabled: true,
  },
  cleanPaths: ['dist', 'browser'],
  dist: {
    main: 'dist/main',
    from: 'src/**/!(*.test).js',
    to: 'dist',
  },
  fonts: {
    from: 'src/fonts/**/*',
    to: 'browser/fonts',
    enabled: false
  },
  images: {
    from: 'src/img/**/*.+(png|jpg|jpeg|gif|svg)',
    to: 'browser/img',
    enabled: false
  },
  readme: {
    template: 'MAIN.md',
    options: 'utf8',
    file: 'README.md',
    from: 'src/**/!(*.test).js',
    to: './'
  },
  rootPath: './',
  sass: {
    from: 'sass/**/*.+(scss|sass)',
    path: 'sass',
    to: 'browser/css',
    enabled: false
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
    from: 'src/**/*.ts',
    to: 'dist',
    enabled: false
  },
}

const notation = dotNotate(setDefaults)
for(let notationKey in notation) {
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
