# retext-redundant-acronyms

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[retext][]** plugin to check for redundant acronyms (such as `ATM machine`
to `ATM`).

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(retextRedundantAcronyms)`](#unifieduseretextredundantacronyms)
*   [Messages](#messages)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([retext][]) plugin to check for redundant
acronyms (such as `ATM machine` to `ATM`).

> 🙃 **Fun fact**: this is called [`RAS syndrome`][ras] (`redundant acronym
> syndrome syndrome`).

## When should I use this?

You can opt-into this plugin when you’re dealing with content that might contain
grammar mistakes, and have authors that can fix that content.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, 16.0+, or 18.0+), install with [npm][]:

```sh
npm install retext-redundant-acronyms
```

In Deno with [`esm.sh`][esmsh]:

```js
import retextRedundantAcronyms from 'https://esm.sh/retext-redundant-acronyms@4'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import retextRedundantAcronyms from 'https://esm.sh/retext-redundant-acronyms@4?bundle'
</script>
```

## Use

Say our document `example.txt` contains:

```txt
Where can I find an ATM machine?
```

…and our module `example.js` looks as follows:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {unified} from 'unified'
import retextEnglish from 'retext-english'
import retextRedundantAcronyms from 'retext-redundant-acronyms'
import retextStringify from 'retext-stringify'

const file = unified()
  .use(retextEnglish)
  .use(retextRedundantAcronyms)
  .use(retextStringify)
  .process(await read('example.txt'))

console.error(reporter(file))
```

…now running `node example.js` yields:

```text
example.txt
  1:21-1:32  warning  Expected `ATM` instead of `ATM machine`  atm  retext-redundant-acronyms

⚠ 1 warning
```

## API

This package exports no identifiers.
The default export is `retextRedundantAcronyms`.

### `unified().use(retextRedundantAcronyms)`

Check for redundant acronyms (such as `ATM machine`
to `ATM`).

## Messages

Each message is emitted as a [`VFileMessage`][vfile-message] on `file`, with
the following fields:

###### `message.source`

Name of this plugin (`'retext-redundant-acronyms'`).

###### `message.ruleId`

Lower case matched abbreviation (`string`, such as `'atm'`)

###### `message.actual`

Current not ok phrase (`string`, such as `'ATM machines'`).

###### `message.expected`

List of suggestions (`Array<string>`, such as `['ATMs']`).

## Types

This package is fully typed with [TypeScript][].
It does not export additional types.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, 16.0+, and 18.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Related

*   [`retext-indefinite-article`](https://github.com/retextjs/retext-indefinite-article)
    — check if indefinite articles are used correctly
*   [`retext-repeated-words`](https://github.com/retextjs/retext-repeated-words)
    — check `for for` repeated words

## Contribute

See [`contributing.md`][contributing] in [`retextjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/retextjs/retext-redundant-acronyms/workflows/main/badge.svg

[build]: https://github.com/retextjs/retext-redundant-acronyms/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-redundant-acronyms.svg

[coverage]: https://codecov.io/github/retextjs/retext-redundant-acronyms

[downloads-badge]: https://img.shields.io/npm/dm/retext-redundant-acronyms.svg

[downloads]: https://www.npmjs.com/package/retext-redundant-acronyms

[size-badge]: https://img.shields.io/bundlephobia/minzip/retext-redundant-acronyms.svg

[size]: https://bundlephobia.com/result?p=retext-redundant-acronyms

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/retextjs/retext/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[health]: https://github.com/retextjs/.github

[contributing]: https://github.com/retextjs/.github/blob/main/contributing.md

[support]: https://github.com/retextjs/.github/blob/main/support.md

[coc]: https://github.com/retextjs/.github/blob/main/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[unified]: https://github.com/unifiedjs/unified

[retext]: https://github.com/retextjs/retext

[vfile-message]: https://github.com/vfile/vfile-message

[ras]: https://en.wikipedia.org/wiki/RAS_syndrome
