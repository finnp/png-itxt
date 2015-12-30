var png = require('../')
var Through = require('stream').PassThrough
var test = require('tape')

var file = new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/TQBcNTh/AAAAAXRSTlPM0jRW/QAAAApJREFUeJxjYgAAAAYAAzY3fKgAAAAASUVORK5CYII', 'base64')

test('set-append-functions', function (t) {
  var start = new Through()
  var testdata = [{keyword: 'cat', value: 'ugly', type: 'iTXt',
                    compressed: false, compression_type: 0, language: '',
                    translated: ''},
                  { keyword: 'cat', value: 'tabby', type: 'iTXt',
                   compressed: false, compression_type: 0, language: '',
                   translated: ''}]
  t.plan(6)
  start
    .pipe(png.set({ type: 'iTXt', keyword: 'cat', value: 'ugly' }))
    .pipe(png.get('cat', ['iTXt'], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, testdata[0], 'should only find one iTXt chunk')
    }))
    .pipe(png.set({ type: 'iTXt', keyword: 'cat', value: 'tabby' }, { append: true }))
    .pipe(png.get('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, testdata.shift(), 'should find both cat values.')
    }))

  start.write(file)
})

test('set-append-oldinterface-functions', function (t) {
  var start = new Through()
  var testdata = [{keyword: 'cat', value: 'ugly', type: 'iTXt',
                    compressed: false, compression_type: 0, language: '',
                    translated: ''},
                  { keyword: 'cat', value: 'tabby', type: 'iTXt',
                   compressed: false, compression_type: 0, language: '',
                   translated: ''}]
  t.plan(6)
  start
    .pipe(png.set('cat', 'ugly'))
    .pipe(png.get('cat', ['iTXt'], function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, testdata[0], 'should only find one iTXt chunk')
    }))
    .pipe(png.set('cat', 'tabby', { append: true }))
    .pipe(png.get('cat', function (err, data) {
      t.equal(err, null, 'should have no error')
      t.deepEqual(data, testdata.shift(), 'should find both cat values.')
    }))

  start.write(file)
})
