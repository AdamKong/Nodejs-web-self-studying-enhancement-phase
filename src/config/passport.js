var passport = require('passport');
var MongodbClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

module.exports = function (app) {

	require('./strategies/local.strategy')();

	// to restore persistence authentication
	// passport will automatically obtain the values (user or id), to execute
	// the user-definded functions function (user, callback){} and function (id, callback){}
	passport.serializeUser(function (user, callback) {
		console.log('serializeUser happens');
		callback(null, user._id);
	});

	// in deserializeUser() function, passport only provides user's id, and developer needs to
	// get user according to it (i.e. from db).
	passport.deserializeUser(function (id, callback) {
		console.log('deserializeUser happens');
		var url = 'mongodb://localhost:27017/adamBookLib';
		MongodbClient.connect(url, function (err, db) {
			if (err) {
				callback('DB connection failed when deserializing user: ' + err, false);
			} else {
				var collection = db.collection('users');
				collection.find({_id:new ObjectId(id)}).toArray(function (err, user) {
					db.close();
					if (err) {
						callback('User looking up failed when deserializing: ' + err, false);
					}else if (!user[0]) {
						callback('No user found when deserializing user', false);
					} else {
						callback(null, user[0]);
					}
				});
			}
		});
	});

	app.use(passport.initialize());
	app.use(passport.session());
};
