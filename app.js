'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var server = require('./src/sms-server');

server.listen(process.env.SERVER_PORT, function () {
  console.log('Captive Cirrus Portal: http://' + process.env.SERVER_URL + ':' + process.env.SERVER_PORT);
});
