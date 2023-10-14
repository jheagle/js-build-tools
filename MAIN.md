# [js-build-tools](https://www.npmjs.com/package/js-build-tools)

Centralize the build process for Node.js, JS and TypeScript projects into a single tool suite.

### Goals

Using this tool suite, you can:

* Parse TypeScript into JS distribution files
* Create formatted distribution files to be used in a node / commonjs environment.
* Bundle your distribution files to be used in a browser environment.
* Run tests and watch for changes.
* Generate jsdoc readme files.

## Installation

In your project's root directory, run: `npm install --save-dev gulp js-build-tools`
(or `yarn add --dev gulp js-build-tools` if you use Yarn).

It is recommended to install gulp with the `-g` flag, so that you can run it with `gulp` instead
of `node_modules/.bin/gulp`.

## Configuration

In your project's root directory, create a `build-tools.config.js` file. This can contain any of the following (values
provided are the defaults):

```js
module.exports = {
  // The name to use for the browser-bundled output file (.js will be appended).
  browserName: 'my-package',

  // The output directory for browser-bundled files.
  browserPath: 'browser',

  // The paths for directories to delete before build.
  cleanPaths: ['dist', 'browser'],

  // The name of entry the distribution file.
  distMain: 'dist/main',

  // The output directory for the distribution files.
  distPath: 'dist',

  // The search pattern used for retrieving compiled distribution files.
  distSearch: 'dist/**/*.js',

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

  // Pattern for finding the TypeScript files
  tsSearch: 'src/**/*.ts',

  // The path the tsconfig file for running typescript or false if no ts file given.
  useTsConfig: false,

  // The search pattern for watching files for changes.
  watchSearch: 'src/**/*.js',
}
```

### Create your local gulpfile.js

In your project's root directory, create a `gulpfile.js` file, in here you can require any of the functions you need.
For example:

```js
// Your local gulpfile.js
const {
  build,
  defaultCmd,
  partials,
  readme,
  testFull,
  testQuick,
  typescript,
  watchFull,
  watchTest
} = require('js-build-tools')

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
You can then use the recommended configuration by requiring the `babel.config.js` file into your own configuration file.
Example:

```js
const babelConfig = require('js-build-tools/babel.config')
// You may add additional configuration here. Example: babelConfig.presets.push('@babel/preset-env')
module.exports = babelConfig
```

### Configure TypeScript (optional)

Create a `tsconfig.json` file in your project root with the following:

```json
{
  "files": [
    "src/**/*.ts"
  ],
  "compilerOptions": {
    "noImplicitAny": true,
    "target": "es6",
    "moduleResolution": "node",
    "declaration": true
  }
}
```

The pattern for `"files"` should match your .ts files, but the essential thing is that it is wrapped in an array.
The actual pattern used comes from `babel.config.js` as `'tsSearch'` setting. In order to create the ts declaration
files you must add the `"declaration": true`.

Add the following to the exports in your `babel.config.js`:

```js
module.exports = {
  readmeSearch: 'dist/**/!(*.min).js',
  useTsConfig: 'tsconfig.json',
}
```

The `js-to-markdown` only works on .js files, so we run the readme search on the built dist files. Also, we want to
register the tsconfig.json we created earlier and will alter the processes to build for TypeScript.

Update `babel.config.js` with the following:

```js
const babelConfig = require('js-build-tools/babel.config')
// This is the important line, we need to add compatibility for Jest to run tests on .ts files
babelConfig.presets.push('@babel/preset-typescript')
module.exports = babelConfig
```

### Configure Scripts

In your `package.json` file, add the following scripts:

```json
{
  "scripts": {
    "build": "gulp build",
    "dev": "gulp",
    "readme": "gulp readme",
    "test": "gulp testFull",
    "test:quick": "gulp testQuick",
    "watch": "gulp watchFull",
    "watch:test": "gulp watchTest"
  }
}
```

## Usage

Run any of the above commands with `gulp` or `npm run`.

# Available functions documentation

