var duplexer = require('duplexer')
var encode = require('png-chunk-stream').encode
var decode = require('png-chunk-stream').decode
var through = require('through2')
var zlib = require('zlib');

function set(key, data) {
  
  var encoder = encode()
  var decoder = decode()
  
  decoder.pipe(through.obj(function (chunk, enc, cb) {
    if(this.found) {
      this.push(chunk)
      return cb()
    }
    if(chunk.type === 'iTXt') {
      var pos = getFieldEnd(chunk.data)
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
  })).pipe(encoder)
  
  return duplexer(decoder, encoder)
}

function get(keyword, callback) {
  // Check if a keyword was given or if it was just a callback.
  if (!callback) {
    if (typeof(keyword) === 'function') {
      callback = keyword
      keyword = null
    }
    else {
      // throw exception if there is no callback.
      throw new Error ("no callback provided");
    }
  }
  
  var encoder = encode()
  var decoder = decode()
  
  decoder.pipe(through.obj(function (chunk, enc, cb) {
    this.push(chunk)
    if(chunk.type === 'tEXt') {
      var pos = getFieldEnd(chunk.data)
      if(chunk.data.slice(0, pos).toString() === keyword) {
        this.found = true

        callback(chunk.data.slice(pos + 1).toString('utf8'));
      }
    }
    else if (chunk.type === 'zTXt') {
      var pos = getFieldEnd(chunk.data)
      if(chunk.data.slice(0, pos).toString() === keyword) {
        this.found = true
        
        var compression_type = chunk.data.slice(pos+1, pos+2);
        unprocessed = chunk.data.slice(pos+3);
        zlib.unzip(unprocessed, function(err, buffer) {
          if(!err) {
            callback(buffer.toString('utf8'));
          }
          else {
            callback(null);
          }
        });
      }
    }
    else if (chunk.type == "iTXt") {
      var pos = getFieldEnd(chunk.data)
      var currentkey = chunk.data.slice(0, pos).toString('utf8');
      
      if (!keyword || currentkey === keyword) {
        this.found = true;
        
        var unprocessed = chunk.data.slice(pos+1);
        var compressed = (unprocessed[0] == 1);
        var compression_type = unprocessed[1];
        
        unprocessed = unprocessed.slice(2);
        pos = getFieldEnd(unprocessed)
        var language = unprocessed.slice(0, pos).toString();
        unprocessed = unprocessed.slice(pos+1);
        
        ps = getFieldEnd(unprocessed);
        var translated = unprocessed.slice(0, pos).toString();
        unprocessed = unprocessed.slice(pos+1);

        // Not sure if this can be tidied up somewhat.
        if (compressed) {
          zlib.unzip(unprocessed, function(err, buffer) {
            if (!err) {
              callback(currentkey, buffer.toString('utf8'));
            }
            else {
              callback(currentkey, null);
            }
          });
        }
        else {
          callback(currentkey, unprocessed.toString('utf8'));
        }
      }
    }
    if(!this.found && chunk.type === 'IEND') {
      callback(null)
    }
    cb()
  })).pipe(encoder)
  
  return duplexer(decoder, encoder)
}

function getFieldEnd(data) {  
  for(var i = 0, len = data.length; i < len; ++i) {
    if(!data[i])
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