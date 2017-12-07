var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var passwordless = require('passwordless');
var rn = require('random-number');

var accountSid = 'AC168c3f283b37a750e63040e171f15f83'         // your twilio account sidvar
var authToken = 'e2ec114e333f2838e7c7f5893e97fac8'   // your twilio account auth tokenvar
var twilio = require('twilio')(accountSid, authToken)

var MongoStore = require('passwordless-mongostore');
var email   = require("emailjs");

var routes = require('./routes/index');

var app = express();

var yourEmail = process.env.CIRRUS_EMAIL || 'jazevedo@pt.lu';
var yourPwd = process.env.CIRRUS_EMAIL_PASSWORD || 'password';
var smtpServer = process.env.EMAIL_SERVER || 'smtp.pt.lu';
var smtpPort = process.env.EMAIL_SERVER_PORT || 25;
var smtpSSL = process.env.EMAIL_SERVER_SSL || false;

var smtpServer  = email.server.connect({
   user:    yourEmail,
   password: yourPwd,
   host:    smtpServer,
   ssl:     smtpSSL
});

var pathToMongoDb = 'mongodb://localhost:27017/passwordless-simple-mail';

var host = 'http://localhost:3000/';

// Setup of Passwordless
passwordless.init(new MongoStore(pathToMongoDb));
// passwordless.addDelivery(
//     function(tokenToSend, uidToSend, recipient, callback) {
//         // Send out token
//         smtpServer.send({
//            text:    'Hello!\nYou can now activate your account here: '
//                 + host + '?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend),
//            from:    yourEmail,
//            to:      recipient+'@sms.luxgsm.lu',
//            subject: 'Cirrus'
//         }, function(err, message) {
//             if(err) {
//                 console.log(err);
//             }
//             callback(err);
//         });
//     });

var gen = rn.generator({
  min:  10,
  max:  99,
  integer: true
})

passwordless.addDelivery(
  function(token, uid, recipient, callback) {
    twilio.messages.create({
      body: token,
      to: '+352'+recipient,
      from: '+32460205745'
    }, function(err, message) {
      callback(err);
    });
  }, { tokenAlgorithm: function() {
      return gen().toString()+''+gen().toString()+''+gen().toString();
    }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Standard express setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressSession({secret: '42', saveUninitialized: false, resave: false}));
app.use(express.static(path.join(__dirname, 'public')));

// Passwordless middleware
app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({ successRedirect: '/activation' }));

// CHECK /routes/index.js to better understand which routes are needed at a minimum
app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Captive Cirrus Portal server listening on port ' + server.address().port);
});
