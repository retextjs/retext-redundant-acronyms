'use strict'

var casing = require('match-casing')
var search = require('nlcst-search')
var toString = require('nlcst-to-string')
var position = require('unist-util-position')
var quote = require('quotation')
var schema = require('./schema')

module.exports = redundantAcronyms

var source = 'retext-redundant-acronyms'

var list = keys(schema)

function redundantAcronyms() {
  return transformer

  function transformer(tree, file) {
    search(tree, list, searcher)

    function searcher(match, index, parent, phrase) {
      var id = schema[phrase].replace(/\s+/g, '-').toLowerCase()
      var actual = toString(match)
      var expected = casing(schema[phrase], actual)

      var message = file.message(
        'Replace ' + quote(actual, '`') + ' with ' + quote(expected, '`'),
        {
          start: position.start(match[0]),
          end: position.end(match[match.length - 1])
        },
        [source, id].join(':')
      )

      message.actual = actual
      message.expected = [expected]
    }
  }
}

function keys(object) {
  var result = []
  var key

  for (key in object) {
    result.push(key)
  }

  return result
}
