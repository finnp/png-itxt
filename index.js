var duplex = require('duplexer')
var rice = require('chunky-rice')

function set(key, data) {

  var decoder = rice.decode()
  var encoder = rice.encode()
  
  // TODO: Check for existing iTXt
  
  decoder.on('data', function (chunk) {
    if(chunk.type() !== 'IEND') return
    decoder.emit('data', rice.chunk('iTXt', createChunk(key, data)))
  }).pipe(encoder)
  
  return duplex(decoder, encoder)
  
}

function get(keyword, cb) {
  var decoder = rice.decode()
  var encoder = rice.encode()
  
  decoder.on('data', function (chunk) {
    if(chunk.type() !== 'iTXt') return
    if(getKeyword(chunk).toString() === keyword) cb(null, chunk.value())
  })

  return duplex(decoder, encoder)
}

function getKeyword(chunk) {  
  for(var i = 0, len = chunk.data.length; i < len; ++i) {
    if(!chunk.data[i])
      break
  }

  return chunk.data.slice(i+1)
}

function createChunk(key, data) {
  var keylen = Math.min(79, Buffer.byteLength(key))
  var buffer = new Buffer(keylen + 5 + Buffer.byteLength(data))
  buffer.write(key, 0, keylen)
  buffer[keylen] = 0
  buffer[keylen + 1] = 0 // no compression
  buffer[keylen + 2] = 0 // no compression
  // no language tag
  buffer[keylen + 3] = 0 
  // no translated keyword
  buffer[keylen + 4] = 0
  buffer.write(data, keylen + 5)
  return buffer
}

exports.set = set
exports.get = get
exports.createChunk = exports.chunk = createChunk