var png = require('../')
var Through = require('stream').PassThrough
var test = require('tape')

var file = new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/TQBcNTh/AAAAAXRSTlPM0jRW/QAAAApJREFUeJxjYgAAAAYAAzY3fKgAAAAASUVORK5CYII', 'base64')

test('set-replace-functions', function (t) {
  var start = new Through()
  t.plan(14)
  start
    .pipe(png.set({ type: 'tEXt', keyword: 'cat', value: 'cute' }))
    .pipe(png.set({ type: 'zTXt', keyword: 'cat', value: 'fluffy' }))
    .pipe(png.set({ type: 'iTXt', keyword: 'cat', value: 'ugly' }))
    .pipe(png.get('cat', ['tEXt'], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'tEXt' },
        'should find only the tEXt chunk')
    }))
    .pipe(png.get('cat', ['zTXt'], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'fluffy', type: 'zTXt',
      compressed: true, compression_type: 0},
        'should find only the zTXt chunk')
    }))
    .pipe(png.get('cat', ['iTXt'], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'ugly', type: 'iTXt',
        compressed: false, compression_type: 0, language: '',
      translated: ''}, 'should only find one iTXt chunk')
    }))
    .pipe(png.get('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.equals(data.keyword, 'cat', 'should find all three')
    }))
    .pipe(png.set({ type: 'iTXt', keyword: 'cat', value: 'tabby' }, true))
    .pipe(png.get('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'tabby', type: 'iTXt',
        compressed: false, compression_type: 0, language: '',
      translated: ''}, 'should only get one value for cat')
    }))

  start.write(file)
})
