# png-itxt 
[![Build Status](https://travis-ci.org/briancullen/png-itxt.svg?branch=all-text-chunks)](https://travis-ci.org/briancullen/png-itxt)

Tool for adding and reading textual data to PNGs using streams. The library will read data from any of the three textual data chunks (tEXt, zTXT and iTXt). The data can be searched for a particular keyword, set of keywords that match a regular expression or all keywords. Only iTXt blocks can be added to the PNG data and these block must be uncompressed.

Install with
```
npm install png-itxt
```

## set - Writing iTXt data

Set will modify or add the [key, value] pair. It will overwrite the any iTXt data chunk that already has the specified key.

```js
var pngitxt = require('png-itxt')

fs.createReadStream('input.png')
  .pipe(pngitxt.set('pizza', 'delicous'))
  .pipe(fs.createWriteStream('output.png'))
```

## get - Reading iTXt data

Note: All text blocks (iTXt, tEXT, zTXT) will be found and returned by this utility.

### Callback Signature
The callback to all the get methods is given two parameters. The keyword associated with the chunk being returned and the value which has been uncompressed if necessary.

```js
function pngtxtCallback (key, value) {
    console.log(key, ":", value)
}
```

### Finding a specific keyword
To find the text associated with a specific keyword you must call get and provide both the keyword and a callback. Passing `null` as the keyword will cause all textual chunks to be passed to the callback. If the keyword is not found the callback will be called with `null` for both parameters.

```js
fs.createReadStream('output.png')
  .pipe(pngitxt.get('pizza', function (key, value) {
    console.log(key, ":", value) // pizza : delicious
  }))
```

### Using Regular Expressions
Instead of providing a keyword you can provide a regular expression and all chunks whose keywords match the regular expression will be passed to the callback function. If no chunks are found then the callback will be called once with `null` for both parameters.

```js
fs.createReadStream('output.png')
  .pipe(pngitxt.get(/Pi[z]{2}a/i, function (key, value) {
    console.log(key, ":", value) // pizza : delicious
  }))
```

### Finding all textual chunks
To find all chunks simply provide a callback that takes two parameters. If no textual chunks are found the callback will be called once with `null` for both parameters. Otherwise it will be called for each block.

```js
fs.createReadStream('output.png')
  .pipe(pngitxt.get(function (key, value) {
    console.log(key, ":", value) // cat : delicious
  }))
```
