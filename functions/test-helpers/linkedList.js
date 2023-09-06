/**
 * Sample LinkedList for testing circular references.
 * @memberOf module:testHelpers
 * @type {Object.<string, string|Object>}
 */
const linkedList = { name: 'one', prev: null, next: null }
linkedList.next = { name: 'two', prev: linkedList, next: null }
linkedList.next.next = { name: 'three', prev: linkedList.next, next: null }

module.exports = linkedList
