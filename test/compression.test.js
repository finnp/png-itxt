var png = require('../')
var Through = require('stream').PassThrough
var test = require('tape')

var zTXtData = new Buffer('iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAAAAACT4cgpAAAABGdBTUEAAYagMeiWXwAAAA50RVh0VGl0bGUAUG5nU3VpdGVPVc9MAAAAMXRFWHRBdXRob3IAV2lsbGVtIEEuSi4gdmFuIFNjaGFpawood2lsbGVtQHNjaGFpay5jb20pjsxHHwAAAEF6VFh0Q29weXJpZ2h0AAB4nHPOL6gsykzPKFEIz8zJSc1VKEvMUwhOzkjMzNZRCM7MS08syC9KVTC0tDTVtTQDAIthD6RSWpQSAAAAu3pUWHREZXNjcmlwdGlvbgAAeJwtjrEOwjAMRPd+xU1Mpf/AhFgQv2BcQyLcOEoMVf8eV7BZvnt3dwLbUrOSZyuwBwhdfD/yQk/p4CbkMsMNLt3hSYYPtWzv0EytHX2r4QsiJNyuZzysLeQTLoX1PQdLTYa7Er8Oa8ou4w8cUUnFI3zEmj2BtCYCJypF9PcbvFHpNQIKb//gPuGkinv24yzVUw9Qbd17mK3NuTyHfW2s6VV4b0dt0qX49AUf8lYE8mJ6iAAAAEB6VFh0U29mdHdhcmUAAHiccy5KTSxJTVHIz1NIVPBLjQgpLkksyQTykvNz8osUSosz89IVlAryckvyC/LSlfQApuwRQp5RqK4AAAAdelRYdERpc2NsYWltZXIAAHiccytKTS1PLErVAwARVQNg1K617wAAAMhJREFUeJxd0cENwjAMBVAfKkAI8AgdoSOwCiNU4sgFMQEbMAJsUEZgA9igRj2VAp/ESVHiHCrnxXXtlGAWJXFrgQ1InvGaiKnxtIBtAvd/zQj8teDfnwnRjT0sFLhm7E9LCucHoNB0jsAoyO8F5JLXHqbtRgs76FC6gK++e3hw510DOYcvB3CPKiQo7CrpeezVg6DX/h7a6efoQPdDvCASCWPUcRaei07bVSOEKTExty6NgRVyEOTwZgMX5DCwgeRnaCilgXT9AB7ZwkX4/4lrAAAAAElFTkSuQmCC', 'base64')

var iTXtData = new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAoAAAALCAYAAABGbhwYAAAABGdBTUEAALGPC/xhBQAAAARzQklUBQUFBU2lLfYAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAscENBTGJvZ3VzIHVuaXRzAAAAAAAAAP//AAJmb28vYmFyADEuMGUwADY1LjUzNWUzV0B7HAAAAAd0SU1FB8wGBxE6CI7/JnoAAAAGYktHRADgAOAAgJXNLyAAAAAJdEVYdFRpdGxlAFBOR9wBeTUAAAAnaVRYdEF1dGhvcgAAAGZyAEF1dGV1cgBMYSBwbHVtZSBkZSBtYSB0YW50ZU/bcuEAAADKelRYdERlc2NyaXB0aW9uAAB42k2PTWrDQAyF9z7FW7aQmEIhJwjZtQ1ucNaTGTkW2NIwkhN8+4y76vbxvb+OJFGhhNuKMxVjc5JI0AE9G6vgzed3dGHFpYRIpek3quqf7ccOi7Hc4SPhwjMZvumJTucgGFQcQRKOX6erajq0zS9vyeeffr/FJa28qCNxoTj5Clty1uJgcSpTLUvQxfPiu8ZHNgw8EcZguBEJosqDilfItRb9d/Ec7oQHB4Qmq/k+F41kf1vrv9y+AG4IVyNpKlL5AAAAb2lUWHRXYXJuaW5nAAEAZGUAV0FSTklORwB4nAXBwQ2DMAwF0Hun+AOUDIEKiDMTuPIHWSKOFCdB6vR9bwlYYLB+S6O/0TPUGMRHGg3mUAls+zrNdutZapb26vnXH3Hl7Qk4jAhzxcUh1RueUpWe/rKYICRVGEZ3AAAAG0lEQVQoU2P8DwQMRAAmKE0QjCrEC6itkIEBABCLBBKfcg7nAAAAAElFTkSuQmCC', 'base64')

test('compression-zTXt-read', function (t) {
  var start = new Through()
  t.plan(7)
  start
    .pipe(png.get('Copyright', function (err, data) {
      t.equals(err, null, 'no error should be found')
      t.equals(data.keyword, 'Copyright', 'Copyright zTXt chunk should be found')
      t.equals(data.value, 'Copyright Willem van Schaik, Singapore 1995-96', 'check uncompressed value returned')
    }))
    .pipe(png.get(/^D[ei]sc/, function (err, data) {
      t.equals(err, null, 'no error should be found')
      t.ok(data.value, 'check multiple compressed values returned')
    }))
  start.write(zTXtData)
})

test('compression-zTXt-write', function (t) {
  var start = new Through()
  t.plan(2)
  start
    .pipe(png.set({ type: 'zTXt', keyword: 'test', value: 'value' }))
    .pipe(png.get('test', ['zTXt'], function (err, data) {
      t.equals(err, null, 'no error should be found')
      t.deepEquals(data, { type: 'zTXt', keyword: 'test', value: 'value',
      compressed: true, compression_type: 0 }, 'found compressed zTXt chunk')
    }))
  start.write(zTXtData)
})

test('compression-iTXt-read', function (t) {
  var start = new Through()
  t.plan(3)
  start
    .pipe(png.get('Warning', function (err, data) {
      t.equals(err, null, 'no error should be found')
      t.equals(data.keyword, 'Warning', 'Warning iTXt compressed chunk should be found')
      t.equals(data.value, 'Es is verboten, um diese Datei in das GIF-Bildformat\numzuwandeln.  Sie sind gevarnt worden.', 'check uncompressed value returned')
    }))

  start.write(iTXtData)
})

test('compression-iTXt-write', function (t) {
  var start = new Through()
  var test_data = {
    type: 'iTXt',
    keyword: 'test',
    value: 'value',
    compressed: true,
    compression_type: 0,
    language: '',
    translated: ''
  }

  t.plan(2)
  start
    .pipe(png.set(test_data))
    .pipe(png.get(test_data.keyword, ['iTXt'], function (err, data) {
      t.equals(err, null, 'no error should be found')
      t.deepEquals(data, test_data, 'found compressed iTXt chunk')
    }))

  start.write(iTXtData)
})
