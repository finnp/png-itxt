var png = require('../')
var Through = require('stream').PassThrough
var test = require('tape')

var file = new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/TQBcNTh/AAAAAXRSTlPM0jRW/QAAAApJREFUeJxjYgAAAAYAAzY3fKgAAAAASUVORK5CYII', 'base64')

test('base-iTXt-getset-functions', function (t) {
  var start = new Through()
  t.plan(6)
  start
    .pipe(png.set({ keyword: 'cat', value: 'cute' }))
    .pipe(png.get('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'iTXt',
        compressed: false, compression_type: 0, language: '',
      translated: ''}, 'should get expected result for set/get')
    }))
    .pipe(png.get('pig', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.equal(data, null, 'should get null for no results')
    }))
    .pipe(png.set({ keyword: 'cat', value: 'fluffy' }))
    .pipe(png.get('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'fluffy', type: 'iTXt',
        compressed: false, compression_type: 0, language: '',
      translated: ''}, 'should only get one value for cat')
    }))

  start.write(file)
})

test('base-tEXt-simplegetset-functions', function (t) {
  var start = new Through()
  t.plan(6)
  start
    .pipe(png.set({ type: 'tEXt', keyword: 'cat', value: 'cute' }))
    .pipe(png.get('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'tEXt' },
        'should get expected result for set/get')
    }))
    .pipe(png.get('pig', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.equal(data, null, 'should get null for no results')
    }))
    .pipe(png.set({ type: 'tEXt', keyword: 'cat', value: 'fluffy' }))
    .pipe(png.get('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'fluffy', type: 'tEXt' },
        'should only get one value for cat')
    }))

  start.write(file)
})

test('base-zTXt-simplegetset-functions', function (t) {
  var start = new Through()
  t.plan(6)
  start
    .pipe(png.set({ type: 'zTXt', keyword: 'cat', value: 'cute' }))
    .pipe(png.get('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'zTXt', compressed: true,
      compression_type: 0}, 'should get expected result for set/get')
    }))
    .pipe(png.get('pig', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.equal(data, null, 'should get null for no results')
    }))
    .pipe(png.set({ type: 'zTXt', keyword: 'cat', value: 'fluffy' }))
    .pipe(png.get('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'fluffy', type: 'zTXt', compressed: true,
      compression_type: 0}, 'should only get one value for cat')
    }))

  start.write(file)
})
