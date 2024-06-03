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

In your project's root directory, create a `build-tools.config.json` file. This can contain any of the following (values
provided are the defaults):

```json
{
  "browser": {
    // 'true' to generate browser bundled files; 'false' for node environment only
    "enabled": true,
    // The name to use for the browser-bundled output file (.js will be appended).
    "name": "my-package",
    // The search pattern used for retrieving compiled distribution files.
    "from": "dist/**/*.js",
    // The output directory for browser-bundled files.
    "to": "browser"
  },
  // The paths for directories to delete before build.
  "cleanPaths": [
    "dist",
    "browser"
  ],
  "dist": {
    // Name of the entry the distribution file.
    "main": "dist/main",
    // The search pattern used for gathering source files for distribution.
    "from": "src/**/!(*.test).js",
    // The output directory for the distribution files.
    "to": "dist"
  },
  "fonts": {
    // Toggle copy directory of fonts on
    "enabled": false,
    // Path to search for fonts
    "from": "src/fonts/**/*",
    // Path to output fonts
    "to": "browser/fonts"
  },
  "images": {
    // Toggle image minify and copy process
    "enabled": false,
    // Path to search for images
    "from": "src/img/**/*.+(png|jpg|jpeg|gif|svg)",
    // Path to output images
    "to": "browser/img"
  },
  "readme": {
    // The file which will be pre-fixed to your README.md output.
    "template": "MAIN.md",
    // Options for formatting the output readme.
    "options": "utf8",
    // The name of the output documentation markdown file.
    "file": "README.md",
    // Location of files to use for compiling documentation into the readme.
    "from": [
      "src/**/!(*.test).js"
    ],
    // The directory to output the readme file in.
    "to": "./"
  },
  // Base directory of the project.
  "rootPath": "./",
  "sass": {
    // Toggle SASS to CSS process on.
    "enabled": false,
    // The pattern for finding all sass files.
    "from": "sass/**/*.+(scss|sass)",
    // The directory were sass files will be stored.
    "path": "sass",
    // The destination path for where generated CSS (from SASS files) should go.
    "to": "browser/css"
  },
  // The directory where your source files are stored (the files you manually created).
  "srcPath": "src",
  "test": {
    // Additional flags for programmatically running Jest Cli.
    "options": null,
    // The directory where Jest test files are stored.
    // By default, stored as *.test.js adjacent to the files they are testing.
    "path": [
      "src"
    ],
    // The search pattern for watching files for changes.
    "watch": "src/**/*.js"
  },
  "typescript": {
    // The path the tsconfig file for running typescript or false if no ts file given.
    "config": false,
    // Toggle usage of typescript parsing.
    "enabled": false,
    // Pattern for finding the TypeScript files.
    "from": "src/**/*.ts",
    // Directory where parsed typescript files go.
    "to": "dist"
  }
}
```

### Create your local gulpfile.js

In your project's root directory, create a `gulpfile.js` file, in here you can require any of the functions you need.
For example:

#### Common JS

```js
// Your local gulpfile.js
const {
  build,
  defaultCmd,
  partials,
  readme,
  sass,
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
exports.sass = sass
exports.testFull = testFull
exports.testQuick = testQuick
exports.watchFull = watchFull
exports.watchTest = watchTest
```

#### ES Module

```js
// Your local gulpfile.mjs
// Everything you export will be created as a gulp task.
export {
  build,
  defaultCmd,
  partials,
  readme,
  sass,
  testFull,
  testQuick,
  typescript,
  watchFull,
  watchTest
} from 'js-build-tools'

// You can build your own tasks here as well by using some of the functions `js-build-tools/functions`.
// You can list your available tasks by running `gulp --tasks`.

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

### Configure ES Modules (.mjs)

It is not recommended to use `"type": "module"` in the `package.json` to enable ES Modules.
This is because some dependencies still rely on common JS syntax (ex: babel, jest, jsdoc).
So, to use ES Modules, you can use the `.mjs` extension on your files instead.
There are different downsides to using the `.mjs` extension to consider.
The `jsdoc` generation can only read `.js` files, and the provided test runner `Jest` will need to be configured.
Update the test config as follows:

```json
{
  "dist": {
    // Use .mjs files for from and main
    "main": "src/main.mjs",
    "from": "src/**/!(*.test).mjs",
    "to": "dist"
  },
  "readme": {
    "template": "MAIN.md",
    "options": "utf8",
    "toFile": "README.md",
    "from": [
      // Use the dist directory files to generate the jsdocs
      "dist/!(*.test).js"
    ],
    "to": "./"
  },
  "test": {
    "options": {
      // The below helps to find the .mjs files (rather than default .js files)
      "testMatch": [
        "**/?(*.)+(spec|test).mjs?(x)"
      ]
    },
    "path": "functions",
    // Include watching for .mjs files
    "watch": "functions/**/*.[cm]?[jt]s"
  }
}
```

There is an additional file you need to get Jest working, add a `jest.config.js` file.
While we have already added these configurations above in the "options",
there seems to be a bug where the "transform" does not work in that context. Add the following to your `jest.config.js`:

```js
module.exports = {
  // The transform will instruct jest to run the files through babel so it can interpret them
  transform: {
    '^.+\\.[cm]?[jt]sx?$': 'babel-jest'
  }
}
```

### Configure HTML JS Documentation (optional)

It may be desirable to generate HTML documentation for your JS files.

Create a `.jsdoc.conf.js` file and add the following:

```js
const jsDocBase = require('js-build-tools/jsdoc.base')
/* You will get a jsdoc config object with the following:
 * {
 *    plugins: ['plugins/markdown'],
 *    source: {
 *      include: [your configured distPath],
 *      includePattern: '.+\\.js(doc|x)?$',
 *      excludePattern: '((^|\\/|\\\\)_|.+\\.test\\..*)'
 *    }
 *  }
 * You can manipulate the properties before returning in module.exports.
 * This searches the defined 'distPath' for building the HTML JS Documentation
 */
module.exports = jsDocBase
```

### Configure move fonts (optional)

Be able to copy a source directory of fonts into the distribution path.

Add the following to the exports in your `build-tools.config.json`:

```json
{
  "fonts": {
    // Enable fonts process
    "enabled": false,
    // Search pattern to find your font files
    "from": "src/fonts/**/*",
    // Output directory for your font files
    "to": "browser/fonts"
  }
}
```

### Configure move and minify images (optional)

Be able to copy and reduce the file size of images into an output path.

Add the following to the exports in your `build-tools.config.json`:

```json
{
  "images": {
    // Enable image process
    "enabled": false,
    // Search pattern to find your images
    "from": "src/img/**/*.+(png|jpg|jpeg|gif|svg)",
    // Output directory for your images files
    "to": "browser/img"
  }
}
```

### Configure SASS (optional)

SASS support is built-in, this enables conversion of SASS files to CSS for web projects.

Add the following to the exports in your `build-tools.config.json`:

```json
{
  "sass": {
    // Enable SASS process
    "enabled": false,
    // Search pattern to find your SASS files (the below would be files ending in .scss or .sass in a directory called 'sass')
    "from": "sass/**/*.+(scss|sass)",
    // Optional but nice to add (future support), add the directory where your sass files exist
    "path": "sass",
    // Output directory for your compiled css files, recommend css directory within your browser output directory
    "to": "browser/css"
  }
}
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
The actual pattern used comes from `build-tools.config.json` as `'typescript.from'` setting.
To create the ts declaration files, you must add the `"declaration": true`.

Add the following to the exports in your `build-tools.config.json`:

```json
{
  "readme": {
    // Location of files to use for compiling documentation into the readme.
    "from": "dist/**/!(*.min).js"
  },
  "typescript": {
    // The path the tsconfig file for running typescript or false if no ts file given.
    "config": "tsconfig.json",
    // Toggle usage of typescript parsing
    "enabled": true,
    // Pattern for finding the TypeScript files
    "from": "src/**/*.ts",
    // Directory where parsed typescript files go
    "to": "dist"
  }
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
    "htmldocs": "jsdoc -R MAIN.md -c ./.jsdoc.conf.js -d docs",
    "readme": "gulp readme",
    "sass": "gulp sass",
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

