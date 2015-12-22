var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var adminRouter = express.Router();

var books = [
		{
			title: 'War and Peace',
			genre: 'Historical Fiction',
			author: 'Lev Nikolayevich Tolstoy',
			bookId: 656,
			read: false
		},
		{
			title: 'Les Miserables',
			genre: 'Historical Fiction',
			author: 'Victor Hugo',
			bookId: 24280,
			read: false
		},
		{
			title: 'The Time Machine',
			genre: 'Science Fiction',
			author: 'H. G. Wells',
			read: false
		},
		{
			title: 'A Journey into the Center of the earth',
			genre: 'Science Fiction',
			author: 'Jules Verne',
			read: false
		},
		{
			title: 'The Dark World',
			genre: 'Fantasy',
			author: 'Henry Kuttner',
			read: false
		}];

var router = function (nav) {

	adminRouter.use(function (req, res, next) {
		if (!req.user) {
			return res.redirect('/');
		}
		next();
	});

	adminRouter.route('/addBooks')
		.get(function (req, res) {

		var url = 'mongodb://localhost:27017/adamBookLib';

		var insertBooks = function (db, bks, callback) {
			var collection = db.collection('myBooks');
			collection.insertMany(bks, function (err, result) {
				if (!err) {
					callback(result);
				} else {
					console.log('Books inserting failed: ' + err);
					res.redirect('/');
				}
			});
		};

		MongoClient.connect(url, function (err, db) {
			if (!err) {
				insertBooks(db, books, function (result) {
					db.close();
					console.log('Books inserted!');
					res.send(result);
				});
			}else {
				console.log('DB connection failed: ' + err);
				res.redirect('/');
			}
		});
	});

	return adminRouter;
};

module.exports = router;