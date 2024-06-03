'use strict'

require('core-js/modules/esnext.weak-map.delete-all.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.testHelpers = void 0
var _testHelpers = _interopRequireWildcard(require('./test-helpers/setUp.js'))
exports.testHelpers = _testHelpers
function _getRequireWildcardCache (e) { if (typeof WeakMap !== 'function') return null; var r = new WeakMap(); var t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r })(e) }
function _interopRequireWildcard (e, r) { if (!r && e && e.__esModule) return e; if (e === null || typeof e !== 'object' && typeof e !== 'function') return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }; var a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if (u !== 'default' && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u] } return n.default = e, t && t.set(e, n), n }
