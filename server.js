'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

var StoreUrl = require('./lib/urlSchema.js').UrlModel;
var handleLongUrl = require('./lib/handleLongUrl').handleLongUrl
var checkDns = require('./lib/checkDns').checkDns


var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
mongoose
  .connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })//, useFindAndModify: false })
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => {
    console.log(Error, err.message);
  });



app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});



// handle short URL's
app.get('/api/shorturl/:sUrl', function(req, res) {
  StoreUrl.findOne({shortUrl: req.params.sUrl}, function(err, data) {
    if (err) console.error(err);
    !!data ? res.redirect(data.longUrl) : res.json({error: 'short URL not found'});
  })   
})



// handle long URL's
app.post("/api/shorturl/new", function(req, res, next) { 
  checkDns(req, function(err, data) {
    if (err) console.error(err);
    data ? next() : res.json({error: 'invalid URL'});
  })
}, function(req, res) { 
  handleLongUrl(req, function(err, data) {
    if (err) console.error(err);
    res.json(data)
  })
})



app.listen(port, function () {
  console.log('Node.js listening ...');
});