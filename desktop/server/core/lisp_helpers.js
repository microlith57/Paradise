'use strict'

const helpers = require('./helpers')
const errors  = require('./errors')
const Error   = require('./error')
const Vessel  = require('./vessel')

const _prepare_lisp = function prepare_lisp (a, def = helpers.nil) {
  if (a == null || (typeof a === 'number' && isNaN(a)) || a === false) {
    return def
  } else if (typeof a === 'function') {
    a = a()
  }
  if (a instanceof Error) {
    return a
    // TODO: allow this case to break out of a function early, carrying the error further
    //       Maybe even use `raise`
  }
  return a
}

const _vessel_from_id = function vessel_from_id (context, card, id, def = helpers.nil) {
  id = _prepare_lisp(id, def)
  if (typeof id === 'number' && Number.isInteger(id)) {
    const target = context.host.paradise.world[id]
    if (target) {
      return target
    } else {
      return errors.lisp.UNKNOWN(card, `vessel #${id}`)
    }
  } else {
    return helpers.nil // TODO: Raise error
  }
}

module.exports = {
  prepare_lisp: _prepare_lisp,
  vessel_from_id: _vessel_from_id,
}
