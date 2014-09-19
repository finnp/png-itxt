# png-itxt [![Build Status](https://travis-ci.org/finnp/png-itxt.svg?branch=master)](https://travis-ci.org/finnp/png-itxt)

Install with
```
npm install png-itxt
```

## set - Writing iTXt data

Set will modify or add the [key, value] pair.

```js
var pngitxt = require('png-itxt')

fs.createReadStream('input.png')
  .pipe(pngitxt.set('pizza', 'delicous'))
  .pipe(fs.createWriteStream('output.png'))
```

## get - Reading iTXt data

If the keyword is not found the callback will be `null`.

```js
fs.createReadStream('output.png')
  .pipe(pngitxt.get('pizza', function (data) {
    console.log(data) // delicious
  }))
```