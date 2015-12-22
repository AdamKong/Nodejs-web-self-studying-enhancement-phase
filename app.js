var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var port = process.env.PORT || 5000;
var host = '127.0.0.1';
var nav = [{
		text: 'Books',
		link: '/books'
	}, {
		text: 'Authors',
		link: '/authors'
}];

app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/src/views'));
app.set('views', './src/views');
//app.set('view engine', 'jade');
//var handlebars = require('express-handlebars');
//app.engine('.hbs', handlebars({extname:'.hbs'}));
app.set('view engine', 'ejs');

var bookRouter = require('./src/routes/bookRouter')(nav);
var adminRouter = require('./src/routes/adminRouter')(nav);
var authRouter = require('./src/routes/authRouter')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
	secret: 'Adam God',
	resave: false,
	saveUninitialized: false
}));
require('./src/config/passport')(app);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', function (req, res) {
    res.render('index',{
		nav: nav
	});
});

app.listen(port, host, function (err) {
    console.log('Server is ready on ' + host + ':' + port + '!');
});

