'use strict'

var circularObject = require('./test-helpers/circurlarObject')
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
  circularObject: circularObject,
  countMatches: countMatches,
  deepReferenceObject: deepReferenceObject,
  domItem: domItem,
  jsonDom: jsonDom,
  linkedList: linkedList,
  logObject: logObject,
  multiReferenceObject: multiReferenceObject,
  nodeTree: nodeTree,
  setUp: setUp
}
