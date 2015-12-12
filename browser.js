var Through = require('stream').PassThrough
var pngitxt = require('.')

module.exports.set = function (input, data, callback) {
  var dataStream = new Through()
  dataStream.pipe(pngitxt.set(data))

  var result = []
  dataStream.on('data', function(datain) { 
    result.push(datain);
    console.log("information in...")
  })
  dataStream.on('end', function() {
    console.log("finishing up...")
    result = new Buffer(result, 'binary')
    callback(result.toString('base64'))
  })
  console.log("-", input.length)
  dataStream.write(new Buffer (input, 'binary'))
}


module.exports.get = function (input, keyword, filter, callback) {
  pngitxt.get(keyword, filter, callback).write(new Buffer (input, 'binary'))
}

module.exports.iTXt = pngitxt.iTXt
module.exports.zTXt = pngitxt.zTXt
module.exports.tEXt = pngitxt.tEXt