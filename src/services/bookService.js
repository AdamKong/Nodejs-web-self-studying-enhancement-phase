var http = require('http');
var parseString = require('xml2js').parseString;

var bookService = function () {

	var getBook = function (id, callback) {

		var book = {};

		var options = {
			hostname: 'www.goodreads.com',
			path: '/book/show/' + id + '?format=xml&key=L5XNAD4FCHXP4ngSkRMew',
			method: 'get'
		};

		http.request(options, function (res) {
			console.log('Status: ' + res.statusCode);
			res.setEncoding('utf8');
			var str = '';
			res.on('data', function (chunk) {
				str += chunk;
			});
			res.on('end', function () {
				parseString(str, function (err, result) {
					if (err) {
						console.log('parsing xml content error: ' + err);
					} else {
						book = result.GoodreadsResponse.book[0];
						console.log(book);
						console.log('here2');
					}
					callback(book);
				});
			});
		}).end();
	};

	return {
		getBook : getBook
	};
};

module.exports = bookService;