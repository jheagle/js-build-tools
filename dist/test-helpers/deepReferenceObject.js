"use strict";

/**
 * Sample object with deep references.
 * @memberOf module:testHelpers
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
};
module.exports = deepReferenceObject;