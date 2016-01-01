var png = require('../')
var Through = require('stream').PassThrough
var test = require('tape')

var file = new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/TQBcNTh/AAAAAXRSTlPM0jRW/QAAAApJREFUeJxjYgAAAAYAAzY3fKgAAAAASUVORK5CYII', 'base64')

test('set-replaceLang-functions', function (t) {
  var start = new Through()

  var testdata = [{keyword: 'cat', value: 'ugly', type: 'iTXt',
                    compressed: false, compression_type: 0, language: 'EN',
                    translated: ''},
                  { keyword: 'cat', value: 'flaumig', type: 'iTXt',
                   compressed: false, compression_type: 0, language: 'DE',
                   translated: ''},
                  { keyword: 'cat', value: 'fluffy', type: 'iTXt',
                   compressed: false, compression_type: 0, language: 'EN',
                   translated: ''}]

  t.plan(6)
  start
    .pipe(png.set({ type: 'iTXt', keyword: 'cat', value: 'ugly', language: 'EN' }))
    .pipe(png.get('cat', ['iTXt'], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, testdata.shift(), 'should only find one iTXt chunk')
    }))
    .pipe(png.set({ type: 'iTXt', keyword: 'cat', value: 'flaumig', language: 'DE' }, { replaceLang: true }))
    .pipe(png.set({ type: 'iTXt', keyword: 'cat', value: 'fluffy', language: 'EN' },
                  png.REPLACELANG))
    .pipe(png.get('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, testdata.shift(), 'should find both cat values.')
    }))

  start.write(file)
})
