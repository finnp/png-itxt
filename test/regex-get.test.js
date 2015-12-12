var fs = require('fs')
var png = require('../')
var Through = require('stream').PassThrough
var test = require('tape')

var file = new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/TQBcNTh/AAAAAXRSTlPM0jRW/QAAAApJREFUeJxjYgAAAAYAAzY3fKgAAAAASUVORK5CYII', 'base64')

var start = new Through()

test('regex-get', function(t) {
  t.plan(14)
  start
    .pipe(png.set('the', 'cat'))
    .pipe(png.set('thhe', 'cat'))
    .pipe(png.get(/hh/, function(key, value) {
      t.same(key, 'thhe', "simple regex works for key")
      t.same(value, 'cat', "simple regex works for value")
    }))
    .pipe(png.get(/THE/i, function(key, value) {
      t.same(key, 'the', "regex with globals works for key")
      t.same(value, 'cat', "regex with globals works for value")
    }))
    .pipe(png.get(/^t[hH]+e/, function(key, value) {
      t.ok(key, "regex works when option groups defined")
      t.ok(value, "regex works when option groups defined")
    }))
    .pipe(png.get(/THE/, function(key, value) {
      t.deepEqual(key, null, "regex works when nothing to find")
      t.deepEqual(value, null, "regex works when nothing to find")
    }))
    .pipe(png.get('th*', function(key, value) {
      t.deepEqual(key, null, "regex characters should not work in string.")
      t.deepEqual(value, null, "regex characters should not work in string.")
    }))
    .pipe(png.get('th', function(key, value) {
      t.deepEqual(key, null, "strings should not get partial matches.")
      t.deepEqual(value, null, "strings should not get partial matches.")
    }))

    // TODO add tests for when string are passed in and converted to RegExp
  start.write(file)
})

