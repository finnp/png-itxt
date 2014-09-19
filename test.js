var fs = require('fs')
var png = require('./')


// set and get 

fs.createReadStream('test.png')
  .pipe(png.set('cat', 'cute'))
  .pipe(png.get('cat', function (value) {
    console.log(value)
  }))

// this works
fs.createReadStream('test.png')
  .pipe(png.set('cat', 'cute'))
  .pipe(fs.createWriteStream('out.png'))

// // this also works
// fs.createReadStream('out.png')
//   .pipe(png.get('cat', function (value) {
//     console.log(value)
//   }))

// // only the first one is called
// fs.createReadStream('out.png')
//   .pipe(png.get('cat', function (value) {
//     console.log(value)
//     console.log(1)
//   }))
//   .pipe(png.get('cat', function (value) {
//     console.log(value)
//     console.log(2)
//   }))
// 
