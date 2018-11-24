'use strict'

const lisp_helpers = require('../core/lisp_helpers')
const helpers = require('../core/helpers')
const errors  = require('../core/errors')
const Error   = require('../core/error')

const _lib = [

  {
    props: ["vessel", ['id', 'field'], 'Return the data field `field` of the specified vessel by ID.'],
    func: function (context, id, field) {
      const target = lisp_helpers.vessel_from_id(context, 'vessel', id, errors.lisp.UNKNOWN('vessel'))
      if (target === helpers.nil || target instanceof Error) {
        return target
      }
      field = lisp_helpers.prepare_lisp(field, "name")
      if (field === helpers.nil || field instanceof Error) {
        return field
      }
      return field && target.data[field] ? target.data[field] : target
    }
  },

  // TODO: Use lisp_helpers
  // REVIEW
  {
    props: ["carry", ['id', 'target'], 'Return "true" if the vessel "id" is carrying the target (or nil if not).'],
    func: function (context, id, target) {
      if (typeof id === 'function') { id = id() }
      const children = context.host.children()
      for (const i in children) {
        if (children[i].is(target)) { return `true` }
      }
      return helpers.nil
    }
  },

  {
    props: ["self", [], 'The current vessel\'s ID.'],
    func: function (context) {
      return context.host.id
    }
  },

  {
    props: ["parent", ['id = self'], 'The vessel\'s parent\'s ID.'],
    func: function (context, id) {
      const target = lisp_helpers.vessel_from_id(context, 'parent', id, context.host.id)
      return target.parent().id
    }
  },

  {
    props: ["stem", ['id = self'], 'The current vessel\'s stem'],
    func: function (context, id) {
      const target = lisp_helpers.vessel_from_id(context, 'stem', id, context.host.id)
      return target.stem().id
    }
  },

  // TODO: usables  - takes list, returns list

  {
    props: ["siblings", ['id = self'], 'The given vessel\'s siblings'],
    func: function (context, id) {
      const target = lisp_helpers.vessel_from_id(context, 'siblings', id, context.host.id)
      return target.siblings().map(function (sibling) {
        return sibling.id
      })
    }
  },

  {
    props: ["children", ['id = self'], 'The given vessel\'s children'],
    func: function (context, id) {
      const target = lisp_helpers.vessel_from_id(context, 'children', id, context.host.id)
      return target.children().map(function (child) {
        return child.id
      })
    }
  },

  // TODO: clean up the id checks; put in helpers.js

  {
    props: ["is_paradox", ['id = self'], 'Is the given vessel a paradox?'],
    func: function (context, id) {
      const target = lisp_helpers.vessel_from_id(context, 'is_paradox', id, context.host.id)
      return target.isParadox() ? 'true' : helpers.nil
    }
  },

  {
    props: ["is_program", ['id = self'], 'Is the given vessel a program?'],
    func: function (context, id) {
      const target = lisp_helpers.vessel_from_id(context, 'is_program', id, context.host.id)
      return target.is_program() ? 'true' : helpers.nil
    }
  },

  {
    props: ["is_usable", ['id = self'], 'Is the given vessel usable?'],
    func: function (context, id) {
      const target = lisp_helpers.vessel_from_id(context, 'is_usable', id, context.host.id)
      return target.usable() ? 'true' : helpers.nil
    }
  },

  {
    props: ["is_passive", ['id = self'], 'Is the given vessel passive?'],
    func: function (context, id) {
      const target = lisp_helpers.vessel_from_id(context, 'is_passive', id, context.host.id)
      return target.passive() ? 'true' : helpers.nil
    }
  },

]

const exp = {
  lib: function (_host, _input, _query, _responder) {
    let out = {}
    for (var id in _lib) {
      const func = _lib[id].func
      const new_func = function (...given) {
        let args = []
        args.push({ host: _host, input: _input, query: _query, responder: _responder })
        args.push.apply(args, given)
        return func.apply(null, args)
      }
      out[_lib[id].props[0]] = new_func
    }

    return out
  },

  descriptions: function () {
    let out = {}
    for (var id in _lib) {
      const props = _lib[id].props
      out[props[0]] = {inputs: props[1], description: props[2]}
    }
    return out
  }
}

module.exports = exp
