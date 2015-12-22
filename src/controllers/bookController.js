var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectId;

var bookController = function (bookService, nav) {

	var getIndex = function (req, res) {

		var url = 'mongodb://localhost:27017/adamBookLib';

		var fetchBooks = function (db, callback) {
			var collection = db.collection('myBooks');
			collection.find({}).toArray(function (err, results) {
				if (err) {
					console.log('Books looking up failed: ' + err);
					res.redirect('/');
				} else {
					callback(results);
				}
			});
		};

		MongoClient.connect(url, function (err, db) {
			if (err) {
				console.log('DB connection failed: ' + err);
				res.redirect('/');
			} else {
				fetchBooks(db, function (results) {
					db.close();
					res.render('bookListView', {
						nav: nav,
						books: results
					});
				});
			}
		});

	};

	var getBookById = function (req, res) {
		var id = new ObjectID(req.params.id);
		var url = 'mongodb://localhost:27017/adamBookLib';

		var fetchSingleBook = function (db, callback) {
			var collection = db.collection('myBooks');
			collection.find({
				_id: id
			}).toArray(function (err, result) {
				if (err) {
					console.log('Book Fetching failed: ' + err);
					res.redirect('/');
				} else {
					callback(result);
				}
			});
		};

		MongoClient.connect(url, function (err, db) {
			if (err) {
				console.log('DB connection failed: ' + err);
				res.redirect('/');
			} else {
				fetchSingleBook(db, function (result) {
					db.close();
					console.log('here0');
					var bookid = result[0].bookId;
					console.log(bookid);
					bookService.getBook(bookid, function (book) {
						res.render('bookView', {
							nav: nav,
							book: book
						});
					});
				});
			}
		});
	};

	var gate = function (req, res, next) {
		if (!req.user) {
			return res.redirect('/');
		}
		next();
	};

	return {
		getIndex: getIndex,
		getBookById: getBookById,
		gate: gate
	};
};

module.exports = bookController;