var png = require('../')
var Through = require('stream').PassThrough
var test = require('tape')

var file = new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/TQBcNTh/AAAAAXRSTlPM0jRW/QAAAApJREFUeJxjYgAAAAYAAzY3fKgAAAAASUVORK5CYII', 'base64')

test('get-filter-single-functions', function (t) {
  var start = new Through()
  t.plan(12)
  start
    .pipe(png.set({ keyword: 'cat', value: 'cute' }))
    .pipe(png.get('cat', [ 'iTXt' ], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'iTXt',
        compressed: false, compression_type: 0, language: '',
      translated: ''}, 'should get expected result for set/get')
    }))
    .pipe(png.get(['iTXt'], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'iTXt',
        compressed: false, compression_type: 0, language: '',
      translated: ''}, 'should get expected result for set/get')
    }))
    .pipe(png.get('cat', [ 'tEXt' ], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, null, 'should not find the iTXt chunk')
    }))
    .pipe(png.get('cat', [ 'zTXt' ], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, null, 'should not find the iTXt chunk')
    }))
    .pipe(png.get([ 'zTXt' ], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, null, 'should not find the iTXt chunk')
    }))
    .pipe(png.get([ 'tEXt' ], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, null, 'should not find the iTXt chunk')
    }))
  start.write(file)
})

test('get-filter-multiple-functions', function (t) {
  var start = new Through()
  t.plan(10)
  start
    .pipe(png.set({ type: 'tEXt', keyword: 'cat', value: 'cute' }))
    .pipe(png.get('cat', [ 'iTXt', 'tEXt' ], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'tEXt' },
        'should get expected result for set/get')
    }))
    .pipe(png.get('cat', [ 'iTXt', 'zTXt', 'tEXt' ], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'tEXt' },
        'should get expected result for set/get')
    }))
    .pipe(png.get(['iTXt', 'tEXt'], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'tEXt' },
        'should get expected result for set/get')
    }))
    .pipe(png.get(['iTXt', 'zTXt', 'tEXt'], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'tEXt' },
        'should get expected result for set/get')
    }))
    .pipe(png.get('cat', ['zTXt', 'iTXt'], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, null, 'should not find the iTXt chunk')
    }))
  start.write(file)
})

test('get-filter-complex-functions', function (t) {
  var start = new Through()
  t.plan(8)
  start
    .pipe(png.set({ type: 'zTXt', keyword: 'cat', value: 'cute' }))
    .pipe(png.set({ type: 'tEXt', keyword: 'cat', value: 'ugly' }))
    .pipe(png.get('cat', [ 'zTXt' ], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'zTXt', compressed: true,
      compression_type: 0}, 'should get expected result for set/get')
    }))
    .pipe(png.get('cat', [ 'tEXt' ], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'ugly', type: 'tEXt' },
        'should only get one value for cat')
    }))
    .pipe(png.get('cat', [ 'tEXt', 'zTXt' ], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data.keyword, 'cat', 'should be found twice')
    }))

  start.write(file)
})
