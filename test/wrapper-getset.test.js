var png = require('../')
var Through = require('stream').PassThrough
var test = require('tape')

var file = new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/TQBcNTh/AAAAAXRSTlPM0jRW/QAAAApJREFUeJxjYgAAAAYAAzY3fKgAAAAASUVORK5CYII', 'base64')

test('wrapper-getitxt-functions', function (t) {
  var start = new Through()
  t.plan(12)
  start
    .pipe(png.set({ keyword: 'cat', value: 'cute' }))
    .pipe(png.getitxt('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'iTXt',
        compressed: false, compression_type: 0, language: '',
      translated: ''}, 'should get expected result for set/get')
    }))
    .pipe(png.gettext('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.equal(data, null, 'should get null for no results')
    }))
    .pipe(png.getztxt('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.equal(data, null, 'should get null for no results')
    }))
    .pipe(png.getitxt(function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'iTXt',
        compressed: false, compression_type: 0, language: '',
      translated: ''}, 'should get expected result for set/get')
    }))
    .pipe(png.gettext(function (err, data) {
      t.equal(err, null, 'should have no error')
      t.equal(data, null, 'should get null for no results')
    }))
    .pipe(png.getztxt(function (err, data) {
      t.equal(err, null, 'should have no error')
      t.equal(data, null, 'should get null for no results')
    }))

  start.write(file)
})

test('wrapper-gettext-functions', function (t) {
  var start = new Through()
  t.plan(12)
  start
    .pipe(png.set({ type: 'tEXt', keyword: 'cat', value: 'cute' }))
    .pipe(png.gettext('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'tEXt' },
        'should get expected result for set/get')
    }))
    .pipe(png.getitxt('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.equal(data, null, 'should get null for no results')
    }))
    .pipe(png.getztxt('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.equal(data, null, 'should get null for no results')
    }))
    .pipe(png.gettext(function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'tEXt' },
        'should get expected result for set/get')
    }))
    .pipe(png.getitxt(function (err, data) {
      t.equal(err, null, 'should have no error')
      t.equal(data, null, 'should get null for no results')
    }))
    .pipe(png.getztxt(function (err, data) {
      t.equal(err, null, 'should have no error')
      t.equal(data, null, 'should get null for no results')
    }))

  start.write(file)
})

test('wrapper-getztxt-functions', function (t) {
  var start = new Through()
  t.plan(12)
  start
    .pipe(png.set({ type: 'zTXt', keyword: 'cat', value: 'cute' }))
    .pipe(png.getztxt('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'zTXt',
      compressed: true, compression_type: 0 },
        'should get expected result for set/get')
    }))
    .pipe(png.gettext('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.equal(data, null, 'should get null for no results')
    }))
    .pipe(png.getitxt('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.equal(data, null, 'should get null for no results')
    }))
    .pipe(png.getztxt(function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'zTXt',
      compressed: true, compression_type: 0 },
        'should get expected result for set/get')
    }))
    .pipe(png.gettext(function (err, data) {
      t.equal(err, null, 'should have no error')
      t.equal(data, null, 'should get null for no results')
    }))
    .pipe(png.getitxt(function (err, data) {
      t.equal(err, null, 'should have no error')
      t.equal(data, null, 'should get null for no results')
    }))

  start.write(file)
})
