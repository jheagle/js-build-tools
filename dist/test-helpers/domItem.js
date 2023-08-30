"use strict";

/**
 * Sample of domItem child with nested child and optional details
 * @memberOf module:testHelpers
 * @type {Object.<string, string|number|Array|Object>}
 */
const domItem = [{
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
}];
module.exports = domItem;