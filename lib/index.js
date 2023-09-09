/**
 * @typedef {import('nlcst').Root} Root
 * @typedef {import('nlcst').Sentence} Sentence
 * @typedef {import('nlcst').Word} Word
 *
 * @typedef {import('vfile').VFile} VFile
 */

import {normalize} from 'nlcst-normalize'
import {search} from 'nlcst-search'
import {toString} from 'nlcst-to-string'
import pluralize from 'pluralize'
import {quotation} from 'quotation'
import {findAfter} from 'unist-util-find-after'
import {pointEnd, pointStart} from 'unist-util-position'
import {schema} from './schema.js'

// Trans.
pluralize.addSingularRule(/trans$/i, 'singular')

const list = Object.keys(schema)

/**
 * Check for redundant acronyms (such as `ATM machine` to `ATM`).
 *
 * @returns
 *   Transform.
 */
export default function retextRedundantAcronyms() {
  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @param {VFile} file
   *   File.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree, file) {
    search(tree, list, function (match, from, parent, phrase) {
      const expansions = schema[phrase]
      const siblings = parent.children
      const tail = siblings[from + match.length - 1]
      let index = -1

      while (++index < expansions.length) {
        const expansion = expansions[index]
        let nextNode = findAfter(parent, tail, 'WordNode')

        // We can probably break because the other expansions probably aren’t
        // going to match, but it could be that a following expansion has no
        // next word.
        if (!nextNode) {
          continue
        }

        let nextActual = pluralize.singular(normalize(nextNode))
        const expansionIndex = expansion.indexOf(nextActual, 1)

        if (expansionIndex === -1) {
          continue
        }

        let nextExpected = nextActual
        const rest = expansion.slice(expansionIndex + 1)

        while (rest.length > 0) {
          nextNode = findAfter(parent, nextNode, 'WordNode')

          if (!nextNode) {
            break
          }

          // @ts-expect-error: always one item.
          nextExpected = rest.shift()
          nextActual = pluralize.singular(normalize(nextNode))

          if (nextExpected !== nextActual) {
            break
          }
        }

        if (rest.length === 0 && nextNode && nextExpected === nextActual) {
          const nodes = siblings.slice(from, siblings.indexOf(nextNode) + 1)
          const actual = toString(nodes)
          const start = pointStart(nodes[0])
          const end = pointEnd(nodes[nodes.length - 1])
          let expected = toString(match)

          if (pluralize.isPlural(toString(nextNode))) {
            expected += 's'
          }

          const message = file.message(
            'Unexpected redundant ' +
              quotation(actual, '`') +
              ', expected ' +
              quotation(expected, '`'),
            {
              /* c8 ignore next -- verbose to test */
              place: start && end ? {start, end} : undefined,
              ruleId: phrase.replace(/\s+/g, '-').toLowerCase(),
              source: 'retext-redundant-acronyms'
            }
          )

          message.actual = actual
          message.expected = [expected]
          message.url =
            'https://github.com/retextjs/retext-redundant-acronyms#readme'

          return
        }
      }
    })
  }
}
