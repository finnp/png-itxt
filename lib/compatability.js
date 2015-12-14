var png = require('..')

// Wrapper function for those wanting to use
// the old function interface.
function getv1 (keyword, callback) {
  if (keyword === null) {
    // to stop find all behaviour from kicking
    // in - should find nothing as an empty
    // keyword is invalid.
    keyword = '';
  }
  
  if (!callback) {
    if (typeof (keyword) == 'function') {
      callback = keyword
      keyword = null
    }
    else {
      throw new Error ("no callback specified")
    }
  }
  
  return png.get(keyword, [ png.iTXt ], function(err, data) {
    if (err) {
      // Not sure what to do here! Will return
      // keyword if possible otherwise just null.
      if (data && keyword) {
        callback(data.keyword, null)
      }
      else {
        callback(null, null)
      }
    }
    else if (data === null) {
      callback(null, null)
    }
    else {
      if (keyword !== null) {
        callback(data.value)
      }
      else {
        callback(data.keyword, data.value)
      }
    }
  });
}

// Wrapper function for those wanting to use
// the old function interface.
function setv1 (keyword, value) {
  return png.set({ type: png.iTXt, keyword: keyword, value: value })
}

module.exports.getv1 = getv1;
module.exports.setv1 = setv1;