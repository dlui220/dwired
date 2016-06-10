
// app/routes.js
module.exports = function(app, passport) {

    var mongoose = require('mongoose');
    var message = require('../app/msg_model.js');
    var configDB = require('../config/database.js');

    //connect to database file (which contains db url)
    mongoose.connect(configDB.url);
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function(){
        console.log("Connected to DataBase");
        //do operations which involve interacting with DB.
    });

    var html_string = "";
    // Base code for querying everything in the database
    // Fetches previous messages and formats them into html_string
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
 

    app.get('/', function(req, res) {
				res.render('index.ejs');
		});

		app.get('/login', function(req, res) {
				res.render('login.ejs'); //load login.ejs files
		});

		app.get('/dashboard', isLoggedIn, function(req, res) {
				res.render('dash.ejs', {
						user : req.user // get the user out of session and pass to template
				});
		});

		app.get('/chat', isLoggedIn, function(req, res) {
				message.find(function (err, messages) {
						if (err) {
								return console.error(err);
						}
						// console.log(messages);
						// console.log(messages.length);
						for (i=0;i<messages.length;i++){
								if (messages[i]['name'] == "Bob"){ //req.user.username ){ // checks if session matches message
										html_string += '<div class="ui left floated segment center aligned chat-bubble">' + '<p>'+ messages[i]['message'] + '</p>' + '</div>';
								} else {
										html_string += '<div class="ui left floated segment center aligned chat-bubble">' + '<p>'+ messages[i]['message'] + '</p>' + '</div>';
								}
						}
				});
				res.render('messages.ejs', {
						user : req.user, // get the user out of session and pass to template
						m : html_string
				});
		});

		app.get('/files', function(req, res) {
				res.render('files.ejs', {
						user : req.user // get the user out of session and pass to template
				});
		});

		// route for logging out
		app.get('/logout', function(req, res) {
				req.logout();
				res.redirect('/');
		});

		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
						passport.authenticate('google', {
								successRedirect : '/dashboard',
								failureRedirect : '/'
						}));
};
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
		// if user is authenticated in the session, carry on
		if (req.isAuthenticated())
				return next();

		// if they aren't redirect them to the home page
		res.redirect('/');
}
