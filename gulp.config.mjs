/**
 * Modify these configurations to match your project specifications.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 3.0.0
 * @module gulpConfig
 * @memberOf module:js-build-tools
 */
import { fileExists } from 'test-filesystem'

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
 * @property {BooleanSetting} enabled - 'true' to generate browser bundled files; 'false' for node environment only
 * @property {StringSetting} from - The name to use for the browser-bundled output file (.js will be appended).
 * @property {StringSetting} name - The search pattern used for retrieving compiled distribution files.
 * @property {StringSetting} to - The output directory for browser-bundled files.
 */
/**
 * Configurations for building the node distribution files.
 * @typedef {Object<string, Setting>} module:gulpConfig~DistConfig
 * @property {StringSetting} from - The search pattern used for gathering source files for distribution.
 * @property {StringSetting} main - Name of the entry the distribution file.
 * @property {StringSetting} to - The output directory for the distribution files.
 */
/**
 * Configurations for copying the font files.
 * @typedef {Object<string, Setting>} module:gulpConfig~FontConfig
 * @property {BooleanSetting} enabled - Toggle copy directory of fonts on.
 * @property {StringSetting} from - Path to search for fonts.
 * @property {StringSetting} to - Path to output fonts.
 */
/**
 * Configurations to minify and copy the images.
 * @typedef {Object<string, Setting>} module:gulpConfig~ImageConfig
 * @property {BooleanSetting} enabled - Toggle image minify and copy process.
 * @property {StringSetting} from - Path to search for images.
 * @property {StringSetting} to - Path to output images.
 */
/**
 * Configurations to compile and generate the Readme file.
 * @typedef {Object<string, Setting>} module:gulpConfig~ReadmeConfig
 * @property {StringSetting} file - The name of the output documentation markdown file.
 * @property {StringSetting} from - Location of files to use for compiling documentation into the readme.
 * @property {ArrayableSetting} options - Options for formatting the output readme.
 * @property {StringSetting} template - The file which will be pre-fixed to your README.md output.
 * @property {StringSetting} to - The directory to output the readme file in.
 */
/**
 * Configurations to compile and copy the sass files into css.
 * @typedef {Object<string, Setting>} module:gulpConfig~SassConfig
 * @property {BooleanSetting} enabled - Toggle SASS to CSS process on.
 * @property {StringSetting} from - The pattern for finding all sass files.
 * @property {StringSetting} path - The directory were sass files will be stored.
 * @property {StringSetting} to - The destination path for where generated CSS (from SASS files) should go.
 */
/**
 * Configurations for running the test suite.
 * @typedef {Object<string, Setting>} module:gulpConfig~TestConfig
 * @property {JestTestFlags} options - Additional flags for programmatically running Jest Cli.
 * @property {ArrayableSetting} path - The directory where Jest test files are stored.
 * By default, stored as *.test.js adjacent to the files they are testing.
 * @property {ArrayableSetting} watch - The search pattern for watching files for changes.
 */
/**
 * Configurations for compiling typescript into JS files.
 * @typedef {Object<string, Setting>} module:gulpConfig~TsConfig
 * @property {FlagStringSetting} config - The path the tsconfig file for running typescript or false if no ts file given.
 * @property {BooleanSetting} enabled - Toggle usage of typescript parsing.
 * @property {StringSetting} from - Pattern for finding the TypeScript files.
 * @property {StringSetting} to - Directory where parsed typescript files go.
 */
/**
 * A set of Configurations options defined by Settings.
 * @typedef {Object<string, Setting>} module:gulpConfig~Configurations
 * @property {BrowserConfig} browser - Browser bundling configuration group.
 * @property {ArrayableSetting} cleanPaths - The paths for directories to delete before build.
 * @property {DistConfig} dist - Distribution file generation configuration group.
 * @property {FontConfig} fonts - Fonts copy configuration group.
 * @property {ImageConfig} images - Minify and copy the images configuration.
 * @property {ReadmeConfig} readme - Build readme files configuration.
 * @property {StringSetting} rootPath - Base directory of the project.
 * @property {SassConfig} sass - Compile CSS from SASS configuration.
 * @property {StringSetting} srcPath - The directory where your source files are stored (the files you manually created).
 * @property {TestConfig} test - Run test suite configuration.
 * @property {TsConfig} typescript - Compile from typescript configuration.
 */
import { dotGet } from './functions/utilities/dotGet.mjs'
import { dotSet } from './functions/utilities/dotSet.mjs'
import { dotNotate } from './functions/utilities/dotNotate.mjs'
import { readFileSync } from 'fs'

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

/**
 * All the available configuration setting options for running the build.
 * @memberOf module:gulpConfig` `
 * @type {Configurations}
 */
let gulpConfigurations = null
if (fileExists(process.cwd() + '/build-tools.config.json')) {
  gulpConfigurations = JSON.parse(readFileSync(process.cwd() + '/build-tools.config.json').toString())
} else {
  if (fileExists('./build-tools.config.json')) {
    gulpConfigurations = JSON.parse(readFileSync('./build-tools.config.json').toString())
  } else {
    console.warn('Missing config path, ensure you have a build-tools.config.js file in you project root')
  }
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
export const get = (path = null, defaultValue = null) => dotGet(gulpConfigurations, path, defaultValue)

/**
 * Specify a value for the configurations to use.
 * @memberOf module:gulpConfig
 * @param path
 * @param value
 * @returns {*}
 */
export const set = (path, value) => dotSet(gulpConfigurations, path, value)
