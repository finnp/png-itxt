# png-itxt


Windows        | Mac/Linux   
-------------- | ------------
[![Windows Build status](http://img.shields.io/appveyor/ci/finnp/png-itxt.svg)](https://ci.appveyor.com/project/finnp/png-itxt/branch/master) | [![Build Status](https://travis-ci.org/finnp/png-itxt.svg?branch=master)](https://travis-ci.org/finnp/png-itxt)


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

### Finding a specific keyword
If the keyword is not found the callback will be `null`.

```js
fs.createReadStream('output.png')
  .pipe(pngitxt.get('pizza', function (data) {
    console.log(data) // delicious
  }))
```

### Finding all iTXt chunks
If no keywords are found the callback will be called once with `null` for both parameters. Otherwise it will be called for each block.

```js
fs.createReadStream('output.png')
  .pipe(pngitxt.get(function (key, value) {
    console.log(key, ":", value) // delicious
  }))
```
