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

router.post('/verify', passwordless.acceptToken({ allowPost: true }), function (req, res) {
    console.log('/verify '+ req.body.uid);
    console.log('/verify '+ req.body.token);
    res.render('activation');
});

router.get('/activation', passwordless.restricted({ failureRedirect: '/' }), function(req, res) {
   res.render('activation');
});

router.get('/error', function(req, res) {
  res.render('error', { message: 'Authentication Failed' });
});

// /* GET restricted site. */
// router.get('/activation', passwordless.restricted(),
//  function(req, res) {
//   console.log(req.user);
//   res.render('activation', { user: req.user });
// });
//
// // /* GET login screen. */
// // router.get('/login', function(req, res) {
// //   res.render('login', { user: req.user });
// // });
//
// router.post('/otp', function(req, res) {
//   res.render('sent');
// });
//
// /* POST login screen. */
// router.post('/authenticate',
// 	passwordless.requestToken(
// 		// Simply accept every user
// 		function(user, delivery, callback) {
//       console.log(user);
// 			callback(null, user);
// 			// usually you would want something like:
// 			// User.find({email: user}, callback(ret) {
// 			// 		if(ret)
// 			// 			callback(null, ret.id)
// 			// 		else
// 			// 			callback(null, null)
// 			// })
// 		}),
// 	function(req, res) {
//   		res.render('sent');
// });

module.exports = router;
