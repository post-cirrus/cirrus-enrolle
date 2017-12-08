'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var passwordless = require('passwordless');
var MongoStore = require('passwordless-mongostore');
var routes = require('./routes/index');
var app = express();

var twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
var mongoURI = 'mongodb://' + process.env.MONGOSE_URL + ':' + process.env.MONGOSE_PORT + '/' + process.env.MONGOSE_DB;

passwordless.init(new MongoStore(mongoURI, {
  server: {
    auto_reconnect: true
  },
  mongostore: {
    collection: 'token'
  }
}));

passwordless.addDelivery(
  function (token, uid, recipient, callback) {
    twilio.messages.create({
      body: token,
      to: '+352' + recipient,
      from: process.env.TWILIO_PHONE_NUMBER
    }, function (err, message) {
      callback(err);
    });
  }, { tokenAlgorithm: function () {
    return passwordless._generateNumberToken(1000000);
  }
  }
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Standard express setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressSession({secret: '42', saveUninitialized: false, resave: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({ successRedirect: '/' }));

app.use('/', routes);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

app.listen(process.env.SERVER_PORT, function () {
  console.log('Captive Cirrus Portal: http://' + process.env.SERVER_URL + ':' + process.env.SERVER_PORT);
});
