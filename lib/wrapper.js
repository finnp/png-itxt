var png = require('..')

module.exports.getitxt = function (keyword, callback) {
  if (!callback && typeof (keyword) === 'function') {
    callback = keyword
    keyword = null
  }
  return png.get(keyword, [ png.iTXt ], callback)
}

module.exports.gettext = function (keyword, callback) {
  if (!callback && typeof (keyword) === 'function') {
    callback = keyword
    keyword = null
  }
  return png.get(keyword, [ png.tEXt ], callback)
}

module.exports.getztxt = function (keyword, callback) {
  if (!callback && typeof (keyword) === 'function') {
    callback = keyword
    keyword = null
  }
  return png.get(keyword, [ png.zTXt ], callback)
}
