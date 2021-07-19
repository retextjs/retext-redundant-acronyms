import {normalize} from 'nlcst-normalize'
import {search} from 'nlcst-search'
import {toString} from 'nlcst-to-string'
import pluralize from 'pluralize'
import {quotation} from 'quotation'
import {findAfter} from 'unist-util-find-after'
import {pointStart, pointEnd} from 'unist-util-position'
import {schema} from './schema.js'

// Trans.
pluralize.addSingularRule(/trans$/i, 'singular')

const source = 'retext-redundant-acronyms'

const list = Object.keys(schema)

export default function retextRedundantAcronyms() {
  return (tree, file) => {
    search(tree, list, (match, start, parent, phrase) => {
      const expansions = schema[phrase]
      const siblings = parent.children
      const tail = siblings[start + match.length - 1]
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

          nextExpected = rest.shift()
          nextActual = pluralize.singular(normalize(nextNode))

          if (nextExpected !== nextActual) {
            break
          }
        }

        if (rest.length === 0 && nextExpected === nextActual) {
          const nodes = siblings.slice(start, siblings.indexOf(nextNode) + 1)
          const actual = toString(nodes)
          let expected = toString(match)

          if (pluralize.isPlural(toString(nextNode))) {
            expected += 's'
          }

          Object.assign(
            file.message(
              'Expected ' +
                quotation(expected, '`') +
                ' instead of ' +
                quotation(actual, '`'),
              {
                start: pointStart(nodes[0]),
                end: pointEnd(nodes[nodes.length - 1])
              },
              [source, phrase.replace(/\s+/g, '-').toLowerCase()].join(':')
            ),
            {actual, expected: [expected]}
          )

          return
        }
      }
    })
  }
}
