var mongo = require('mongodb');
var mongoose = require('mongoose');
var StoreUrl = require('./urlSchema.js').UrlModel;
var getShortUrl = require('./getShortUrl').getShortUrl

var handleLongUrl = function(req, done) {
  
  // check for instance of long url in database
  StoreUrl.findOne({longUrl: req.body.url}, function(err, data) {
    if (err) console.error(err);

    if (!!data) { // if url already in database, respond with json
      done(null, {originalUrl: data.longUrl, shortUrl: data.shortUrl});
    } else { // if url not in database, save url to database
      StoreUrl.countDocuments(function(err, count) { // check if database is empty
        if (err) console.error(err);
  
        if (count === 0) { // if database empty
          // add first entry into database, set short url to 1
          let newUrl = new StoreUrl({longUrl: req.body.url, shortUrl: 1})
            .save(function(err) {
              if (err) console.error(err);
            }) 
          
          done(null, {originalUrl: req.body.url, shortUrl: 1}) // return json response
        } else { // if database not empty get highest short url and add 1 for new short url
          getShortUrl(function(err, data) {
            let newUrl = new StoreUrl({longUrl: req.body.url, shortUrl: data})
              .save(function(err) {
                if (err) console.error(err);
              }) 
            
            done(null, {originalUrl: req.body.url, shortUrl: data}) // return json response
          }) 
        }
      })
    }
  })
}

exports.handleLongUrl = handleLongUrl;