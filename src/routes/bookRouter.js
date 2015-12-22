var express = require('express');
var bookRouter = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectId;

var router = function (nav) {

	var bookService = require('../services/bookService')();

	var bookController = require('../controllers/bookController')(bookService, nav);

	bookRouter.use(bookController.gate);

	bookRouter.route('/')
		.get(bookController.getIndex);

	bookRouter.route('/:id')
		.get(bookController.getBookById);

	return bookRouter;
};

module.exports = router;