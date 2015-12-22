var png = require('../')
var Through = require('stream').PassThrough
var test = require('tape')

var file = new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/TQBcNTh/AAAAAXRSTlPM0jRW/QAAAApJREFUeJxjYgAAAAYAAzY3fKgAAAAASUVORK5CYII', 'base64')

test('filter-error-functions', function (t) {
  var start = new Through()
  t.plan(4)
  start
    // .pipe(png.set({ type: 'blah', keyword: "cat", value: "cute" }))
    .pipe(png.get('cat', 'iTXt', function (err, data) {
      t.equals(err.message, 'invalid filter specified',
        'should have an error for invlid filter')
      t.deepEqual(data, null, 'should get no information on error')
    }))
    .pipe(png.get('cat', true, function (err, data) {
      t.equals(err.message, 'invalid filter specified',
        'should have an error for invlid filter')
      t.equals(data, null, 'should get no information on error')
    }))

  start.write(file)
})

test('set-error-functions', function (t) {
  var start = new Through()
  t.plan(1)

  try {
    start.pipe(png.set({ type: 'blah', keyword: 'cat', value: 'cute' }))
    start.write(file)
    t.fail('should have caused an exception with invalid chunk type')
  } catch (err) {
    t.equals(err.message, 'invalid chunk type specified',
      'should cause error with invalid chunk type')
  }
})

test('get-error-functions', function (t) {
  var start = new Through()
  t.plan(1)

  try {
    start.pipe(png.get('cat'))
    start.write(file)
    t.fail('should have caused an exception with no callback')
  } catch (err) {
    t.equals(err.message, 'no callback or invalid arguments provided',
      'should cause error when callback not provided')
  }
})
