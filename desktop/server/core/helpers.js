'use strict'

// nil value for WildcardLISP
const _nil = function nil () {
  this.toString = function () {
    return 'nil'
  }
}

// String operations

String.prototype.toSlug = function () {
  return this.toLowerCase().replace(/ /g, '_').replace(/[^0-9a-z\+]/gi, '').trim()
}
String.prototype.toSentenceCase = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
}

// Credit to https://stackoverflow.com/a/46774740
const _toTitleCase = (str) => {
  const articles = ['a', 'an', 'the']
  const conjunctions = ['for', 'and', 'nor', 'but', 'or', 'yet', 'so']
  const prepositions = [
    'with', 'at', 'from', 'into', 'upon', 'of', 'to', 'in', 'for',
    'on', 'by', 'like', 'over', 'plus', 'but', 'up', 'down', 'off', 'near'
  ]

  // The list of special characters can be tweaked here
  // const replaceCharsWithSpace = (str) => str.replace(/[^0-9a-z&/\\]/gi, ' ').replace(/(\s\s+)/gi, ' ');
  const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.substr(1)
  const normalizeStr = (str) => str.toLowerCase().trim()
  const shouldCapitalize = (word, fullWordList, posWithinStr) => {
    if ((posWithinStr == 0) || (posWithinStr == fullWordList.length - 1)) {
      return true
    }

    return !(articles.includes(word) || conjunctions.includes(word) || prepositions.includes(word))
  }

  // str = replaceCharsWithSpace(str);
  str = normalizeStr(str)

  let words = str.split(' ')
  if (words.length <= 2) { // Strings less than 3 words long should always have first words capitalized
    words = words.map(w => capitalizeFirstLetter(w))
  } else {
    for (let i = 0; i < words.length; i++) {
      words[i] = (shouldCapitalize(words[i], words, i) ? capitalizeFirstLetter(words[i], words, i) : words[i])
    }
  }

  return words.join(' ')
}

String.prototype.toTitleCase = function () {
  return _toTitleCase(this)
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
const _shuffle = function shuffle (a) {
  var j, x, i
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = a[i]
    a[i] = a[j]
    a[j] = x
  }
  return a
}

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
const _merge_options = function merge_options (obj1, obj2) {
  var obj3 = {}
  for (var attrname in obj1) { obj3[attrname] = obj1[attrname] }
  for (var attrname in obj2) { obj3[attrname] = obj2[attrname] }
  return obj3
}

const _helpers = {
  nil: new _nil(),
  shuffle: _shuffle,
  merge_options: _merge_options
}

module.exports = _helpers
