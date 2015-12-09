var duplexer = require('duplexer')
var encode = require('png-chunk-stream').encode
var decode = require('png-chunk-stream').decode
var through = require('through2')
var zlib = require('zlib');

var chunkHandlers = {
  "iTXt": function (keyword, data, callback) {
    
    var compressed = (data[0] == 1);
    var compression_type = data[1];

    var unprocessed = data.slice(2);
    var pos = getFieldEnd(unprocessed)
    var language = unprocessed.slice(0, pos).toString('utf8');
    unprocessed = unprocessed.slice(pos+1);

    pos = getFieldEnd(unprocessed);
    var translated = unprocessed.slice(0, pos).toString('utf8');
    unprocessed = unprocessed.slice(pos+1);

    // Not sure if this can be tidied up somewhat.
    if (compressed) {
      zlib.unzip(unprocessed, function(err, buffer) {
        if (!err) {
          callback(keyword, buffer.toString('utf8'));
        }
        else {
          callback(keyword, null);
        }
      });
    }
    else {
      callback(keyword, unprocessed.toString('utf8'));
    }
  },
  "tEXt": function (keyword, data, callback) { callback(keyword, data.toString('utf8')); },
  "zTXt": function (keyword, data, callback) { 
    var compression_type = data[0] 
    zlib.unzip(data.slice(1), function(err, buffer) {
      if(!err) {
        callback(keyword, buffer.toString('utf8'));
      }
      else {
        callback(keyword, null);
      }
    });
  }
};

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
  
  // If a keyword has been specified make sure it
  // is a regular expression.
  if (keyword && (!(keyword instanceof RegExp))) {
    keyword = new RegExp(keyword)
  }
  
  var encoder = encode()
  var decoder = decode()
  
  decoder.pipe(through.obj(function (chunk, enc, cb) {
    this.push(chunk)
    
    // Sees if there is a handler for the current type.
    var handler = chunkHandlers[chunk.type]
    if (handler) {
      // If there is get the keyword and it is one we are
      // looking for then pass it to the handler.
      var pos = getFieldEnd(chunk.data)
      var currentkey = chunk.data.slice(0, pos).toString('utf8');

      if (!keyword || keyword.test(currentkey)) {
        this.found = true;
        handler(currentkey, chunk.data.slice(pos + 1), callback)
      }
    }
    else if(chunk.type === 'IEND' && (!this.found)) {
      callback(null, null)
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