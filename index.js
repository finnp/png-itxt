var pumpify = require('pumpify')
var encode = require('png-chunk-stream').encode
var decode = require('png-chunk-stream').decode
var through = require('through2')

function set(key, data) {

  return pumpify(
    decode(), 
    through.obj(function (chunk, enc, cb) {
      if(this.found) {
        this.push(chunk)
        return cb()
      }
      if(chunk.type === 'iTXt') {
        var pos = getKeyEnd(chunk)
        this.found = chunk.data.slice(0, pos).toString() === key
      }
      if(this.found || chunk.type === 'IEND') {
          this.push({
            'type': 'iTXt',
            'data': createChunk(key, data)
          })
      }
      if(!this.found) this.push(chunk)
      cb()
    }),
    encode()
  )
}

function get(keyword, callback) {
  return pumpify(
    decode(),
    through.obj(function (chunk, enc, cb) {
      this.push(chunk)
      if(chunk.type === 'iTXt') {
        var pos = getKeyEnd(chunk)
        if(chunk.data.slice(0, pos).toString() === keyword) {
          this.found = true
          callback(chunk.data.slice(pos + 5).toString('utf8'))
        }
      }
      if(!this.found && chunk.type === 'IEND') {
        callback(null)
      }
      cb()
    }),
    encode()
  )
}

function getKeyEnd(chunk) {  
  for(var i = 0, len = chunk.data.length; i < len; ++i) {
    if(!chunk.data[i])
      break
  }
  return i
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