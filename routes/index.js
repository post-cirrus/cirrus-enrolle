var express = require('express');
var router = express.Router();

var passwordless = require('passwordless');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('login', { user: req.user });
});

router.post('/', passwordless.requestToken(function (user, delivery, callback) {
        // lookup your user from supplied phone number
        // `user` is the value from your html input (by default an input with name = 'user')
        // for this example we're just return the supplied number
        console.log('1. ' + user);
        callback(null, user);
    }),
    function (req, res) {
       res.render('verify', { uid: req.passwordless.uidToAuth });
    }
);

router.post('/verify', passwordless.acceptToken({ allowPost: true, successRedirect: '/activation', enableOriginRedirect: true}), function(req, res) {
   res.redirect('/');
});

router.get('/activation', passwordless.restricted({ failureRedirect: '/' }), function(req, res) {
   res.render('activation');
});

router.use('*', passwordless.restricted({ failureRedirect: '/' }));

module.exports = router;
