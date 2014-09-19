var fs = require('fs')
var png = require('./')

fs.createReadStream('test.png')
  .pipe(png.set('cat', 'cute'))
  .pipe(png.get('cat', function (value) {
    if(value === 'cute')
      console.log('pass')
    else 
      throw new Error('fail')
  }))
  .pipe(png.get('pig', function (value) {
    // should this return null or something?
    throw new Error('does not exist')
  }))
  .pipe(png.get('cat', function (value) {
    if(value === 'cute')
      console.log('pass')
    else 
      throw new Error('fail')
  }))