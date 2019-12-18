var mongoose = require('mongoose');

// url schema
var storeUrlSchema = new mongoose.Schema({
  longUrl: String,
  shortUrl: Number
}, {timestamps: true});

var StoreUrl = mongoose.model("StoreUrl", storeUrlSchema);

exports.UrlModel = StoreUrl;