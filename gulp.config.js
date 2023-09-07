/**
 * Modify these configurations to match your project specifications.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 2.0.0
 * @module gulpConfig
 * @memberOf module:js-build-tools
 */

/**
 * Retrieve a value from an object with the path (key), return a given default if the key is not found.
 * @memberOf module:gulpConfig
 * @param {Object<string, *>} [config=[]]
 * @param {string|null} [path=null]
 * @param {*} [defaultValue=null]
 * @returns {*|null}
 */
const defaultConfig = (config = {}, path = null, defaultValue = null) => {
  if (!path) {
    return config
  }
  if (typeof config[path] === 'undefined') {
    return defaultValue
  }
  return config[path]
}

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
  browserName: 'default',
  browserPath: 'browser',
  cleanPaths: ['dist', 'browser'],
  distMain: 'dist/main',
  distPath: 'dist',
  distSearch: 'dist/**/*.js',
  nodeOnly: false,
  readmeTemplate: 'MAIN.md',
  readmeOptions: 'utf8',
  readmeFile: 'README.md',
  readmePath: './',
  readmeSearch: 'src/**/!(*.test).js',
  rootPath: './',
  srcPath: 'src',
  srcSearch: 'src/**/!(*.test).js',
  testOptions: {
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
  testPath: ['src'],
  tsSearch: 'src/**/*.ts',
  useTsConfig: false,
  watchSearch: 'src/**/*.js'
}

Object.keys(setDefaults).forEach(parentKey => {
  gulpConfigurations[parentKey] = defaultConfig(gulpConfigurations, parentKey, setDefaults[parentKey])
})

/**
 * Retrieve a value from teh configurations, default may be returned.
 * @function
 * @memberOf module:gulpConfig
 * @param {string|null} path
 * @param {*} defaultValue
 * @returns {*|null}
 */
const get = (path = null, defaultValue = null) => defaultConfig(gulpConfigurations, path, defaultValue)

/**
 * Specify a value for the configurations to use.
 * @function
 * @memberOf module:gulpConfig
 * @param path
 * @param value
 * @returns {*}
 */
const set = (path, value) => {
  gulpConfigurations[path] = value
  return value
}

module.exports = {
  defaultConfig,
  get,
  set
}
