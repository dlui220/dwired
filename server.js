var express = require('express');
var app = express();

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost/test';

var port = process.env.PORT || 8000;
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');


MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        //HURRAY!! We are connected. :)
        console.log('Connection established to', url);
        // do some work here with the database.            
        //Close connection
        db.close();
    }
});

var session = require('express-session');

var http = require('http').Server(app);
var io = require('socket.io')(http);

//connect to database file (which contains db url)


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
require('./app/routes.js')(app, passport); // load routes and pass in app + configured passport
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        if (msg.length > 0) {
            io.emit('chat message', msg);	 
            MongoClient.connect(url, function (err, db) {
                if (err) {
                    console.log('Unable to connect to the mongoDB server. Error:', err);
                } else {
                    //HURRAY!! We are connected. :)
                    console.log('Adding messages to db');
                    // do some work here with the database.    
                    var messages = db.collection('messages');

                    //Close connection
                    db.close();
                }
            });    
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

