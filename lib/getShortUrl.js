//var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var StoreUrl = require('./urlSchema.js').UrlModel;

var getShortUrl = function(done) {
  StoreUrl.find({})
    .sort({shortUrl: 'desc'})
    .limit(1)
    .exec(function(err, data) {
      if (err) return console.error(err);
      let newShortUrl = data[0].shortUrl + 1;  
      done(null, newShortUrl)
    });
}

exports.getShortUrl = getShortUrl;