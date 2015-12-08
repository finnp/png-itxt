var fs = require('fs')
var png = require('../')
var Through = require('stream').PassThrough
var test = require('tape')

var file = new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/TQBcNTh/AAAAAXRSTlPM0jRW/QAAAApJREFUeJxjYgAAAAYAAzY3fKgAAAAASUVORK5CYII', 'base64')

var start = new Through()

test('base-functions', function (t) {
  t.plan(3)
  start
    .pipe(png.set('cat', 'cute'))
    .pipe(png.get('cat', function (key, value) {
      t.equal(value, 'cute', 'should get value')
    }))
    .pipe(png.get('pig', function (key, value) {
      t.deepEqual(value, null, 'should get null')
    }))
    .pipe(png.set('cat', 'fluffy'))
    .pipe(png.get('cat', function (key, value) {
      t.equal(value, 'fluffy', 'should only be called once')
    }))
    
  start.write(file)
})
