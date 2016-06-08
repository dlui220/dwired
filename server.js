var express = require('express');
var app = express();

var port = process.env.PORT || 8000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');


var http = require('http').Server(app);
var io = require('socket.io')(http);

//connect to database file (which contains db url)
mongoose.connect(configDB.url);
require('./config/passport')(passport);
app.use(morgan('dev')); //log every rq to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//routes
require('./app/routes.js')(app, passport); // loud routes and pass in app + configured passport
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
		socket.on('chat message', function(msg){
				if (msg.length > 0) {
						io.emit('chat message', msg);	  
				};
		});
});

io.on('connection', function(socket){
		console.log('a user connected');
		socket.on('disconnect', function(){
				console.log('user disconnected');
		});
});

///// launch
http.listen(8000, function(){
 		console.log('listening on *:8000');
 });

