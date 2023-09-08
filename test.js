import assert from 'node:assert/strict'
import test from 'node:test'
import {retext} from 'retext'
import {normalize} from 'nlcst-normalize'
import pluralize from 'pluralize'
import {schema} from './lib/schema.js'
import retextRedundantAcronyms from './index.js'

test('retextRedundantAcronyms', async function (t) {
  await t.test('should emit a message w/ metadata', async function () {
    const file = await retext()
      .use(retextRedundantAcronyms)
      .process('Where can I find an ATM machine?')

    assert.deepEqual(
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
  })

  await t.test('should emit messages', async function () {
    const file = await retext().use(retextRedundantAcronyms).process(
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

    assert.deepEqual(file.messages.map(String), [
      '3:5-3:32: Expected `HIV` instead of `HIV immuno deficiency virus`',
      '4:5-4:32: Expected `HIV` instead of `HIV immuno-deficiency virus`',
      '5:1-5:16: Expected `GRE` instead of `GRE examination`',
      '5:21-5:29: Expected `GRE` instead of `GRE exam`',
      '9:11-9:23: Expected `ATMs` instead of `ATM machines`',
      '11:18-11:33: Expected `CSSs` instead of `CSS stylesheets`'
    ])
  })
})

test('schema', async function (t) {
  await t.test('should include normal words', async function () {
    /** @type {string} */
    let key

    for (key in schema) {
      if (Object.hasOwn(schema, key)) {
        const list = schema[key].flat()
        let index = -1

        while (++index < list.length) {
          const word = list[index]

          assert.strictEqual(normalize(word), word)
        }
      }
    }
  })

  await t.test('should include singulars', async function () {
    const ignore = new Set(['trans'])
    /** @type {string} */
    let key

    for (key in schema) {
      if (Object.hasOwn(schema, key)) {
        const list = schema[key].flat()
        let index = -1
        while (++index < list.length) {
          const word = list[index]

          if (ignore.has(word)) continue
          assert.ok(pluralize.isSingular(word))
        }
      }
    }
  })
})
