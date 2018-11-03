# retext-redundant-acronyms [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Check for redundant acronyms (for example, `ATM machine` > `ATM`) with
[**retext**][retext].

Fun fact, this is called [`RAS syndrome`][ras]
(`redundant acronym syndrome syndrome`).

## Installation

[npm][]:

```bash
npm install retext-redundant-acronyms
```

## Usage

Say we have the following file, `example.txt`:

```text
Where can I find an ATM machine?
```

And our script, `example.js`, looks like this:

```javascript
var vfile = require('to-vfile');
var report = require('vfile-reporter');
var unified = require('unified');
var english = require('retext-english');
var stringify = require('retext-stringify');
var redundantAcronyms = require('retext-redundant-acronyms');

unified()
  .use(english)
  .use(redundantAcronyms)
  .use(stringify)
  .process(vfile.readSync('example.txt'), function (err, file) {
    console.error(report(err || file));
  });
```

Now, running `node example` yields:

```text
example.txt
  1:21-1:32  warning  Replace `ATM machine` with `ATM`  atm-machine  retext-redundant-acronyms

⚠ 1 warning
```

## API

### `retext().use(redundantAcronyms)`

Check for redundant acronyms (for example, `ATM machine`).

## Related

*   [`retext-indefinite-article`](https://github.com/retextjs/retext-indefinite-article)
    — Check if indefinite articles are used correctly
*   [`retext-repeated-words`](https://github.com/retextjs/retext-repeated-words)
    — Check `for for` repeated words

## Contribute

See [`contributing.md` in `retextjs/retext`][contribute] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/retextjs/retext-redundant-acronyms.svg

[travis]: https://travis-ci.org/retextjs/retext-redundant-acronyms

[codecov-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-redundant-acronyms.svg

[codecov]: https://codecov.io/github/retextjs/retext-redundant-acronyms

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[retext]: https://github.com/retextjs/retext

[ras]: https://en.wikipedia.org/wiki/RAS_syndrome

[contribute]: https://github.com/retextjs/retext/blob/master/contributing.md

[coc]: https://github.com/retextjs/retext/blob/master/code-of-conduct.md
