var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var passport = require('passport');
var authRouter = express.Router();

module.exports = function () {

	authRouter.route('/register')
		.post(function (req, res) {
		var url = 'mongodb://localhost:27017/adamBookLib';

		// create a method to add user.
		var addUser = function (db, user, callback) {
			var collection = db.collection('users');
			collection.insertOne(user, function (err, result) {
				if (!err) {
					callback(result);
				} else {
					res.send(500,'Inserting user failed: ' + err);
				}
			});
		};

		//add user into db.
		MongoClient.connect(url, function (err, db) {
			if (!err) {
				addUser(db, req.body, function (result) {
					db.close();
					req.logIn(result.ops[0], function (err) {
						if (err) {
							console.log('Login Failure: ' + err);
							res.redirect('/');
						} else {
							res.redirect('/auth/profile');
						}
					});
				});
			} else {
				console.log('DB connection failed');
				res.send(500, 'DB connection failed: ' + err);
			}
		});
	});

	authRouter.route('/login')
		.post(passport.authenticate('local'), function (req, res) {
			res.redirect('/auth/profile');
		});

	authRouter.route('/profile')
		.all(function (req, res, next) {
			if (!req.user) {
				res.redirect('/');
			}
			next();
		})
		.get(function (req, res) {
			res.send(req.user);
		});

	return authRouter;
};

