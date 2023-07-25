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

<a name="module_testHelpers"></a>

## testHelpers
An assortment of objects that can be used in tests and some functions to help debug and write tests.

**Version**: 2.0.0  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [testHelpers](#module_testHelpers)
    * [.nodeTree](#module_testHelpers.nodeTree) : <code>Object.&lt;string, (string\|Object\|Array)&gt;</code>
    * [.multiReferenceObject](#module_testHelpers.multiReferenceObject) : <code>Object.&lt;string, (string\|number\|Object)&gt;</code>
    * [.linkedList](#module_testHelpers.linkedList) : <code>Object.&lt;string, (string\|Object)&gt;</code>
    * [.jsonDom](#module_testHelpers.jsonDom) : <code>Object.&lt;string, (string\|number\|Array\|Object)&gt;</code>
    * [.domItem](#module_testHelpers.domItem) : <code>Object.&lt;string, (string\|number\|Array\|Object)&gt;</code>
    * [.deepReferenceObject](#module_testHelpers.deepReferenceObject) : <code>Object.&lt;string, (string\|number\|Object)&gt;</code>
    * [.circularObject](#module_testHelpers.circularObject) : <code>Object.&lt;string, (string\|Object\|Array)&gt;</code>
    * [.createTempDir([exists])](#module_testHelpers.createTempDir) ⇒ <code>Promise.&lt;(\*\|void)&gt;</code>
    * [.exports.beforeEach()](#module_testHelpers.exports.beforeEach) ⇒ <code>Promise.&lt;(\*\|void)&gt;</code>
    * [.exports.afterEach()](#module_testHelpers.exports.afterEach) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.logObject(object, [label], [outputType])](#module_testHelpers.logObject) ⇒ <code>string</code> \| <code>undefined</code>
    * [.countMatches(content, search)](#module_testHelpers.countMatches) ⇒ <code>number</code>

<a name="module_testHelpers.nodeTree"></a>

### testHelpers.nodeTree : <code>Object.&lt;string, (string\|Object\|Array)&gt;</code>
Sample NodeTree for testing circular references and arrays.

**Kind**: static constant of [<code>testHelpers</code>](#module_testHelpers)  
<a name="module_testHelpers.multiReferenceObject"></a>

### testHelpers.multiReferenceObject : <code>Object.&lt;string, (string\|number\|Object)&gt;</code>
Sample of object containing multiple references.

**Kind**: static constant of [<code>testHelpers</code>](#module_testHelpers)  
<a name="module_testHelpers.linkedList"></a>

### testHelpers.linkedList : <code>Object.&lt;string, (string\|Object)&gt;</code>
Sample LinkedList for testing circular references.

**Kind**: static constant of [<code>testHelpers</code>](#module_testHelpers)  
<a name="module_testHelpers.jsonDom"></a>

### testHelpers.jsonDom : <code>Object.&lt;string, (string\|number\|Array\|Object)&gt;</code>
Sample of jsonDom object containing empty nested array and objects

**Kind**: static constant of [<code>testHelpers</code>](#module_testHelpers)  
<a name="module_testHelpers.domItem"></a>

### testHelpers.domItem : <code>Object.&lt;string, (string\|number\|Array\|Object)&gt;</code>
Sample of domItem child with nested child and optional details

**Kind**: static constant of [<code>testHelpers</code>](#module_testHelpers)  
<a name="module_testHelpers.deepReferenceObject"></a>

### testHelpers.deepReferenceObject : <code>Object.&lt;string, (string\|number\|Object)&gt;</code>
Sample object with deep references.

**Kind**: static constant of [<code>testHelpers</code>](#module_testHelpers)  
<a name="module_testHelpers.circularObject"></a>

### testHelpers.circularObject : <code>Object.&lt;string, (string\|Object\|Array)&gt;</code>
Multilayered node tree-like structure with parent references

**Kind**: static constant of [<code>testHelpers</code>](#module_testHelpers)  
<a name="module_testHelpers.createTempDir"></a>

### testHelpers.createTempDir([exists]) ⇒ <code>Promise.&lt;(\*\|void)&gt;</code>
Ensure that the del has completed, recursively attempt to delete and recreate

**Kind**: static method of [<code>testHelpers</code>](#module_testHelpers)  

| Param | Type | Default |
| --- | --- | --- |
| [exists] | <code>boolean</code> | <code>true</code> | 

<a name="module_testHelpers.exports.beforeEach"></a>

### testHelpers.exports.beforeEach() ⇒ <code>Promise.&lt;(\*\|void)&gt;</code>
In the Jest.beforeEach function call this one to set up the temp directory.

**Kind**: static method of [<code>testHelpers</code>](#module_testHelpers)  
<a name="module_testHelpers.exports.afterEach"></a>

### testHelpers.exports.afterEach() ⇒ <code>Promise.&lt;\*&gt;</code>
In the Jest.afterEach function call this one to clean up and remove the temp directory.

**Kind**: static method of [<code>testHelpers</code>](#module_testHelpers)  
<a name="module_testHelpers.logObject"></a>

### testHelpers.logObject(object, [label], [outputType]) ⇒ <code>string</code> \| <code>undefined</code>
Log out an object in a nicely formatted way.

**Kind**: static method of [<code>testHelpers</code>](#module_testHelpers)  

| Param | Type | Default |
| --- | --- | --- |
| object | <code>Object</code> |  | 
| [label] | <code>string</code> | <code>&quot;&#x27;logging&#x27;&quot;</code> | 
| [outputType] | <code>string</code> | <code>&quot;&#x27;log&#x27;&quot;</code> | 

<a name="module_testHelpers.countMatches"></a>

### testHelpers.countMatches(content, search) ⇒ <code>number</code>
Simple way to count string occurrences for testing.

**Kind**: static method of [<code>testHelpers</code>](#module_testHelpers)  

| Param | Type |
| --- | --- |
| content | <code>string</code> | 
| search | <code>string</code> | 

