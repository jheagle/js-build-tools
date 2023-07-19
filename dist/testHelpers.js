'use strict'

require('core-js/modules/es.object.define-property.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.nodeTree = exports.multiReferenceObject = exports.logObject = exports.linkedList = exports.jsonDom = exports.domItem = exports.deepReferenceObject = exports.countMatches = exports.circularObject = void 0
require('core-js/modules/es.regexp.exec.js')
require('core-js/modules/es.string.split.js')
require('core-js/modules/es.json.stringify.js')
/**
 * Simple way to count string occurrences for testing.
 * @param {string} content
 * @param {string} search
 * @returns {number}
 */
var countMatches = function countMatches (content, search) {
  return content.split(search).length - 1
}

/**
 * Log out an object in a nicely formatted way.
 * @param {Object} object
 * @param {string} [label='logging']
 * @param {string} [outputType='log']
 * @returns {string|undefined}
 */
exports.countMatches = countMatches
var logObject = function logObject (object) {
  var label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'logging'
  var outputType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'log'
  var logger = outputType === 'string' ? function (label, object) {
    return "'".concat(label, "' | ") + JSON.stringify(object)
  } : console[outputType]
  if (typeof require === 'undefined' || outputType === 'string') {
    return logger(label, object)
  }
  return logger(label, require('util').inspect(object, false, null, true))
}

/**
 * Multilayered node tree-like structure with parent references
 * @type {Object.<string, string|Object|Array>}
 */
exports.logObject = logObject
var circularObject = {
  name: 'root',
  parent: {},
  body: {},
  head: {},
  children: []
}
exports.circularObject = circularObject
circularObject.children = [{
  name: 'body',
  parent: {},
  children: []
}, {
  name: 'head',
  parent: {},
  children: []
}]
circularObject.body = circularObject.children[0]
circularObject.head = circularObject.children[1]
circularObject.body.parent = circularObject
circularObject.head.parent = circularObject
circularObject.body.children = [{
  name: 'body child one',
  parent: {},
  children: []
}, {
  name: 'body child two',
  parent: {},
  children: []
}]
circularObject.body.children[0].parent = circularObject.body
circularObject.body.children[1].parent = circularObject.body
circularObject.head.children = [{
  name: 'head child one',
  parent: {},
  children: []
}, {
  name: 'head child two',
  parent: {},
  children: []
}]
circularObject.head.children[0].parent = circularObject.head
circularObject.head.children[1].parent = circularObject.head

/**
 * Sample object with deep references.
 * @type {Object.<string, string|number|Object>}
 */
var deepReferenceObject = {
  object1: {
    name: 'someName',
    object2: {
      age: 12,
      array1: ['someString', 'anotherString']
    },
    array2: [89, 32]
  },
  title: 'Some Title',
  item: 45
}

/**
 * Sample LinkedList for testing circular references.
 * @type {Object.<string, string|Object>}
 */
exports.deepReferenceObject = deepReferenceObject
var linkedList = {
  name: 'one',
  prev: null,
  next: null
}
exports.linkedList = linkedList
linkedList.next = {
  name: 'two',
  prev: linkedList,
  next: null
}
linkedList.next.next = {
  name: 'three',
  prev: linkedList.next,
  next: null
}

/**
 * Sample of jsonDom object containing empty nested array and objects
 */
var jsonDom = {
  tagName: 'div',
  attributes: {
    style: {},
    className: 'column'
  },
  element: null,
  eventListeners: {},
  parentItem: {},
  children: [],
  axis: 'x'
}

/**
 * Sample of domItem child with nested child and optional details
 */
exports.jsonDom = jsonDom
var domItem = [{
  attributes: {
    className: 'row',
    style: {}
  },
  axis: 'y',
  children: [{
    attributes: {
      style: {}
    },
    axis: 'x',
    children: [],
    element: {},
    eventListeners: {},
    hasShip: false,
    isHit: false,
    parentItem: {},
    point: {},
    tagName: 'div'
  }],
  element: null,
  eventListeners: {},
  parentItem: {},
  tagName: 'div'
}]

/**
 * Sample of object containing multiple references.
 * @type {Object.<string, string|number|Object>}
 */
exports.domItem = domItem
var multiReferenceObject = {
  object1: {
    name: 'someName'
  },
  object2: {
    age: 12
  },
  array1: ['someString', 'anotherString'],
  array2: [89, 32],
  title: 'Some Title',
  item: 45
}

/**
 * Sample NodeTree for testing circular references and arrays.
 * @type {Object.<string, string|Object|Array>}
 */
exports.multiReferenceObject = multiReferenceObject
var nodeTree = {
  name: 'one',
  parent: null,
  children: []
}
exports.nodeTree = nodeTree
nodeTree.children[0] = {
  name: 'child one',
  parent: nodeTree,
  children: []
}
nodeTree.children[1] = {
  name: 'child two',
  parent: nodeTree,
  children: []
}
nodeTree.children[0].children[0] = {
  name: 'grandchild one',
  parent: nodeTree.children[0],
  children: []
}
