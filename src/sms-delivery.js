var passwordless = require('passwordless');
var MongoStore = require('passwordless-mongostore');

var twilio = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

var mongoURI = 'mongodb://' + process.env.MONGOSE_URL + ':' +
                              process.env.MONGOSE_PORT + '/' +
                              process.env.MONGOSE_DB;

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

module.exports = passwordless;
