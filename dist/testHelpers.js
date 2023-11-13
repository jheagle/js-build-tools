'use strict'

/**
 * An assortment of objects that can be used in tests and some functions to help debug and write tests.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 2.0.0
 * @module testHelpers
 * @memberOf module:js-build-tools
 */

var circularObject = require('./test-helpers/circularObject')
var countMatches = require('./test-helpers/countMatches')
var deepReferenceObject = require('./test-helpers/deepReferenceObject')
var domItem = require('./test-helpers/domItem')
var jsonDom = require('./test-helpers/jsonDom')
var linkedList = require('./test-helpers/linkedList')
var logObject = require('./test-helpers/logObject')
var multiReferenceObject = require('./test-helpers/multiReferenceObject')
var nodeTree = require('./test-helpers/nodeTree')
var setUp = require('./test-helpers/setUp')
module.exports = {
  circularObject,
  countMatches,
  deepReferenceObject,
  domItem,
  jsonDom,
  linkedList,
  logObject,
  multiReferenceObject,
  nodeTree,
  setUp
}
