"use strict";

/**
 * Sample NodeTree for testing circular references and arrays.
 * @memberOf module:testHelpers
 * @type {Object.<string, string|Object|Array>}
 */
var nodeTree = {
  name: 'one',
  parent: null,
  children: []
};
nodeTree.children[0] = {
  name: 'child one',
  parent: nodeTree,
  children: []
};
nodeTree.children[1] = {
  name: 'child two',
  parent: nodeTree,
  children: []
};
nodeTree.children[0].children[0] = {
  name: 'grandchild one',
  parent: nodeTree.children[0],
  children: []
};
module.exports = nodeTree;