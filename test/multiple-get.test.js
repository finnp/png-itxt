var png = require('../')
var Through = require('stream').PassThrough
var test = require('tape')

var file = new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/TQBcNTh/AAAAAXRSTlPM0jRW/QAAAApJREFUeJxjYgAAAAYAAzY3fKgAAAAASUVORK5CYII', 'base64')

var start = new Through()

test('multiple-get', function (t) {
  t.plan(10)
  start
    .pipe(png.get(function (err, data) {
      t.equals(err, null, 'no error should be found')
      t.equals(data, null, 'no data should be found')
    }))
    .pipe(png.set({ type: 'tEXt', keyword: 'the', value: 'cat' }))
    .pipe(png.get(function (err, data) {
      t.equals(err, null, 'no error should be found')
      t.deepEqual(data, { type: 'tEXt', keyword: 'the', value: 'cat' },
        'single chunk returned')
    }))
    .pipe(png.set({ type: 'tEXt', keyword: 'sat', value: 'cat' }))
    .pipe(png.set({ type: 'tEXt', keyword: 'a', value: 'cat' }))
    .pipe(png.get(function (err, data) {
      t.equals(err, null, 'no error should be found')
      t.equals(data.value, 'cat', 'multiple chunks returned')
    }))

  start.write(file)
})
