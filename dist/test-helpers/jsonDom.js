"use strict";

/**
 * Sample of jsonDom object containing empty nested array and objects
 * @memberOf module:testHelpers
 * @type {Object.<string, string|number|Array|Object>}
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
};
module.exports = jsonDom;