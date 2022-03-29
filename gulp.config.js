const parentConfig = require('../../build-tools.config.js')
const defaultConfig = (config, path, defaultValue) => {
  if (typeof config[path] === 'undefined') {
    return defaultValue
  }
  return config[path]
}
module.exports = {
  browserName: defaultConfig(parentConfig, 'browserName', 'default'),
  browserPath: defaultConfig(parentConfig, 'browserPath', 'browser'),
  distMain: defaultConfig(parentConfig, 'distMain', 'dist/main'),
  distPath: defaultConfig(parentConfig, 'distPath', 'dist'),
  distSearch: defaultConfig(parentConfig, 'distSearch', 'dist/**/*.js'),
  readmeTemplate: defaultConfig(parentConfig, 'readmeTemplate', 'MAIN.md'),
  srcPath: defaultConfig(parentConfig, 'srcPath', 'src'),
  srcSearch: defaultConfig(parentConfig, 'srcSearch', 'src/**/!(*.test).js'),
  testPath: defaultConfig(parentConfig, 'testPath', ['src']),
}
