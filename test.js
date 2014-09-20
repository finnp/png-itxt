var fs = require('fs')
var png = require('./')
var Through = require('stream').PassThrough

var file = new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/TQBcNTh/AAAAAXRSTlPM0jRW/QAAAApJREFUeJxjYgAAAAYAAzY3fKgAAAAASUVORK5CYII', 'base64')

var start = new Through()

start
  .pipe(png.set('cat', 'cute'))
  .pipe(png.get('cat', function (value) {
    if(value === 'cute') console.log('pass')
    else throw new Error('fail')
  }))
  .pipe(png.get('pig', function (value) {
    if(value === null) console.log('pass')
    else throw new Error('Should be null')
  }))
  .pipe(png.set('cat', 'fluffy'))
  .pipe(png.get('cat', function (value) {
    if(value === 'fluffy') console.log('pass')
    else throw new Error('fail')
  }))
  
start.write(file)