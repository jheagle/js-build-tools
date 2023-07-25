"use strict";

/**
 * Multilayered node tree-like structure with parent references
 * @memberOf module:testHelpers
 * @type {Object.<string, string|Object|Array>}
 */
var circularObject = {
  name: 'root',
  parent: {},
  body: {},
  head: {},
  children: []
};
circularObject.children = [{
  name: 'body',
  parent: {},
  children: []
}, {
  name: 'head',
  parent: {},
  children: []
}];
circularObject.body = circularObject.children[0];
circularObject.head = circularObject.children[1];
circularObject.body.parent = circularObject;
circularObject.head.parent = circularObject;
circularObject.body.children = [{
  name: 'body child one',
  parent: {},
  children: []
}, {
  name: 'body child two',
  parent: {},
  children: []
}];
circularObject.body.children[0].parent = circularObject.body;
circularObject.body.children[1].parent = circularObject.body;
circularObject.head.children = [{
  name: 'head child one',
  parent: {},
  children: []
}, {
  name: 'head child two',
  parent: {},
  children: []
}];
circularObject.head.children[0].parent = circularObject.head;
circularObject.head.children[1].parent = circularObject.head;
module.exports = circularObject;