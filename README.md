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
  distSearch: 'dist/**/*.js',

  // The file which will be pre-fixed to your README.md output.
  readmeTemplate: 'MAIN.md',

  // The directory where your source files are stored (the files you manually created).
  srcPath: 'src',

  // The search pattern used for gathering source files for distribution.
  srcSearch: 'src/**/!(*.test).js',

  // The directory where Jest test files are stored.
  // By default stored as *.test.js adjacent with the files they are testing).
  testPath: 'src',
  
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

## Constants

<dl>
<dt><a href="#build">build</a></dt>
<dd><p>Runs several processes to build and validate the project.
Cleans, distributes (lint and minify), bundles (lint and minify), creates the readme, then runs the tests.</p>
</dd>
<dt><a href="#compileReadme">compileReadme</a></dt>
<dd><p>Generate the README.md file based off of the template, then append the generated documentation.</p>
</dd>
<dt><a href="#defaultCmd">defaultCmd</a></dt>
<dd><p>Recommended as the default task, runs the simple dist and bundle tasks.</p>
</dd>
<dt><a href="#logObject">logObject</a></dt>
<dd><p>Log out an object in a nicely formatted way.</p>
</dd>
<dt><a href="#circularObject">circularObject</a> : <code>Object.&lt;string, (string|Object|Array)&gt;</code></dt>
<dd><p>Multilayered node tree-like structure with parent references</p>
</dd>
<dt><a href="#deepReferenceObject">deepReferenceObject</a> : <code>Object.&lt;string, (string|number|Object)&gt;</code></dt>
<dd><p>Sample object with deep references.</p>
</dd>
<dt><a href="#linkedList">linkedList</a> : <code>Object.&lt;string, (string|Object)&gt;</code></dt>
<dd><p>Sample LinkedList for testing circular references.</p>
</dd>
<dt><a href="#jsonDom">jsonDom</a></dt>
<dd><p>Sample of jsonDom object containing empty nested array and objects</p>
</dd>
<dt><a href="#domItem">domItem</a></dt>
<dd><p>Sample of domItem child with nested child and optional details</p>
</dd>
<dt><a href="#multiReferenceObject">multiReferenceObject</a> : <code>Object.&lt;string, (string|number|Object)&gt;</code></dt>
<dd><p>Sample of object containing multiple references.</p>
</dd>
<dt><a href="#nodeTree">nodeTree</a> : <code>Object.&lt;string, (string|Object|Array)&gt;</code></dt>
<dd><p>Sample NodeTree for testing circular references and arrays.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#addToReadme">addToReadme()</a> ⇒ <code>string</code> | <code>Uint8Array</code></dt>
<dd><p>Appends all the jsdoc comments to the readme file. Assumes empty or templated file.</p>
</dd>
<dt><a href="#bundle">bundle()</a> ⇒ <code>*</code></dt>
<dd><p>Starting at the distribution entry point, bundle all the files into a single file and store them in the specified output directory.</p>
</dd>
<dt><a href="#bundleLint">bundleLint()</a> ⇒ <code>*</code></dt>
<dd><p>Applies Standard code style linting to bundled file.</p>
</dd>
<dt><a href="#bundleMinify">bundleMinify()</a> ⇒ <code>*</code></dt>
<dd><p>Creates the minified bundle file.</p>
</dd>
<dt><a href="#clean">clean()</a> ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> | <code>*</code></dt>
<dd><p>Deletes all the distribution and browser files (used before create a new build).</p>
</dd>
<dt><a href="#dist">dist()</a> ⇒ <code>*</code></dt>
<dd><p>Simplified distribution tasks which will use arguments from distFor.</p>
</dd>
<dt><a href="#distFor">distFor(srcPath, destPath)</a> ⇒ <code>*</code></dt>
<dd><p>Build the distribution for a given source pattern.</p>
</dd>
<dt><a href="#distLint">distLint()</a> ⇒ <code>*</code></dt>
<dd><p>Applies Standard code style linting to distribution files.</p>
</dd>
<dt><a href="#distMinify">distMinify()</a> ⇒ <code>*</code></dt>
<dd><p>Creates minified versions of the dist files.</p>
</dd>
<dt><a href="#readmeTemplate">readmeTemplate()</a> ⇒ <code>*</code></dt>
<dd><p>Copy a readme template into the README.md file.</p>
</dd>
<dt><a href="#testFull">testFull()</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd><p>Run all tests with jest.</p>
</dd>
<dt><a href="#testQuick">testQuick()</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd><p>Run the Jest tests for files which have been modified (based on git status).</p>
</dd>
<dt><a href="#watchFull">watchFull()</a> ⇒ <code>*</code></dt>
<dd><p>Watch for changes and run the distribution for the changed files, then bundle and test the changed files.</p>
</dd>
<dt><a href="#watchTest">watchTest()</a> ⇒ <code>*</code></dt>
<dd><p>Watch for changes and run the tests.</p>
</dd>
</dl>

<a name="build"></a>

## build
Runs several processes to build and validate the project.
Cleans, distributes (lint and minify), bundles (lint and minify), creates the readme, then runs the tests.

**Kind**: global constant  
<a name="compileReadme"></a>

## compileReadme
Generate the README.md file based off of the template, then append the generated documentation.

**Kind**: global constant  
<a name="defaultCmd"></a>

## defaultCmd
Recommended as the default task, runs the simple dist and bundle tasks.

**Kind**: global constant  
<a name="logObject"></a>

## logObject
Log out an object in a nicely formatted way.

**Kind**: global constant  

| Param | Type | Default |
| --- | --- | --- |
| object | <code>Object</code> |  | 
| [label] | <code>string</code> | <code>&quot;&#x27;logging&#x27;&quot;</code> | 

<a name="circularObject"></a>

## circularObject : <code>Object.&lt;string, (string\|Object\|Array)&gt;</code>
Multilayered node tree-like structure with parent references

**Kind**: global constant  
<a name="deepReferenceObject"></a>

## deepReferenceObject : <code>Object.&lt;string, (string\|number\|Object)&gt;</code>
Sample object with deep references.

**Kind**: global constant  
<a name="linkedList"></a>

## linkedList : <code>Object.&lt;string, (string\|Object)&gt;</code>
Sample LinkedList for testing circular references.

**Kind**: global constant  
<a name="jsonDom"></a>

## jsonDom
Sample of jsonDom object containing empty nested array and objects

**Kind**: global constant  
<a name="domItem"></a>

## domItem
Sample of domItem child with nested child and optional details

**Kind**: global constant  
<a name="multiReferenceObject"></a>

## multiReferenceObject : <code>Object.&lt;string, (string\|number\|Object)&gt;</code>
Sample of object containing multiple references.

**Kind**: global constant  
<a name="nodeTree"></a>

## nodeTree : <code>Object.&lt;string, (string\|Object\|Array)&gt;</code>
Sample NodeTree for testing circular references and arrays.

**Kind**: global constant  
<a name="addToReadme"></a>

## addToReadme() ⇒ <code>string</code> \| <code>Uint8Array</code>
Appends all the jsdoc comments to the readme file. Assumes empty or templated file.

**Kind**: global function  
<a name="bundle"></a>

## bundle() ⇒ <code>\*</code>
Starting at the distribution entry point, bundle all the files into a single file and store them in the specified output directory.

**Kind**: global function  
<a name="bundleLint"></a>

## bundleLint() ⇒ <code>\*</code>
Applies Standard code style linting to bundled file.

**Kind**: global function  
<a name="bundleMinify"></a>

## bundleMinify() ⇒ <code>\*</code>
Creates the minified bundle file.

**Kind**: global function  
<a name="clean"></a>

## clean() ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> \| <code>\*</code>
Deletes all the distribution and browser files (used before create a new build).

**Kind**: global function  
<a name="dist"></a>

## dist() ⇒ <code>\*</code>
Simplified distribution tasks which will use arguments from distFor.

**Kind**: global function  
<a name="distFor"></a>

## distFor(srcPath, destPath) ⇒ <code>\*</code>
Build the distribution for a given source pattern.

**Kind**: global function  

| Param | Type |
| --- | --- |
| srcPath | <code>string</code> \| <code>array</code> | 
| destPath | <code>string</code> | 

<a name="distLint"></a>

## distLint() ⇒ <code>\*</code>
Applies Standard code style linting to distribution files.

**Kind**: global function  
<a name="distMinify"></a>

## distMinify() ⇒ <code>\*</code>
Creates minified versions of the dist files.

**Kind**: global function  
<a name="readmeTemplate"></a>

## readmeTemplate() ⇒ <code>\*</code>
Copy a readme template into the README.md file.

**Kind**: global function  
<a name="testFull"></a>

## testFull() ⇒ <code>Promise.&lt;\*&gt;</code>
Run all tests with jest.

**Kind**: global function  
<a name="testQuick"></a>

## testQuick() ⇒ <code>Promise.&lt;\*&gt;</code>
Run the Jest tests for files which have been modified (based on git status).

**Kind**: global function  
<a name="watchFull"></a>

## watchFull() ⇒ <code>\*</code>
Watch for changes and run the distribution for the changed files, then bundle and test the changed files.

**Kind**: global function  
<a name="watchTest"></a>

## watchTest() ⇒ <code>\*</code>
Watch for changes and run the tests.

**Kind**: global function  
