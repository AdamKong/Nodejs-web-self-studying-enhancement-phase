var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MongodbClient = require('mongodb').MongoClient;

module.exports = function () {
	passport.use('local', new LocalStrategy({
		usernameField: 'uname',
		passwordField: 'pword',
		passReqToCallback: true// this is to allow the request being a param in verify callback.
	},function (req, username, password, callback) {
		var url = 'mongodb://localhost:27017/adamBookLib';
		MongodbClient.connect(url, function (err, db) {
			if (err) {
				return callback('Connection to DB failed:' + err, false);
			}else {
				var collection = db.collection('users');
				collection.find({username:username}).toArray(function (err, user) {
					db.close();
					if (err) {
						return callback('User looking up error:' + err, false);
					} else if (!user[0]) {
						return callback('No user found', false);
					} else if (user[0].password !== password) {
						return callback('Password is incorrect', false);
					} else {
						return callback(null, user[0]);
					}
				});
			}
		});
		// user will be added into req.user.
		// you can either user "return" or not before callback.
	}));
};