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
  browser: {
    // 'true' to generate browser bundled files; 'false' for node environment only
    enabled: true,
    // The name to use for the browser-bundled output file (.js will be appended).
    name: 'my-package',
    // The search pattern used for retrieving compiled distribution files.
    from: 'dist/**/*.js',
    // The output directory for browser-bundled files.
    to: 'browser',
  },
  // The paths for directories to delete before build.
  cleanPaths: ['dist', 'browser'],
  dist: {
    // Name of the entry the distribution file.
    main: 'dist/main',
    // The search pattern used for gathering source files for distribution.
    from: 'src/**/!(*.test).js',
    // The output directory for the distribution files.
    to: 'dist',
  },
  fonts: {
    // Toggle copy directory of fonts on
    enabled: false,
    // Path to search for fonts
    from: 'src/fonts/**/*',
    // Path to output fonts
    to: 'browser/fonts',
  },
  images: {
    // Toggle image minify and copy process
    enabled: false,
    // Path to search for images
    from: 'src/img/**/*.+(png|jpg|jpeg|gif|svg)',
    // Path to output images
    to: 'browser/img',
  },
  readme: {
    // The file which will be pre-fixed to your README.md output.
    template: 'MAIN.md',
    // Options for formatting the output readme.
    options: 'utf8',
    // The name of the output documentation markdown file.
    file: 'README.md',
    // Location of files to use for compiling documentation into the readme.
    from: ['gulpfile.base.js', 'gulp.config.js', 'functions/**/!(*.test).js'],
    // The directory to output the readme file in.
    to: './'
  },
  // Base directory of the project.
  rootPath: './',
  sass: {
    // Toggle SASS to CSS process on.
    enabled: false,
    // The pattern for finding all sass files.
    from: 'sass/**/*.+(scss|sass)',
    // The directory were sass files will be stored.
    path: 'sass',
    // The destination path for where generated CSS (from SASS files) should go.
    to: 'browser/css',
  },
  // The directory where your source files are stored (the files you manually created).
  srcPath: 'src',
  test: {
    // Additional flags for programmatically running Jest Cli.
    options: null,
    // The directory where Jest test files are stored.
    // By default, stored as *.test.js adjacent to the files they are testing.
    path: ['src'],
    // The search pattern for watching files for changes.
    watch: 'src/**/*.js'
  },
  typescript: {
    // The path the tsconfig file for running typescript or false if no ts file given.
    config: false,
    // Toggle usage of typescript parsing.
    enabled: false,
    // Pattern for finding the TypeScript files.
    from: 'src/**/*.ts',
    // Directory where parsed typescript files go.
    to: 'dist',
  },
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

Add the following to the exports in your `build-tools.config.js`:

```js
module.exports = {
  fonts: {
    // Enable fonts process
    enabled: false,
    // Search pattern to find your font files
    from: 'src/fonts/**/*',
    // Output directory for your font files
    to: 'browser/fonts',
  }
}
```

### Configure move and minify images (optional)

Be able to copy and reduce the file size of images into an output path.

Add the following to the exports in your `build-tools.config.js`:

```js
module.exports = {
  images: {
    // Enable image process
    enabled: false,
    // Search pattern to find your images
    from: 'src/img/**/*.+(png|jpg|jpeg|gif|svg)',
    // Output directory for your images files
    to: 'browser/img',
  }
}
```

### Configure SASS (optional)

SASS support is built-in, this enables conversion of SASS files to CSS for web projects.

Add the following to the exports in your `build-tools.config.js`:

```js
module.exports = {
  sass: {
    // Enable SASS process
    enabled: false,
    // Search pattern to find your SASS files (the below would be files ending in .scss or .sass in a directory called 'sass')
    from: 'sass/**/*.+(scss|sass)',
    // Optional but nice to add (future support), add the directory where your sass files exist
    path: 'sass',
    // Output directory for your compiled css files, recommend css directory within your browser output directory
    to: 'browser/css',
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
The actual pattern used comes from `build-tools.config.js` as `'typescript.from'` setting.
To create the ts declaration files, you must add the `"declaration": true`.

Add the following to the exports in your `build-tools.config.js`:

```js
module.exports = {
  readme: {
    // Location of files to use for compiling documentation into the readme.
    from: 'dist/**/!(*.min).js',
  },
  typescript: {
    // The path the tsconfig file for running typescript or false if no ts file given.
    config: 'tsconfig.json',
    // Toggle usage of typescript parsing
    enabled: true,
    // Pattern for finding the TypeScript files
    from: 'src/**/*.ts',
    // Directory where parsed typescript files go
    to: 'dist',
  },
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

## Modules

<dl>
<dt><a href="#module_js-build-tools">js-build-tools</a></dt>
<dd><p>Export these functions to your own project in order to customize your build pipeline.</p>
</dd>
<dt><a href="#module_gulpConfig">gulpConfig</a></dt>
<dd><p>Modify these configurations to match your project specifications.</p>
</dd>
<dt><a href="#module_testHelpers">testHelpers</a></dt>
<dd><p>Export the setUp helper.</p>
</dd>
<dt><a href="#module_partials">partials</a></dt>
<dd><p>Micro-functions used as components for the main gulp functions.</p>
</dd>
</dl>

<a name="module_js-build-tools"></a>

## js-build-tools
Export these functions to your own project in order to customize your build pipeline.

**Version**: 2.0.0  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [js-build-tools](#module_js-build-tools)
    * [.typeScript](#module_js-build-tools.typeScript) ⇒ <code>function</code>
    * [.compileReadme](#module_js-build-tools.compileReadme) ⇒ <code>stream.Stream</code>
    * [.watchTest()](#module_js-build-tools.watchTest) ⇒ <code>\*</code>
    * [.watchFull()](#module_js-build-tools.watchFull) ⇒ <code>FSWatcher</code>
    * [.testQuick()](#module_js-build-tools.testQuick) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.testFull()](#module_js-build-tools.testFull) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.images()](#module_js-build-tools.images) ⇒ <code>stream.Stream</code>
    * [.distMinify()](#module_js-build-tools.distMinify) ⇒ <code>\*</code>
    * [.distLint()](#module_js-build-tools.distLint) ⇒ <code>\*</code>
    * [.dist()](#module_js-build-tools.dist) ⇒ <code>\*</code>
    * [.defaultCmd([done])](#module_js-build-tools.defaultCmd) ⇒ <code>stream.Stream</code>
    * [.copyFonts()](#module_js-build-tools.copyFonts) ⇒ <code>stream.Stream</code>
    * [.bundleMinify()](#module_js-build-tools.bundleMinify) ⇒ <code>\*</code>
    * [.bundleLint()](#module_js-build-tools.bundleLint) ⇒ <code>stream.Stream</code>
    * [.bundle()](#module_js-build-tools.bundle) ⇒ <code>stream.Stream</code>
    * [.build()](#module_js-build-tools.build) ⇒ <code>stream.Stream</code>

<a name="module_js-build-tools.typeScript"></a>

### js-build-tools.typeScript ⇒ <code>function</code>
Simplified typescript task using tsFor.

**Kind**: static constant of [<code>js-build-tools</code>](#module_js-build-tools)  
<a name="module_js-build-tools.compileReadme"></a>

### js-build-tools.compileReadme ⇒ <code>stream.Stream</code>
Generate the README.md file based off of the template, then append the generated documentation.

**Kind**: static constant of [<code>js-build-tools</code>](#module_js-build-tools)  
<a name="module_js-build-tools.watchTest"></a>

### js-build-tools.watchTest() ⇒ <code>\*</code>
Watch for changes and run the tests.

**Kind**: static method of [<code>js-build-tools</code>](#module_js-build-tools)  
<a name="module_js-build-tools.watchFull"></a>

### js-build-tools.watchFull() ⇒ <code>FSWatcher</code>
Watch for changes and run the distribution for the changed files, then bundle and test the changed files.

**Kind**: static method of [<code>js-build-tools</code>](#module_js-build-tools)  
<a name="module_js-build-tools.testQuick"></a>

### js-build-tools.testQuick() ⇒ <code>Promise.&lt;\*&gt;</code>
Run the Jest tests for files which have been modified (based on git status).Configure where tests are located by using 'testPath'.

**Kind**: static method of [<code>js-build-tools</code>](#module_js-build-tools)  
<a name="module_js-build-tools.testFull"></a>

### js-build-tools.testFull() ⇒ <code>Promise.&lt;\*&gt;</code>
Run all tests with jest.Configure where tests are located by using 'testPath'.

**Kind**: static method of [<code>js-build-tools</code>](#module_js-build-tools)  
<a name="module_js-build-tools.images"></a>

### js-build-tools.images() ⇒ <code>stream.Stream</code>
Move and optimize the images into the browser folder using configured settings.

**Kind**: static method of [<code>js-build-tools</code>](#module_js-build-tools)  
<a name="module_js-build-tools.distMinify"></a>

### js-build-tools.distMinify() ⇒ <code>\*</code>
Creates minified versions of the dist files.

**Kind**: static method of [<code>js-build-tools</code>](#module_js-build-tools)  
<a name="module_js-build-tools.distLint"></a>

### js-build-tools.distLint() ⇒ <code>\*</code>
Applies Standard code style linting to distribution files.

**Kind**: static method of [<code>js-build-tools</code>](#module_js-build-tools)  
<a name="module_js-build-tools.dist"></a>

### js-build-tools.dist() ⇒ <code>\*</code>
Simplified distribution tasks which will use arguments from distFor.

**Kind**: static method of [<code>js-build-tools</code>](#module_js-build-tools)  
<a name="module_js-build-tools.defaultCmd"></a>

### js-build-tools.defaultCmd([done]) ⇒ <code>stream.Stream</code>
Recommended as the default task, runs the simple dist and bundle tasks.

**Kind**: static method of [<code>js-build-tools</code>](#module_js-build-tools)  

| Param | Type | Default |
| --- | --- | --- |
| [done] | <code>function</code> | <code></code> | 

<a name="module_js-build-tools.copyFonts"></a>

### js-build-tools.copyFonts() ⇒ <code>stream.Stream</code>
Move the font files into the browser directory.

**Kind**: static method of [<code>js-build-tools</code>](#module_js-build-tools)  
<a name="module_js-build-tools.bundleMinify"></a>

### js-build-tools.bundleMinify() ⇒ <code>\*</code>
Creates the minified bundle file.

**Kind**: static method of [<code>js-build-tools</code>](#module_js-build-tools)  
<a name="module_js-build-tools.bundleLint"></a>

### js-build-tools.bundleLint() ⇒ <code>stream.Stream</code>
Applies Standard code style linting to bundled file.

**Kind**: static method of [<code>js-build-tools</code>](#module_js-build-tools)  
<a name="module_js-build-tools.bundle"></a>

### js-build-tools.bundle() ⇒ <code>stream.Stream</code>
Starting at the distribution entry point, bundle all the files into a single file and store them in the specified output directory.

**Kind**: static method of [<code>js-build-tools</code>](#module_js-build-tools)  
<a name="module_js-build-tools.build"></a>

### js-build-tools.build() ⇒ <code>stream.Stream</code>
Runs several processes to build and validate the project.Cleans, distributes (lint and minify), bundles (lint and minify), creates the readme, then runs the tests.

**Kind**: static method of [<code>js-build-tools</code>](#module_js-build-tools)  
<a name="module_gulpConfig"></a>

## gulpConfig
Modify these configurations to match your project specifications.

**Version**: 2.0.0  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [gulpConfig](#module_gulpConfig)
    * _static_
        * [.get(path, defaultValue)](#module_gulpConfig.get) ⇒ <code>\*</code> \| <code>null</code>
        * [.set(path, value)](#module_gulpConfig.set) ⇒ <code>\*</code>
    * _inner_
        * [~ArrayableSetting](#module_gulpConfig..ArrayableSetting) : <code>Array.&lt;string&gt;</code> \| <code>string</code>
        * [~BooleanSetting](#module_gulpConfig..BooleanSetting) : <code>boolean</code>
        * [~FlagStringSetting](#module_gulpConfig..FlagStringSetting) : <code>false</code> \| <code>StringSetting</code>
        * [~FlagsSetting](#module_gulpConfig..FlagsSetting) : <code>Object.&lt;string, BooleanSetting&gt;</code>
        * [~JestTestFlags](#module_gulpConfig..JestTestFlags) : <code>FlagsSetting</code>
        * [~StringSetting](#module_gulpConfig..StringSetting) : <code>string</code>
        * [~Setting](#module_gulpConfig..Setting) : <code>ArrayableSetting</code> \| <code>BooleanSetting</code> \| <code>FlagsSetting</code> \| <code>StringSetting</code>
        * [~BrowserConfig](#module_gulpConfig..BrowserConfig) : <code>Object.&lt;string, Setting&gt;</code>
        * [~DistConfig](#module_gulpConfig..DistConfig) : <code>Object.&lt;string, Setting&gt;</code>
        * [~FontConfig](#module_gulpConfig..FontConfig) : <code>Object.&lt;string, Setting&gt;</code>
        * [~ImageConfig](#module_gulpConfig..ImageConfig) : <code>Object.&lt;string, Setting&gt;</code>
        * [~ReadmeConfig](#module_gulpConfig..ReadmeConfig) : <code>Object.&lt;string, Setting&gt;</code>
        * [~SassConfig](#module_gulpConfig..SassConfig) : <code>Object.&lt;string, Setting&gt;</code>
        * [~TestConfig](#module_gulpConfig..TestConfig) : <code>Object.&lt;string, Setting&gt;</code>
        * [~TsConfig](#module_gulpConfig..TsConfig) : <code>Object.&lt;string, Setting&gt;</code>
        * [~Configurations](#module_gulpConfig..Configurations) : <code>Object.&lt;string, Setting&gt;</code>

<a name="module_gulpConfig.get"></a>

### gulpConfig.get(path, defaultValue) ⇒ <code>\*</code> \| <code>null</code>
Retrieve a value from the configurations, default may be returned.

**Kind**: static method of [<code>gulpConfig</code>](#module_gulpConfig)  

| Param | Type | Default |
| --- | --- | --- |
| path | <code>string</code> \| <code>null</code> | <code>null</code> | 
| defaultValue | <code>\*</code> | <code></code> | 

<a name="module_gulpConfig.set"></a>

### gulpConfig.set(path, value) ⇒ <code>\*</code>
Specify a value for the configurations to use.

**Kind**: static method of [<code>gulpConfig</code>](#module_gulpConfig)  

| Param |
| --- |
| path | 
| value | 

<a name="module_gulpConfig..ArrayableSetting"></a>

### gulpConfig~ArrayableSetting : <code>Array.&lt;string&gt;</code> \| <code>string</code>
A setting that may be an array of strings or a string only.

**Kind**: inner typedef of [<code>gulpConfig</code>](#module_gulpConfig)  
<a name="module_gulpConfig..BooleanSetting"></a>

### gulpConfig~BooleanSetting : <code>boolean</code>
A setting that may be true or false.

**Kind**: inner typedef of [<code>gulpConfig</code>](#module_gulpConfig)  
<a name="module_gulpConfig..FlagStringSetting"></a>

### gulpConfig~FlagStringSetting : <code>false</code> \| <code>StringSetting</code>
A setting that may be flag 'false' or provide a StringSetting

**Kind**: inner typedef of [<code>gulpConfig</code>](#module_gulpConfig)  
<a name="module_gulpConfig..FlagsSetting"></a>

### gulpConfig~FlagsSetting : <code>Object.&lt;string, BooleanSetting&gt;</code>
An object of boolean settings used as flags.

**Kind**: inner typedef of [<code>gulpConfig</code>](#module_gulpConfig)  
<a name="module_gulpConfig..JestTestFlags"></a>

### gulpConfig~JestTestFlags : <code>FlagsSetting</code>
Configure cli options for running Jest.

**Kind**: inner typedef of [<code>gulpConfig</code>](#module_gulpConfig)  
**Properties**

| Name | Type |
| --- | --- |
| clearCache | <code>BooleanSetting</code> | 
| debug | <code>BooleanSetting</code> | 
| ignoreProjects: | <code>BooleanSetting</code> | 
| json | <code>BooleanSetting</code> | 
| selectProjects | <code>BooleanSetting</code> | 
| showConfig | <code>BooleanSetting</code> | 
| useStderr | <code>BooleanSetting</code> | 
| watch | <code>BooleanSetting</code> | 
| watchAll | <code>BooleanSetting</code> | 

<a name="module_gulpConfig..StringSetting"></a>

### gulpConfig~StringSetting : <code>string</code>
A setting that may only be a string.

**Kind**: inner typedef of [<code>gulpConfig</code>](#module_gulpConfig)  
<a name="module_gulpConfig..Setting"></a>

### gulpConfig~Setting : <code>ArrayableSetting</code> \| <code>BooleanSetting</code> \| <code>FlagsSetting</code> \| <code>StringSetting</code>
Any single configuration option is a Setting.

**Kind**: inner typedef of [<code>gulpConfig</code>](#module_gulpConfig)  
<a name="module_gulpConfig..BrowserConfig"></a>

### gulpConfig~BrowserConfig : <code>Object.&lt;string, Setting&gt;</code>
Configurations for building the browser files.

**Kind**: inner typedef of [<code>gulpConfig</code>](#module_gulpConfig)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| enabled | <code>BooleanSetting</code> | 'true' to generate browser bundled files; 'false' for node environment only |
| from | <code>StringSetting</code> | The name to use for the browser-bundled output file (.js will be appended). |
| name | <code>StringSetting</code> | The search pattern used for retrieving compiled distribution files. |
| to | <code>StringSetting</code> | The output directory for browser-bundled files. |

<a name="module_gulpConfig..DistConfig"></a>

### gulpConfig~DistConfig : <code>Object.&lt;string, Setting&gt;</code>
Configurations for building the node distribution files.

**Kind**: inner typedef of [<code>gulpConfig</code>](#module_gulpConfig)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| from | <code>StringSetting</code> | The search pattern used for gathering source files for distribution. |
| main | <code>StringSetting</code> | Name of the entry the distribution file. |
| to | <code>StringSetting</code> | The output directory for the distribution files. |

<a name="module_gulpConfig..FontConfig"></a>

### gulpConfig~FontConfig : <code>Object.&lt;string, Setting&gt;</code>
Configurations for copying the font files.

**Kind**: inner typedef of [<code>gulpConfig</code>](#module_gulpConfig)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| enabled | <code>BooleanSetting</code> | Toggle copy directory of fonts on. |
| from | <code>StringSetting</code> | Path to search for fonts. |
| to | <code>StringSetting</code> | Path to output fonts. |

<a name="module_gulpConfig..ImageConfig"></a>

### gulpConfig~ImageConfig : <code>Object.&lt;string, Setting&gt;</code>
Configurations to minify and copy the images.

**Kind**: inner typedef of [<code>gulpConfig</code>](#module_gulpConfig)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| enabled | <code>BooleanSetting</code> | Toggle image minify and copy process. |
| from | <code>StringSetting</code> | Path to search for images. |
| to | <code>StringSetting</code> | Path to output images. |

<a name="module_gulpConfig..ReadmeConfig"></a>

### gulpConfig~ReadmeConfig : <code>Object.&lt;string, Setting&gt;</code>
Configurations to compile and generate the Readme file.

**Kind**: inner typedef of [<code>gulpConfig</code>](#module_gulpConfig)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| file | <code>StringSetting</code> | The name of the output documentation markdown file. |
| from | <code>StringSetting</code> | Location of files to use for compiling documentation into the readme. |
| options | <code>ArrayableSetting</code> | Options for formatting the output readme. |
| template | <code>StringSetting</code> | The file which will be pre-fixed to your README.md output. |
| to | <code>StringSetting</code> | The directory to output the readme file in. |

<a name="module_gulpConfig..SassConfig"></a>

### gulpConfig~SassConfig : <code>Object.&lt;string, Setting&gt;</code>
Configurations to compile and copy the sass files into css.

**Kind**: inner typedef of [<code>gulpConfig</code>](#module_gulpConfig)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| enabled | <code>BooleanSetting</code> | Toggle SASS to CSS process on. |
| from | <code>StringSetting</code> | The pattern for finding all sass files. |
| path | <code>StringSetting</code> | The directory were sass files will be stored. |
| to | <code>StringSetting</code> | The destination path for where generated CSS (from SASS files) should go. |

<a name="module_gulpConfig..TestConfig"></a>

### gulpConfig~TestConfig : <code>Object.&lt;string, Setting&gt;</code>
Configurations for running the test suite.

**Kind**: inner typedef of [<code>gulpConfig</code>](#module_gulpConfig)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| options | <code>JestTestFlags</code> | Additional flags for programmatically running Jest Cli. |
| path | <code>ArrayableSetting</code> | The directory where Jest test files are stored. By default, stored as *.test.js adjacent to the files they are testing. |
| watch | <code>ArrayableSetting</code> | The search pattern for watching files for changes. |

<a name="module_gulpConfig..TsConfig"></a>

### gulpConfig~TsConfig : <code>Object.&lt;string, Setting&gt;</code>
Configurations for compiling typescript into JS files.

**Kind**: inner typedef of [<code>gulpConfig</code>](#module_gulpConfig)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| config | <code>FlagStringSetting</code> | The path the tsconfig file for running typescript or false if no ts file given. |
| enabled | <code>BooleanSetting</code> | Toggle usage of typescript parsing. |
| from | <code>StringSetting</code> | Pattern for finding the TypeScript files. |
| to | <code>StringSetting</code> | Directory where parsed typescript files go. |

<a name="module_gulpConfig..Configurations"></a>

### gulpConfig~Configurations : <code>Object.&lt;string, Setting&gt;</code>
A set of Configurations options defined by Settings.

**Kind**: inner typedef of [<code>gulpConfig</code>](#module_gulpConfig)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| browser | <code>BrowserConfig</code> | Browser bundling configuration group. |
| cleanPaths | <code>ArrayableSetting</code> | The paths for directories to delete before build. |
| dist | <code>DistConfig</code> | Distribution file generation configuration group. |
| fonts | <code>FontConfig</code> | Fonts copy configuration group. |
| images | <code>ImageConfig</code> | Minify and copy the images configuration. |
| readme | <code>ReadmeConfig</code> | Build readme files configuration. |
| rootPath | <code>StringSetting</code> | Base directory of the project. |
| sass | <code>SassConfig</code> | Compile CSS from SASS configuration. |
| srcPath | <code>StringSetting</code> | The directory where your source files are stored (the files you manually created). |
| test | <code>TestConfig</code> | Run test suite configuration. |
| typescript | <code>TsConfig</code> | Compile from typescript configuration. |

<a name="module_testHelpers"></a>

## testHelpers
Export the setUp helper.

**Version**: 3.0.0  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [testHelpers](#module_testHelpers)
    * [.exports.createTempDir](#module_testHelpers.exports.createTempDir) ⇒ <code>Promise.&lt;(\*\|void)&gt;</code>
    * [.exports.beforeEach](#module_testHelpers.exports.beforeEach) ⇒ <code>Promise.&lt;(\*\|void)&gt;</code>
    * [.exports.afterEach](#module_testHelpers.exports.afterEach) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.setDefaults(testDir)](#module_testHelpers.setDefaults)

<a name="module_testHelpers.exports.createTempDir"></a>

### testHelpers.exports.createTempDir ⇒ <code>Promise.&lt;(\*\|void)&gt;</code>
Ensure that the del has completed, recursively attempt to delete and recreate

**Kind**: static property of [<code>testHelpers</code>](#module_testHelpers)  

| Param | Type | Default |
| --- | --- | --- |
| [exists] | <code>boolean</code> | <code>true</code> | 

<a name="module_testHelpers.exports.beforeEach"></a>

### testHelpers.exports.beforeEach ⇒ <code>Promise.&lt;(\*\|void)&gt;</code>
In the Jest.beforeEach function call this one to set up the temp directory.

**Kind**: static property of [<code>testHelpers</code>](#module_testHelpers)  
<a name="module_testHelpers.exports.afterEach"></a>

### testHelpers.exports.afterEach ⇒ <code>Promise.&lt;\*&gt;</code>
In the Jest.afterEach function call this one to clean up and remove the temp directory.

**Kind**: static property of [<code>testHelpers</code>](#module_testHelpers)  
<a name="module_testHelpers.setDefaults"></a>

### testHelpers.setDefaults(testDir)
Update the gulp configurations with the test data. Set the test directory where temp files will be created for testing.

**Kind**: static method of [<code>testHelpers</code>](#module_testHelpers)  

| Param | Type | Default |
| --- | --- | --- |
| testDir | <code>string</code> | <code>&quot;test-temp&quot;</code> | 

<a name="module_partials"></a>

## partials
Micro-functions used as components for the main gulp functions.

**Version**: 3.0.0  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [partials](#module_partials)
    * [.tsFor([srcPath], [distPath])](#module_partials.tsFor) ⇒ <code>function</code>
    * [.sassFor([srcSearch], [cssPath])](#module_partials.sassFor) ⇒ <code>stream.Stream</code>
    * [.runOnChange(path)](#module_partials.runOnChange) ⇒ <code>stream.Stream</code>
        * [~pathRegex](#module_partials.runOnChange..pathRegex)
    * [.removeDirectory(dirPath)](#module_partials.removeDirectory) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.readmeTemplate()](#module_partials.readmeTemplate) ⇒ <code>\*</code>
    * [.minifyFor()](#module_partials.minifyFor) ⇒ <code>\*</code>
    * [.imagesFor([imageSrc], [imageDest])](#module_partials.imagesFor) ⇒ <code>stream.Stream</code>
    * [.distSeries([srcPath], [distFinalPath], [tsSearch])](#module_partials.distSeries) ⇒ <code>function</code>
    * [.distForSrc([useTs])](#module_partials.distForSrc) ⇒ <code>string</code>
    * [.distFor([srcPath], [destPath])](#module_partials.distFor) ⇒ <code>stream.Stream</code>
    * [.copyFor(srcPath, destPath)](#module_partials.copyFor) ⇒ <code>stream.Stream</code>
    * [.clean()](#module_partials.clean) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> \| <code>\*</code>
    * [.beginWatcher()](#module_partials.beginWatcher) ⇒ <code>FSWatcher</code>
    * [.addToReadme()](#module_partials.addToReadme) ⇒ <code>string</code> \| <code>Uint8Array</code>

<a name="module_partials.tsFor"></a>

### partials.tsFor([srcPath], [distPath]) ⇒ <code>function</code>
Starting at the source directory, find all the ts files and convert them into the distribution directory.

**Kind**: static method of [<code>partials</code>](#module_partials)  
**See**: `https://www.typescriptlang.org/docs/handbook/gulp.html` for more info  

| Param | Type | Default |
| --- | --- | --- |
| [srcPath] | <code>string</code> \| <code>array</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [distPath] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 

<a name="module_partials.sassFor"></a>

### partials.sassFor([srcSearch], [cssPath]) ⇒ <code>stream.Stream</code>
Build the CSS for a given source pattern.

**Kind**: static method of [<code>partials</code>](#module_partials)  

| Param | Type | Default |
| --- | --- | --- |
| [srcSearch] | <code>string</code> \| <code>array</code> | <code>&quot;&#x27;src/config/path/sass/for&#x27;&quot;</code> | 
| [cssPath] | <code>string</code> | <code>&quot;&#x27;css/config/path&#x27;&quot;</code> | 

<a name="module_partials.runOnChange"></a>

### partials.runOnChange(path) ⇒ <code>stream.Stream</code>
Run this function when the watched files are modified.1. Find the sub-folders within src path2. Maintain the folders, but use distPath for base3. Remove base folder and return dist path with correct sub-folders

**Kind**: static method of [<code>partials</code>](#module_partials)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 

**Example**  
```js
// Configured pathsdistPath = 'dist'srcPath = 'functions'// Path parameterpath = 'functions/some/path/file.js'// Generated regex using configured srcPathpathRegex = '/^functions(.*\/).+\.js$/i'// Replace value using the configured distPathreplacePath = 'dist$1'// The resulting replaced path for the destination folderdistPathResult = 'dist/some/path/'
```
<a name="module_partials.runOnChange..pathRegex"></a>

#### runOnChange~pathRegex
1. The original path comes in from src and is a .ts2. Discover the outgoing dist path where that file should go3. Use the path and dist in tsFor4. Take the original path, convert to full file path in dist5. Use the dist path found previously in #26. Use the full dist path and the dist outgoing path in distFor

**Kind**: inner constant of [<code>runOnChange</code>](#module_partials.runOnChange)  
<a name="module_partials.removeDirectory"></a>

### partials.removeDirectory(dirPath) ⇒ <code>Promise.&lt;\*&gt;</code>
Return a promise to be completed once the specified directory is deleted.

**Kind**: static method of [<code>partials</code>](#module_partials)  

| Param | Type |
| --- | --- |
| dirPath | <code>string</code> | 

<a name="module_partials.readmeTemplate"></a>

### partials.readmeTemplate() ⇒ <code>\*</code>
Copy a readme template into the README.md file.

**Kind**: static method of [<code>partials</code>](#module_partials)  
<a name="module_partials.minifyFor"></a>

### partials.minifyFor() ⇒ <code>\*</code>
Minify files and rename the output with '.min' extension.

**Kind**: static method of [<code>partials</code>](#module_partials)  
<a name="module_partials.imagesFor"></a>

### partials.imagesFor([imageSrc], [imageDest]) ⇒ <code>stream.Stream</code>
Move and optimize images into the browser directory.

**Kind**: static method of [<code>partials</code>](#module_partials)  

| Param | Type | Default |
| --- | --- | --- |
| [imageSrc] | <code>string</code> \| <code>array</code> | <code>&quot;src/images/pattern&quot;</code> | 
| [imageDest] | <code>string</code> | <code>&quot;dest/image/folder&quot;</code> | 

<a name="module_partials.distSeries"></a>

### partials.distSeries([srcPath], [distFinalPath], [tsSearch]) ⇒ <code>function</code>
When using TypeScript, ensure that we process the ts first then run babel (dist)

**Kind**: static method of [<code>partials</code>](#module_partials)  

| Param | Type | Default |
| --- | --- | --- |
| [srcPath] | <code>string</code> | <code>&quot;&#x27;src/config/path/dist/for&#x27;&quot;</code> | 
| [distFinalPath] | <code>string</code> | <code>&quot;&#x27;dist/config/path&#x27;&quot;</code> | 
| [tsSearch] | <code>string</code> | <code>&quot;&#x27;ts/search/config/path&#x27;&quot;</code> | 

<a name="module_partials.distForSrc"></a>

### partials.distForSrc([useTs]) ⇒ <code>string</code>
Retrieve the correct distFor search path based on TS Config.

**Kind**: static method of [<code>partials</code>](#module_partials)  

| Param | Type | Default |
| --- | --- | --- |
| [useTs] | [<code>FlagStringSetting</code>](#module_gulpConfig..FlagStringSetting) | <code>&#x27;config/for/ts&#x27;</code> | 

<a name="module_partials.distFor"></a>

### partials.distFor([srcPath], [destPath]) ⇒ <code>stream.Stream</code>
Build the distribution for a given source pattern.

**Kind**: static method of [<code>partials</code>](#module_partials)  

| Param | Type | Default |
| --- | --- | --- |
| [srcPath] | <code>string</code> \| <code>array</code> | <code>&quot;&#x27;src/config/path/dist/for&#x27;&quot;</code> | 
| [destPath] | <code>string</code> | <code>&quot;&#x27;dist/config/path&#x27;&quot;</code> | 

<a name="module_partials.copyFor"></a>

### partials.copyFor(srcPath, destPath) ⇒ <code>stream.Stream</code>
Copy some files to a different location.

**Kind**: static method of [<code>partials</code>](#module_partials)  

| Param | Type |
| --- | --- |
| srcPath | <code>string</code> \| <code>array</code> | 
| destPath | <code>string</code> | 

<a name="module_partials.clean"></a>

### partials.clean() ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> \| <code>\*</code>
Deletes all the distribution and browser files (used before create a new build).Configure array of directories to remove with 'cleanPaths'.

**Kind**: static method of [<code>partials</code>](#module_partials)  
<a name="module_partials.beginWatcher"></a>

### partials.beginWatcher() ⇒ <code>FSWatcher</code>
Create a chokidar instance which watches and triggers change when the globed files are modified.

**Kind**: static method of [<code>partials</code>](#module_partials)  
<a name="module_partials.addToReadme"></a>

### partials.addToReadme() ⇒ <code>string</code> \| <code>Uint8Array</code>
Appends all the jsdoc comments to the readme file. Assumes empty or templated file.Configure this with 'readmeSearch', 'readmePath', 'readmeFile', and 'readmeOptions'.

**Kind**: static method of [<code>partials</code>](#module_partials)  
