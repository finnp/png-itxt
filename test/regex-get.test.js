var png = require('../')
var Through = require('stream').PassThrough
var test = require('tape')

var file = new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/TQBcNTh/AAAAAXRSTlPM0jRW/QAAAApJREFUeJxjYgAAAAYAAzY3fKgAAAAASUVORK5CYII', 'base64')

var start = new Through()

test('regex-get', function (t) {
  t.plan(16)
  start
    .pipe(png.set({ keyword: 'the', value: 'cat' }))
    .pipe(png.set({ keyword: 'thhe', value: 'cat' }))
    .pipe(png.get(/hh/, function (err, data) {
      t.equals(err, null, 'should find no error')
      t.deepEquals(data, { type: 'iTXt', keyword: 'thhe', value: 'cat',
        compressed: false, compression_type: 0, language: '',
      translated: ''}, 'should find value based on regexp')
    }))
    .pipe(png.get(/THE/i, function (err, data) {
      t.equals(err, null, 'should find no error')
      t.deepEquals(data, { type: 'iTXt', keyword: 'the', value: 'cat',
        compressed: false, compression_type: 0, language: '',
      translated: ''}, 'regex with globals works for value')
    }))
    .pipe(png.get(/^t[hH]+e/, function (err, data) {
      t.equals(err, null, 'should find no error')
      t.ok(data.keyword, 'regex works when option groups defined')
      t.equal(data.value, 'cat', 'regex works when option groups defined')
    }))
    .pipe(png.get(/THE/, function (err, data) {
      t.equals(err, null, 'should find no error')
      t.deepEqual(data, null, 'regex works when nothing to find')
    }))
    .pipe(png.get('th*', function (err, data) {
      t.equals(err, null, 'should find no error')
      t.deepEqual(data, null, 'regex characters should not work in string.')
    }))
    .pipe(png.get('th', function (err, data) {
      t.equals(err, null, 'should find no error')
      t.deepEqual(data, null, 'strings should not get partial matches.')
    }))

  // TODO add tests for when string are passed in and converted to RegExp
  start.write(file)
})
