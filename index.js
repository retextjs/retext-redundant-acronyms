'use strict';

var keys = require('object-keys');
var casing = require('match-casing');
var search = require('nlcst-search');
var nlcstToString = require('nlcst-to-string');
var position = require('unist-util-position');
var quotation = require('quotation');
var schema = require('./schema');

module.exports = redundantAcronyms;

var list = keys(schema);

function redundantAcronyms() {
  return transformer;

  function transformer(tree, file) {
    search(tree, list, searcher);

    function searcher(match, index, parent, phrase) {
      var value = nlcstToString(match);
      var replace = quotation(casing(schema[phrase], value), '`');
      var message = 'Replace ' + quotation(value, '`') + ' with ' + replace;

      message = file.warn(message, {
        start: position.start(match[0]),
        end: position.end(match[match.length - 1])
      }, phrase.replace(/\s+/g, '-').toLowerCase());

      message.source = 'retext-redundant-acronyms';
    }
  }
}
