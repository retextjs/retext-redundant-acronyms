'use strict';

var test = require('tape');
var retext = require('retext');
var redundantAcronyms = require('./');

test('simplify', function (t) {
  t.plan(2);

  retext()
    .use(redundantAcronyms)
    .process([
      'Where can I find an ATM machine?'
    ].join('\n'), function (err, file) {
      t.ifError(err, 'should not fail');

      t.equal(
        String(file.messages),
        '1:21-1:32: Replace `ATM machine` with `ATM`',
        'should warn about redundant acronyms'
      );
    });
});
