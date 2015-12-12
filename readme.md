# png-itxt 
[![Build Status](https://travis-ci.org/briancullen/png-itxt.svg?branch=all-text-chunks)](https://travis-ci.org/briancullen/png-itxt)

Tool for adding and reading textual data in PNG images using streams. All three textual chunks (`iTXt`, `zTXt` and `tEXt`) can be both read and written by the tool. Chunks can be filtered by chunk type and keyword as required. Compressing and decompressing of data, where appropriate, is handled transparently to the user so you only ever see the uncompressed values.

Three different methods are provided for using the tool:

* command line
* client side browser (thanks to browserify)
* node library (via require)


Install with
```
npm install png-itxt
```

## Using in Node
To use the tool in your node programs you must first require the module. If installed with npm then  you could write the following.

```js
var pngitxt = require('png-itxt')
```

## Constants
The module exports constants for the types of the textual chunks. These can be accessed as follows.

```js
  pngitxt.iTXt  // type for iTXt chunks
  pngitxt.zTXt  // type for zTXt chunks
  pngitxt.tEXt  // type for tEXt chunks
```

## Data Format
Chunk data should be provided and will be returned as an object as shown below. Not that this is the full declaration for a `iTXt` chunk as will be produced by the program. However not all fields are required when passing information to the program. Additionally some of these fields are not relevant to `zTXt` and `tEXt` chunks.

```js
{
  type: 'iTXt',
  keyword: 'keyword',
  value: 'value',
  language: '',
  translated '',
  compressed: false,
  compression_type: 0
}
```
See the table below for details of which fields are relevent to each chunk and what their default values are.

|Field Name           | Chunks     | Default                         
|---------------------|:----------:|-----------------------------------
|**type**             | ALL        | iTXt
|**keyword**          | ALL        | None - must be specified for set
|**value**            | ALL        | None - must be specified for set
|**lanuage**          | iTXt       | *empty string*
|**translated**       | iTXt       | *empty string*
|**compressed**       | iTXt, zTXt | false apart from zTXt chunks
|**compression_type** | iTXt, zTXt | 0 (only vald value)


## set - Writing iTXt data

The `set` function can be used to write new textual chunks to a image or replace existing ones. The following example shows how a new iTXt chunk can be added with the keyword pizza and the value delicious. While only these two options are specified here any of the other fields identified earlier can be specified. If compressed is set to true then the value will be compressed before it is written to the image.

```js
fs.createReadStream('input.png')
  .pipe(pngitxt.set( { keyword: 'pizza', value: 'delicious' } ))
  .pipe(fs.createWriteStream('output.png'))
```

The set function will overwrite any chunk of the same type and the same keyword. In the previous example is there were already iTXt chunks with the keyword pizza (the spec allows for more than one chunk with the same keyword) then the values stored in those chunks would be lost.

It is also possible to have different types of textual chunk with the same keyword. An option is provided to allow you to replace all textual chunks with the same keyword regardless of their type. To do this specify the value `true` as the second parameter to the function.

```js
fs.createReadStream('input.png')
  .pipe(pngitxt.set( { keyword: 'pizza', value: 'delicious' }, true ))
  .pipe(fs.createWriteStream('output.png'))
```

In this case if there were already an iTXt and tEXt chunk with the keyword pizza then they would both be replaced by a single iTXt chunk with the new value.

### Exceptions
An exception will be thrown if you pass in an unknow chunk type.

```js
// This will cause an exception to be thrown.
fs.createReadStream('input.png')
  .pipe(pngitxt.set( { type: 'causeanexception',
        keyword: 'pizza', value: 'delicious' } ))
  .pipe(fs.createWriteStream('output.png'))
```


## get - Reading iTXt data
Retrieval of information is achieved using the get function and callbacks. The callback will be invoked each time a matching chunk is found. It cannot be assumed that callback will only be called once for a particular keyword. You are guaranteed that your callback will be called at least once even if no matching chunks are found - in that case a null is provided instead of data.

### Callback Signature
The callback to all the get methods is given two parameters. The first is used to indicate whether or not an error was encountered. The second returns the data found in the format outlined above. In the case of an error data may not be null. For example if the error was caused when trying to inflate a compressed value then all the other information collected about the chunk will be returned with the error.

```js
function pngtxtCallback (err, data) {
    console.log(data.keyword, ":", data.value)
}
```

### Finding a specific keyword
To find the text associated with a specific keyword you must call get and provide both the keyword and a callback. Passing `null` as the keyword will cause all textual chunks to be passed to the callback. If the keyword is not found the callback will be called with `null` for both parameters.

```js
fs.createReadStream('input.png')
  .pipe(pngitxt.get('pizza', function (err, data) {
    if (!err) {
      console.log(data.keyword, ":", data.value) // pizza : delicious
    }
  }))
```

### Using Regular Expressions
Instead of providing a keyword you can provide a regular expression and all chunks whose keywords match the regular expression will be passed to the callback function. If no chunks are found then the callback will be called once with `null` for both parameters.

```js
fs.createReadStream('input.png')
  .pipe(pngitxt.get(/Pi[z]{2}a/i, function (err, data) {
    if (!err) {
      console.log(data.keyword, ":", data.value) // pizza : delicious
    }
  }))
```

### Finding all textual chunks
To find all chunks simply provide a callback that takes two parameters. If no textual chunks are found the callback will be called once with `null` for both parameters. Otherwise it will be called for each block.

```js
fs.createReadStream('input.png')
  .pipe(pngitxt.get(function (err, data) {
    if (!err) {
      console.log(data.keyword, ":", data.value) // pizza : delicious
    }
  }))
```

### Filtering by Chunk Type
To filter the chunks by type you provide an array of acceptable chunk types. For example the following code shows how to filter the data so that you only get tEXt chunks with the keyword pizza.

```js
// This will find all the tEXt chunks with the keyword pizza
fs.createReadStream('input.png')
  .pipe(pngitxt.get('pizza', [ pngitxt.tEXt ], function (err, data) {
    if (!err) {
      console.log(data.keyword, ":", data.value) // pizza : delicious
    }
  }))
```

Please note that even if you are only looking for one type of chunk the value must be passed as an array or an exception will be thrown. You can specify whatever combination of chunk types that you want but be aware that specifying all 3, as shown below, is the equivalent of having no filter.

```js
// This is the equivalent of having no filter
fs.createReadStream('input.png')
  .pipe(pngitxt.get('pizza', [ pngitxt.tEXt, pngitxt.zTXt, pngitxt.iTXt ],
    function (err, data) {
      if (!err) {
        console.log(data.keyword, ":", data.value) // pizza : delicious
    }
  }))
```

If no keyword is specified then the filter array can be provided as the first parameter to the function.

```js
// This will find all the iTXt and zTXt chunks.
fs.createReadStream('input.png')
  .pipe(pngitxt.get([pngitxt.iTXt, pngitxt.zTXt], function (err, data) {
    if (!err) {
      console.log(data.keyword, ":", data.value) // pizza : delicious
    }
  }))
```

### Exceptions
In all but two cases errors are indicated by passing them to the callback function. However if no callback function is provided or the filter arguement is incorrect (i.e. it is not an array or doesn't contain any valid chunk types) then exceptions will be thrown to indicate this.

```js
// This will cause an exception as there
// is no callback function provided and the
// filter is not correct.
fs.createReadStream('input.png')
  .pipe(pngitxt.get("pizza", 'blah'))
```

## Browser Library
As a test a browser libarary, produced using browserify in standalone mode, is available in the dist folder. Both a normal and minified version is provided. To include it on your webpage simple copy the bundled js file to the appropriate location and add the following. All exports from the library are then available on the pngitxt object.

```html
<srcipt src='pngitxt-browser.min.js'></srcipt>
```

The library exposes the same constats as for node and can be accessed in the same way. The library also exposes the save get and set functions but there are some differences in how they are called. The signature for the get function is shown below. All the parameters are the same apart from the first one which should provide the binary data of the image to check. Such a string can be obtained by using the FileReader.readAsBinaryString method.

```js
// Get input from somewhere
pngitxt.get(input, keyword, filters, function (err, data) {
            if (!err && data) {
              console.log(JSON.stringify(data))
            }
          })
```

The set function has a similar input parameter and a data parameter as before. The last parameter is a callback that gives the base64 encoded version of the data. For example if you wanted to add a n iTXt block to a picture and then display it on a page you could write the following.

```js
// Get input from somewhere
pngitxt.set(input, { keyword: "test", value: "value" },
        function (result) {
          var img = document.createElement('img');
          img.src = "data:image/png;base64," + result;
          document.body.appendChild(img);
        })
```

An simple, rough and ready proof of concept is available of this functionality on a webpage is available in dist/example.html.

## Command Line Tool
The command line tool, called `png-itxt` is provided in the bin folder and will be automatically linked from the node_modules/.bin folder if installed with npm. The two tools provided are as follows.

* ```png-itxt get```
* ```png-itxt set```

### png-itxt get
This command allows you to seach an image for textual chunks of any type and will output the result in JSON format. For example the following command will search the input.png file for a iTXT or zTXt  chunk that has the keyword pizza and then output the results to standard output.

```
png-itxt get -k pizza -f iTXt,zTXt input.png
```

```
  Usage: png-itxt-get [options] <file.png>

  Tool for getting textual information from PNG images

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -k, --keyword <keyword>    keyword to serach for
    -r, --regexp <expression>  regular expression to search by
    -i, --ignorecase           makes the search case insensitive
    -s, --stdin                reads the image data from standard input
    -f, --filter <chunktypes>  comma seperated list of chunk types to return
    -o, --output <file>        write results to a file
```

### png-itxt set
This command allows you to add iTXt chunk to an image. For example the following command will add a chunk with keyword pizza and the value delicious to an image form the file input.png and then save it to output.png. A full list of all the avilable options is at the end of this section.

```
png-itxt set -k pizza -d delicious -o output.png input.png
```

```
  Usage: png-itxt-set [options] <fileIn.png>

  Tool for setting textual information into a PNG images. If no output method is specified output will be put into {fileIn}_out.png

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -k, --keyword <keyword>  keyword to set the value for
    -d, --data <chunkdata>   data to store with the keyword
    -f, --file <datafile>    text file to read the value from
    -v, --valuein            read data to store from standard input
    -c, --compress           compress the value stored in the chunk
    -s, --stdin              read png data from standard input
    -p, --pipe               redirect output to stdout for processing
    -o, --output <file>      file to output PNG data to
```
