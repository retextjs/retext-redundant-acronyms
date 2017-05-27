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

```js
var retext = require('retext');
var redundantAcronyms = require('retext-redundant-acronyms');
var report = require('vfile-reporter');

retext()
  .use(redundantAcronyms)
  .process('Where can I find an ATM machine?', function (err, file) {
    console.error(report(err || file));
  });
```

Yields:

```txt
  1:21-1:32  warning  Replace `ATM machine` with `ATM`  atm-machine  retext-redundant-acronyms

⚠ 1 warning
```

## API

### `retext().use(redundantAcronyms)`

Check for redundant acronyms (for example, `ATM machine`).

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/retext-redundant-acronyms.svg

[travis]: https://travis-ci.org/wooorm/retext-redundant-acronyms

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/retext-redundant-acronyms.svg

[codecov]: https://codecov.io/github/wooorm/retext-redundant-acronyms

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[retext]: https://github.com/wooorm/retext

[ras]: https://en.wikipedia.org/wiki/RAS_syndrome
