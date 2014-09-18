# png-itxt [![Build Status](https://travis-ci.org/finnp/png-itxt.svg?branch=master)](https://travis-ci.org/finnp/png-itxt)

Install with
```
npm install png-itxt
```

## Writing iTXt data

```js
var pngitxt = require('png-itxt')

fs.createReadStream('input.png')
  .pipe(pngitxt.set('pizza', 'delicous'))
  .pipe(fs.createWriteStream('output.png'))
```

## Reading iTXt data
```js
fs.createReadStream('output.png')
  .pipe(pngitxt.get('pizza', function (err, data) {
    console.log(data) // delicious
  }))
```