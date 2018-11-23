'use strict'

const helpers = require('./helpers')
const errors  = require('./errors')
const Error   = require('./error')
const Vessel  = require('./vessel')

function _prepare_lisp (a) {
  if (a == null || isNaN(a) || a === false) {
    return helpers.nil
  } else if (typeof input === 'function') {
    a = a()
  }
  if (a instanceof Error) {
    // TODO: allow this case to break out of a function early, carrying the error further
  }
  return a
}

function _vessel_from_id (context, id) {
  id = _prepare_lisp(id)
  if (typeof id === 'number' && Number.isInteger(id)) {
    const target = context.host.paradise.world[id]
    if (target) {
      return target
    } else {
      return errors.lisp.UNKNOWN(`vessel #${id}`)
    }
  } else {
    return helpers.nil // TODO: Raise error
  }
}
