import assert from 'node:assert'
import test from 'tape'
import {retext} from 'retext'
import {normalize} from 'nlcst-normalize'
import pluralize from 'pluralize'
import {schema} from './schema.js'
import retextRedundantAcronyms from './index.js'

const own = {}.hasOwnProperty

test('retext-redundant-acronyms', (t) => {
  t.plan(2)

  retext()
    .use(retextRedundantAcronyms)
    .process('Where can I find an ATM machine?')
    .then((file) => {
      t.deepEqual(
        JSON.parse(JSON.stringify(file.messages)),
        [
          {
            column: 21,
            fatal: false,
            message: 'Expected `ATM` instead of `ATM machine`',
            line: 1,
            name: '1:21-1:32',
            place: {
              start: {line: 1, column: 21, offset: 20},
              end: {line: 1, column: 32, offset: 31}
            },
            reason: 'Expected `ATM` instead of `ATM machine`',
            ruleId: 'atm',
            source: 'retext-redundant-acronyms',
            actual: 'ATM machine',
            expected: ['ATM'],
            url: 'https://github.com/retextjs/retext-redundant-acronyms#readme'
          }
        ],
        'should warn about redundant acronyms'
      )
    }, t.ifErr)

  retext()
    .use(retextRedundantAcronyms)
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
        'TWA (Trans World Airline) was a US airline acquired and then liquidated in 2001.',
        'Whenever I read "CSS stylesheets" my brain automatically translates it…'
      ].join('\n')
    )
    .then((file) => {
      t.deepEqual(
        file.messages.map(String),
        [
          '3:5-3:32: Expected `HIV` instead of `HIV immuno deficiency virus`',
          '4:5-4:32: Expected `HIV` instead of `HIV immuno-deficiency virus`',
          '5:1-5:16: Expected `GRE` instead of `GRE examination`',
          '5:21-5:29: Expected `GRE` instead of `GRE exam`',
          '9:11-9:23: Expected `ATMs` instead of `ATM machines`',
          '11:18-11:33: Expected `CSSs` instead of `CSS stylesheets`'
        ],
        'should warn about redundant acronyms'
      )
    }, t.ifErr)
})

test('schema', (t) => {
  t.doesNotThrow(() => {
    /** @type {string} */
    let key

    for (key in schema) {
      if (own.call(schema, key)) {
        const list = schema[key].flat()

        let index = -1
        while (++index < list.length) {
          const word = list[index]
          assert.strictEqual(
            normalize(word),
            word,
            '`' + word + '` should be normal'
          )
        }
      }
    }
  }, 'all words should be normalized')

  t.doesNotThrow(() => {
    const ignore = new Set(['trans'])
    /** @type {string} */
    let key

    for (key in schema) {
      if (own.call(schema, key)) {
        const list = schema[key].flat()

        let index = -1
        while (++index < list.length) {
          const word = list[index]

          if (!ignore.has(word)) {
            assert.ok(
              pluralize.isSingular(word),
              '`' + word + '` should be singular'
            )
          }
        }
      }
    }
  }, 'all words should be singular')

  t.end()
})
