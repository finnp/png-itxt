# png-itxt 
[![Build Status](https://travis-ci.org/briancullen/png-itxt.svg?branch=all-text-chunks)](https://travis-ci.org/briancullen/png-itxt)

Under development. Seems stable but has not been properly tested.

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

Note: All text blocks (iTXt, tEXT, zTXT) will be found and returned by this utility. Compressed values will be decompressed before being returned.

### Finding a specific keyword
If the keyword is not found the callback will be `null`.

```js
fs.createReadStream('output.png')
  .pipe(pngitxt.get('pizza', function (key, value) {
    console.log(key, ":", value) // delicious
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
