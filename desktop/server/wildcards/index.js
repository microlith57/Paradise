'use strict'

const helpers = require('../core/helpers')

const _groups = {
  'mathematics': 'Mathematics wildcards. Used for manipulation of numbers.',
  'logic': 'Logic wildcards. Used for program flow.',

  'vessels': 'Vessel wildcards. Used to find vessels and their properties.',

  'string_utilities': 'String wildcards. Used to transform strings of text.',
  'list_utilities': 'List wildcards. Used to perform operations on lists.',
  'program_utilities': 'Program utilities. Used to interact with the current program.',
  'random_utilities': 'Random utilities. Used to generate and use random numbers.',
  'clock_utilities': 'Clock utilities. Used to find and use the current time.',
}

let groups = []

for (var name in _groups) {
  const group = require(`./${name}`)
  groups.push(group)
}


const exp = {
  lib: function (host, input, query, responder) {
    let _lib = {}
    for (var id in groups) {
      const group = groups[id]
      _lib = helpers.merge_options(_lib, group.lib(host, input, query, responder))
    }
    return _lib
  },

  descriptions: function () {
    let _desc = {}
    for (var id in groups) {
      const group = groups[id]
      _desc = helpers.merge_options(_desc, group.descriptions())
    }
    return _desc
  },

  groups: _groups
}

module.exports = exp
