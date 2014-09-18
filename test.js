var fs = require('fs')
var png = require('./')
var assert = require('assert')

fs.createReadStream('test.png')
  .pipe(png.set('cat', 'cute'))
  .pipe(png.get('cat', function (err, value) {
    assert.ok(!err, err)
    assert.equal(value, 'cute')
  }))