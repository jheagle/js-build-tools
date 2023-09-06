# js-build-tools
Centralize the build process for node.js and JS projects into a single tool suite.

### Goals
Using this tool suite, you can:
* Create formatted distribution files to be used in a node / commonjs environment.
* Bundle your distribution files to be used in a browser environment.
* Run tests and watch for changes.
* Generate jsdoc readme files.

## Installation
In your project's root directory, run: `npm install --save-dev gulp js-build-tools`
(or `yarn add --dev gulp js-build-tools` if you use Yarn).

It is recommended to install gulp with the `-g` flag, so that you can run it with `gulp` instead of `node_modules/.bin/gulp`.

## Configuration
In your project's root directory, create a `build-tools.config.js` file. This can contain any of the following (values provided are the defaults):
```
module.exports = {
  // The name to use for the browser-bundled output file (.js will be appended).
  browserName: 'my-package',

  // The output directory for browser-bundled files.
  browserPath: 'browser',

  // The name of entry the distribution file.
  distMain: 'dist/main',

  // The output directory for the distribution files.
  distPath: 'dist',

  // The search pattern used for retrieving compiled distribution files.
  distSearch: 'dist/**/*.js',]\
  
  // 'true' to only generate node environment files.
  nodeOnly: false,
  
  // The name of the output documentation markdown file.
  readmeFile: 'README.md',
  
  // The directory to output the readme file in.
  readmePath: './',
  
  // Options for formatting the output readme.
  readmeOptions: 'utf8',

  // The file which will be pre-fixed to your README.md output.
  readmeTemplate: 'MAIN.md',
  
  // Location of files to use for compiling documentation into the readme.
  readmeSearch: ['gulpfile.base.js', 'gulp.config.js', 'functions/**/!(*.test).js'],

  // Base directory of the project.
  rootPath: './',
  
  // The directory where your source files are stored (the files you manually created).
  srcPath: 'src',

  // The search pattern used for gathering source files for distribution.
  srcSearch: 'src/**/!(*.test).js',
  
  // Additional flags for programatically running Jest Cli.
  testOptions: null,

  // The directory where Jest test files are stored.
  // By default stored as *.test.js adjacent with the files they are testing).
  testPath: 'src',
  
  // The path the tsconfig file for running typescript or false if no ts file given.
  useTsConfig: 'tsconfig.json',
  
  // The search pattern for watching files for changes.
  watchSearch: 'src/**/*.js',
}
```

### Create your local gulpfile.js
In your project's root directory, create a `gulpfile.js` file, in here you can require any of the functions you need. For example:
```
// Your local gulpfile.js
const { build, defaultCmd, readme, testFull, testQuick, watchFull, watchTest } = require('js-build-tools')

// Everything you export will be created as a gulp task.
// You can build your own tasks here as well by using some of the functions `js-build-tools/functions`.
// You can list your available tasks by running `gulp --tasks`.
exports.build = build
exports.default = defaultCmd
exports.readme = readme
exports.testFull = testFull
exports.testQuick = testQuick
exports.watchFull = watchFull
exports.watchTest = watchTest
```

Verify your tasks are available by running `gulp --tasks`.

### Configure Babel
Depending on how you wrote your test files, Jest may require some Babel configuration.
Create a `babel.config.js` file in the root directory of your project.
You can then use the recommended configuration by requiring the babel.config.js file into your own configuration file.
Example:
```
const babelConfig = require('js-build-tools/babel.config')
// You may add additional configuration here. Example: babelConfig.presets.push('@babel/preset-env')
module.exports = babelConfig
```

### Configure Scripts
In your package.json file, add the following scripts:
```
  "scripts": {
    "build": "gulp build",
    "dev": "gulp",
    "readme": "gulp readme",
    "test": "gulp testFull",
    "test:quick": "gulp testQuick",
    "watch": "gulp watchFull",
    "watch:test": "gulp watchTest"
  },
```

## Usage
Run any of the above commands with `gulp` or `npm run`.


# Available functions documentation

