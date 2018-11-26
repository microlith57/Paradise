'use strict'

const lisp_helpers = require('../core/lisp_helpers')
const helpers = require('../core/helpers')
const errors  = require('../core/errors')
const Error   = require('../core/error')

const _lib = [

  // TODO: Add proper error handling

  {
    props: ["list", ['...items'], 'Transform a sequence of inputs into a list.'],
    func: function (context, ...items) {
      if (!items || items.length === 0) {
        return helpers.nil
      }
      return items
    }
  },

  // REVIEW: Which order should element and list be in?
  {
    props: ["push", ['element', 'list'], 'Push an element to the end of a list.'],
    func: function (context, element, list) {
      if (!list || !(list instanceof Array)) {
        return helpers.nil
      }
      list.push(lisp_helpers.prepare_lisp(element))
      return list
    }
  },

  {
    props: ["pop", ['list'], 'Pop an element from the end of a list.'],
    func: function (context, list) {
      if (!list || !(list instanceof Array) || list.length < 1) {
        return helpers.nil
      }
      return list.pop()
    }
  },

  // REVIEW: Which order should index and list be in?
  {
    props: ["get", ['index', 'list'], 'Get an element from a list.'],
    func: function (context, index, list) {
      if (index == null || !list || !(list instanceof Array) || !(typeof index === 'number')) {
        return helpers.nil
      }
      return list[index] || helpers.nil // Return the data value or nil if no value is present.
    }
  },

  // REVIEW: Which order should index, value, and list be in?
  {
    props: ["set", ['index', 'value', 'list'], 'Set an element of a list.'],
    func:  function (context, index, value, list) {
      if (index == null || !(typeof index === 'number') || value == null || !list || !(list instanceof Array)) {
        return helpers.nil
      }
      list[index] = value
      return list
    }
  },

  {
    props: ["length", ['list'], 'Get the length of a list.'],
    func: function (context, list) {
      if (!list || !(list instanceof Array)) {
        return helpers.nil
      }
      return list.length
    }
  },

  // TODO: add error checking
  {
    props: ["concatl", ['...items'], 'Concatenate a sequence of lists.'],
    func: function (context, ...items) {
      if (!items || items.length < 1) {
        return helpers.nil
      }
      let out = []
      for (var id in items) {
        out.concat(items[id])
      }
      return out
    }
  },

  // eg.
  // `range 5`   -> [0, 1, 2, 3, 4]
  // `range 3 7` -> [3, 4, 5, 6]
  {
    props: ["range", ['a', 'b'], 'Generate a list. Accepts two formats: <code>range length</code> and <code>range start end</code>. The <code>end</code> value is not included.'],
    func: function (context, a, b) {
      let start, end

      if (a == null || a === helpers.nil || isNaN(parseInt(a))) {
        a = helpers.nil
      }

      if (b == null || b === helpers.nil || isNaN(parseInt(b))) {
        b = helpers.nil
      }

      if (a !== helpers.nil && b === helpers.nil) { // If start is defined but not end
        start = 0
        end = a
      } else if (a !== helpers.nil && b !== helpers.nil) {
        start = a
        end = b
      } else {
        return helpers.nil // error
      }
      if (start > end) {
        return helpers.nil // error
      }
      const size = (end - start)
      return [...Array(size).keys()].map(i => i + start)
    }
  },

  // TODO: contains(list, thing)
  // TODO: indexof(list, thing)

  // eg. `create chair & create table & echo @( map siblings ( lambda (id) ( vessel id name ) ) )`
  {
    props: ["map", ['list', 'function'], 'Iterate over list elements. The return values of the function will modify the list values.'],
    func: function (context, list, func) {
      if (typeof list === 'function') {
        list = list()
      }
      if (!list || !(list instanceof Array)) {
        return helpers.nil
      }

      return list.map(func)
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
