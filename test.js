'use strict'

var assert = require('assert')
var test = require('tape')
var retext = require('retext')
var normalize = require('nlcst-normalize')
var pluralize = require('pluralize')
var schema = require('./schema')
var redundantAcronyms = require('.')

var concat = [].concat

test('simplify', function (t) {
  t.plan(2)

  retext()
    .use(redundantAcronyms)
    .process('Where can I find an ATM machine?', function (err, file) {
      t.deepEqual(
        JSON.parse(JSON.stringify([err].concat(file.messages))),
        [
          null,
          {
            message: 'Expected `ATM` instead of `ATM machine`',
            name: '1:21-1:32',
            reason: 'Expected `ATM` instead of `ATM machine`',
            line: 1,
            column: 21,
            location: {
              start: {line: 1, column: 21, offset: 20},
              end: {line: 1, column: 32, offset: 31}
            },
            source: 'retext-redundant-acronyms',
            ruleId: 'atm',
            fatal: false,
            actual: 'ATM machine',
            expected: ['ATM']
          }
        ],
        'should warn about redundant acronyms'
      )
    })

  retext()
    .use(redundantAcronyms)
    .process(
      [
        // Abbreviation in sentence.
        'Is there an ATM nearby?',
        // Abbreviation at end of sentence.
        'Where can I find an ATM?',
        // No dash.
        'The HIV immuno deficiency virus.',
        // Dash.
        'The HIV immuno-deficiency virus.',
        // Multiple possible expansions.
        'GRE examination and GRE exam.',
        // Partial match.
        'EGA graphics.',
        'START arm reduction things.',
        'START reduction things.',
        // Plurals.
        'Are there ATM machines nearby?',
        // Definition.
        'TWA (Trans World Airline) was a US airline acquired and then liquidated in 2001.'
      ].join('\n'),
      function (err, file) {
        t.deepEqual(
          [err].concat(file.messages.map(String)),
          [
            null,
            '3:5-3:32: Expected `HIV` instead of `HIV immuno deficiency virus`',
            '4:5-4:32: Expected `HIV` instead of `HIV immuno-deficiency virus`',
            '5:1-5:16: Expected `GRE` instead of `GRE examination`',
            '5:21-5:29: Expected `GRE` instead of `GRE exam`',
            '9:11-9:23: Expected `ATMs` instead of `ATM machines`'
          ],
          'should warn about redundant acronyms'
        )
      }
    )
})

test('schema', function (t) {
  t.doesNotThrow(function () {
    Object.keys(schema).forEach(function (abbr) {
      concat.apply([], schema[abbr]).forEach(function (word) {
        assert.strictEqual(
          normalize(word),
          word,
          '`' + word + '` should be normal'
        )
      })
    })
  }, 'all words should be normalized')

  t.doesNotThrow(function () {
    var ignore = ['trans']

    Object.keys(schema).forEach(function (abbr) {
      concat.apply([], schema[abbr]).forEach(function (word) {
        if (ignore.includes(word)) {
          return
        }

        assert.ok(
          pluralize.isSingular(word),
          '`' + word + '` should be singular'
        )
      })
    })
  }, 'all words should be singular')

  t.end()
})
