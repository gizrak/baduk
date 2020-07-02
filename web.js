/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');

var app = express();

// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);

// development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var port = process.env.PORT || 5000;
http.createServer(app).listen(port, function() {
	console.log('Express server listening on port ' + port);
});

