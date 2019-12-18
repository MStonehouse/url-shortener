var dns = require('dns');

var checkDns = function(req, done) {
  let lookupUrl = req.body.url.replace(/(.+?\/\/|\/.+|\/+)/g, '')
  
  dns.lookup(lookupUrl, function(err, address) {
    if (err) console.error(err);
    done(null, !!address)
  })
}

exports.checkDns = checkDns;