var Through = require('stream').PassThrough
var pngitxt = require('.')

module.exports.set = function (input, data, callback) {
  var dataStream = new Through()
  var resultStream = dataStream.pipe(pngitxt.set(data))

  var result = []
  resultStream.on('data', function (datain) { result.push(datain) })
  resultStream.on('end', function () {
    result = Buffer.concat(result)
    callback(result.toString('binary'))
  })
  dataStream.end(new Buffer(input, 'binary'))
}

module.exports.get = function (input, keyword, filter, callback) {
  pngitxt.get(keyword, filter, callback).end(new Buffer(input, 'binary'))
}

module.exports.getitxt = function (input, keyword, callback) {
  pngitxt.getitxt(keyword, callback).end(new Buffer(input, 'binary'))
}

module.exports.getztxt = function (input, keyword, callback) {
  pngitxt.getztxt(keyword, callback).end(new Buffer(input, 'binary'))
}

module.exports.gettext = function (input, keyword, callback) {
  pngitxt.gettext(keyword, callback).end(new Buffer(input, 'binary'))
}

module.exports.iTXt = pngitxt.iTXt
module.exports.zTXt = pngitxt.zTXt
module.exports.tEXt = pngitxt.tEXt
