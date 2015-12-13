var fs = require('fs')
var png = require('../')
var Through = require('stream').PassThrough
var test = require('tape')

var file = new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/TQBcNTh/AAAAAXRSTlPM0jRW/QAAAApJREFUeJxjYgAAAAYAAzY3fKgAAAAASUVORK5CYII', 'base64')

test('wrapper-getset-functions', function (t) {
  var start = new Through()
  t.plan(3)
  start
    .pipe(png.setitxt("cat", "cute" ))
    .pipe(png.getitxt('cat', function (value) {
      t.equal(value, "cute", "should get the value cute");
    }))
    .pipe(png.getitxt('pig', function (value) {
      t.equal(value, null, 'should get null for no results')
    }))
    .pipe(png.setitxt('cat', 'fluffy' ))
    .pipe(png.getitxt('cat', function (value) {
      t.equal(value, 'fluffy', 'should only get one value')
    }))
    
  start.write(file)
})

test('wrapper-multiple-getset-functions', function (t) {
  var start = new Through()
  var expected = [{ keyword: 'the', value: 'cat' },
                 { keyword: 'sat', value: 'cat' },
                 { keyword: 'a', value: 'cat' } ]
  
  t.plan(10)
  start
    .pipe(png.getitxt(function(keyword, value) {
      t.equals(keyword, null, "no keyword should be found")
      t.equals(value, null, "no value should be found")
    }))
    .pipe(png.setitxt('the', 'cat'))
    .pipe(png.getitxt(function(keyword, value) {
      t.equals(keyword, 'the', 'single keyword should be found')
      t.equals(value, 'cat', "single value should be found")
    }))
    .pipe(png.setitxt('sat', 'cat'))
    .pipe(png.setitxt('a', 'cat' ))
    .pipe(png.getitxt(function(keyword, value) {
      var result = expected.shift()
      t.equals(keyword, result.keyword, "multiple keys found in right order")
      t.equals(value, result.value, "multiple values found in right order")
    }))
    
  start.write(file)
})
