const defaultConfig = (config, path, defaultValue) => {
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
    parentConfig = require('./build-tools.config.js')
    console.info('Missing main project config, using default path')
  } catch (stillUndefined) {
    console.warn('Missing config path, ensure you have a build-tools.config.js file in you project root')
  }
}
module.exports = {
  browserName: defaultConfig(parentConfig, 'browserName', 'default'),
  browserPath: defaultConfig(parentConfig, 'browserPath', 'browser'),
  distMain: defaultConfig(parentConfig, 'distMain', 'dist/main'),
  distPath: defaultConfig(parentConfig, 'distPath', 'dist'),
  distSearch: defaultConfig(parentConfig, 'distSearch', 'dist/**/*.js'),
  nodeOnly: defaultConfig(parentConfig, 'nodeOnly', false),
  readmeTemplate: defaultConfig(parentConfig, 'readmeTemplate', 'MAIN.md'),
  srcPath: defaultConfig(parentConfig, 'srcPath', 'src'),
  srcSearch: defaultConfig(parentConfig, 'srcSearch', 'src/**/!(*.test).js'),
  testPath: defaultConfig(parentConfig, 'testPath', ['src']),
  watchSearch: defaultConfig(parentConfig, 'watchSearch', 'src/**/*.js'),
}
