/**
 * Retrieve a value from and object with the path (key), return a given default if the key is not found.
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
let parentConfig = {}
try {
  parentConfig = require('../../build-tools.config.js')
} catch (isUndefined) {
  try {
    // Missing main project config, using default path
    parentConfig = require('./build-tools.config.js')
  } catch (stillUndefined) {
    console.warn('Missing config path, ensure you have a build-tools.config.js file in you project root')
  }
}

const setDefaults = {
  browserName: 'default',
  browserPath: 'browser',
  distMain: 'dist/main',
  distPath: 'dist',
  distSearch: 'dist/**/*.js',
  nodeOnly: false,
  readmeTemplate: 'MAIN.md',
  readmeOptions: 'utf8',
  readmeFile: 'README.md',
  readmePath: './',
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
  useTsConfig: false,
  watchSearch: 'src/**/*.js'
}

Object.keys(setDefaults).forEach(parentKey => {
  parentConfig[parentKey] = defaultConfig(parentConfig, parentKey, setDefaults[parentKey])
})

module.exports = {
  get: (path = null, defaultValue = null) => defaultConfig(parentConfig, path, defaultValue),
  set: (path, value) => {
    parentConfig[path] = value
    return value
  }
}
