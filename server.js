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
var db = mongoose.connection;
require('./config/passport')(passport);
app.use(morgan('dev')); //log every rq to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

//Mongo
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
		console.log("Connected to DataBase");
		//do operations which involve interacting with DB.
});
//

//Create a schema for a message
var msgSchema = mongoose.Schema({
    name: String,
    message: String,
    time: Number
});

var message = mongoose.model('message', msgSchema);

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//routes
require('./app/routes.js')(app, passport); // loud routes and pass in app + configured passport
app.use(express.static(__dirname + '/public'));

var html_string = "";

io.on('connection', function(socket){

		// Base code for querying everything in the database
		// Fetches previous messages and formats them into html_string
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
		message.find(function (err, messages) {
				if (err) return console.error(err);
				// console.log(messages);
				// console.log(messages.length);
				for (i=0;i<messages.length;i++){
						if (messages[i]['name'] == "Bob"){ //req.user.username ){ // checks if session matches message
								html_string += '<div class="ui right floated segment right aligned chat-bubble">' + '<p>'+ messages[i]['name'] + " :<br>" + messages[i]['message'] + '</p>' + '</div>';
						} else {
								html_string += '<div class="ui right floated segment left aligned chat-bubble">' + '<p>'+ messages[i]['name'] + " :<br>" + messages[i]['message'] + '</p>' + '</div>';
						}
						
						
				}
				// console.log(html_string);
		});

/*

 <div class="ui right floated segment right aligned chat-bubble">
 <p>
 Tousled health goth chillwave, lumbersexual salvia humblebrag taxidermy whatever mustache pinterest banjo. Hella artisan sustainable pop-up, blog before they sold out ramps occupy lo-fi.
 </p>
 </div>

 */
		
socket.on('chat message', function(msg, req, res){
		if (msg.length > 0) {
				io.emit('chat message', msg);
						
				//Insert into MongoDB database
				var tmp = new message({
						name: res.locals.user,
						message: msg,
						time: 10 // will implement real time eventually
				});
						
				tmp.save(function(err){
						if ( err ) throw err;
						console.log(tmp);
				});
				/*var queryMsg = function(){
				 message.find({name : "Bob"}, "name message time", function(err, result){
				 if ( err ) throw err;
				 console.log("Find Operations: " + result);
				 });
				 };*/		
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

