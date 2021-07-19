import pluralize from 'pluralize'
import search from 'nlcst-search'
import normalize from 'nlcst-normalize'
import toString from 'nlcst-to-string'
import after from 'unist-util-find-after'
import position from 'unist-util-position'
import quote from 'quotation'
import {schema} from './schema.js'

// Trans.
pluralize.addSingularRule(/trans$/i, 'singular')

var source = 'retext-redundant-acronyms'

var list = keys(schema)

export default function retextRedundantAcronyms() {
  return transformer

  function transformer(tree, file) {
    search(tree, list, searcher)

    function searcher(match, start, parent, phrase) {
      var expansions = schema[phrase]
      var siblings = parent.children
      var tail = siblings[start + match.length - 1]
      var length = expansions.length
      var index = -1
      var nodes
      var nextNode
      var nextExpected
      var nextActual
      var expansion
      var expansionIndex
      var rest
      var actual
      var expected
      var message

      while (++index < length) {
        expansion = expansions[index]
        nextNode = after(parent, tail, 'WordNode')

        // We can probably break because the other expansions probably aren’t
        // going to match, but it could be that a following expansion has no
        // next word.
        if (!nextNode) {
          continue
        }

        nextActual = pluralize.singular(normalize(nextNode))
        expansionIndex = expansion.indexOf(nextActual, 1)

        if (expansionIndex === -1) {
          continue
        }

        nextExpected = nextActual
        rest = expansion.slice(expansionIndex + 1)

        while (rest.length !== 0) {
          nextNode = after(parent, nextNode, 'WordNode')

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
          nodes = siblings.slice(start, siblings.indexOf(nextNode) + 1)
          actual = toString(nodes)
          expected = toString(match)

          if (pluralize.isPlural(toString(nextNode))) {
            expected += 's'
          }

          message = file.message(
            'Expected ' +
              quote(expected, '`') +
              ' instead of ' +
              quote(actual, '`'),
            {
              start: position.start(nodes[0]),
              end: position.end(nodes[nodes.length - 1])
            },
            [source, phrase.replace(/\s+/g, '-').toLowerCase()].join(':')
          )

          message.actual = actual
          message.expected = [expected]
          return
        }
      }
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
