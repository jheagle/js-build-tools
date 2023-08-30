'use strict'

/**
 * An assortment of objects that can be used in tests and some functions to help debug and write tests.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 2.0.0
 * @module testHelpers
 * @memberOf module:js-build-tools
 */

const circularObject = require('./test-helpers/circularObject')
const countMatches = require('./test-helpers/countMatches')
const deepReferenceObject = require('./test-helpers/deepReferenceObject')
const domItem = require('./test-helpers/domItem')
const jsonDom = require('./test-helpers/jsonDom')
const linkedList = require('./test-helpers/linkedList')
const logObject = require('./test-helpers/logObject')
const multiReferenceObject = require('./test-helpers/multiReferenceObject')
const nodeTree = require('./test-helpers/nodeTree')
const setUp = require('./test-helpers/setUp')
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
