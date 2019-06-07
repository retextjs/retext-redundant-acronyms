'use strict'

var test = require('tape')
var retext = require('retext')
var redundantAcronyms = require('.')

test('simplify', function(t) {
  t.plan(1)

  retext()
    .use(redundantAcronyms)
    .process('Where can I find an ATM machine?', function(err, file) {
      t.deepEqual(
        [err].concat(file.messages),
        [
          null,
          {
            message: 'Replace `ATM machine` with `ATM`',
            name: '1:21-1:32',
            reason: 'Replace `ATM machine` with `ATM`',
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
})
