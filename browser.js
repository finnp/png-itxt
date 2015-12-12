var Through = require('stream').PassThrough
var pngitxt = require('.')

module.exports.set = function (input, data, callback) {
  var dataStream = new Through()
  var resultStream = dataStream.pipe(pngitxt.set(data))

  var result = []
  resultStream.on('data', function(datain) { result.push(datain); })
  resultStream.on('end', function() {
    result = Buffer.concat(result)
    callback(result.toString('base64'))
  })
  dataStream.end(new Buffer (input, 'binary'))
}


module.exports.get = function (input, keyword, filter, callback) {
  pngitxt.get(keyword, filter, callback).write(new Buffer (input, 'binary'))
}

module.exports.iTXt = pngitxt.iTXt
module.exports.zTXt = pngitxt.zTXt
module.exports.tEXt = pngitxt.tEXt