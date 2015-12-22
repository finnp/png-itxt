var png = require('../')
var Through = require('stream').PassThrough
var test = require('tape')

var file = new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/TQBcNTh/AAAAAXRSTlPM0jRW/QAAAApJREFUeJxjYgAAAAYAAzY3fKgAAAAASUVORK5CYII', 'base64')

test('remove-functions', function (t) {
  var start = new Through()
  t.plan(10)
  start
    .pipe(png.set({ keyword: 'cat', value: 'cute' }))
    .pipe(png.set({ type: 'tEXt', keyword: 'cat', value: 'cute' }))
    .pipe(png.get('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.equal(data.keyword, 'cat', 'should get expected result twice')
    }))
    .pipe(png.set({ keyword: 'cat', value: null }))
    .pipe(png.get('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'tEXt' },
        'should only get one value for cat')
    }))
    .pipe(png.set({ keyword: 'cat', value: null }))
    .pipe(png.get('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, { keyword: 'cat', value: 'cute', type: 'tEXt' },
        'should still get one value for cat')
    }))
    .pipe(png.set({ keyword: 'cat', value: null }, true))
    .pipe(png.get('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.equal(data, null, 'should not find any chunks')
    }))

  start.write(file)
})
