var nets = require('nets')
var defined = require('defined')

module.exports = function googlePanorama (opt, cb) {
  opt = opt || {}
  if (Array.isArray(opt)) {
    opt = { location: opt }
  }
  var location = opt.location
  if (!location) {
    throw new TypeError('must provide location [ lat, lng ]')
  }

  var radius = defined(opt.radius, 50)
  var url = 'https://cbks0.google.com/cbk?cb_client=apiv3&authuser=0&hl=en&output=polygon&it=1%3A1&rank=closest&ll=' + location[0] + ',' + location[1] + '&radius=' + radius
  nets({ url: url, json: true }, function (err, res, body) {
    if (err) {
      return cb(bail(location))
    }
    if (!/^2/.test(res.statusCode)) {
      return cb(new Error('http status code: ' + res.statusCode))
    }
    if (!body || !body.result || !body.result.length) {
      return cb(bail(location))
    }
    cb(null, body.result[0])
  })
}

function bail (location) {
  return new Error('could not find street view at: [ ' + location.join(', ') + ' ]')
}