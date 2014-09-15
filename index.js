var streampng = require('streampng')
var duplex = require('duplexer')

function set(keyword, data) {
  
  var chunk = streampng.Chunk.iTXt({
    keyword: keyword,
    text: data
  })
  
  var png = streampng()
  
  png.inject(chunk)
  
  return duplex(png, png.out())
  
}

function get(keyword, cb) {
  var png = streampng()
  var found = false
  png.on('iTXt', function (chunk) {
    if(chunk.keyword === keyword) {
      cb(null, chunk.text)
      found = true
    }
  })
  png.once('error', cb)
  png.once('end', function () {
    if(!found)
      cb(new Error('Not found'))
  })
  return png
}

exports.set = set
exports.get = get